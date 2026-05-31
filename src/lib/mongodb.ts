import mongoose from 'mongoose'
import dns from 'dns'
import { promisify } from 'util'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mih-interiors'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

const SKIP_DB_ON_CONNECT = process.env.SKIP_DB_ON_CONNECT === '1' || process.env.SKIP_PRERENDER_DB === '1'

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (SKIP_DB_ON_CONNECT) {
    console.warn('⚠️ SKIP_DB_ON_CONNECT is set — skipping MongoDB connection.')
    return null
  }

  const maskedUri = MONGODB_URI.replace(/:([^@]+)@/, ':****@')
  console.log('🔌 Connecting to MongoDB:', maskedUri)

  let connectUri = MONGODB_URI

  // If the URI is an SRV URI and system DNS fails, try resolving SRV via Google DNS
  if (MONGODB_URI.startsWith('mongodb+srv://')) {
    try {
      const uriContent = MONGODB_URI.replace(/^mongodb\+srv:\/\//, '')
      const hostPart = uriContent.split('@').pop() || ''
      const srvHost = hostPart.split('/')[0].split('?')[0]
      const name = `_mongodb._tcp.${srvHost}`
      const resolver = new dns.Resolver()
      const resolveSrv = promisify(resolver.resolveSrv).bind(resolver)
      try {
        // try system resolver first
        const records = await resolveSrv(name)
        if (records && records.length) {
          // keep original SRV URI
        }
      } catch (sysErr) {
        // system resolver failed; try Google DNS
        try {
          resolver.setServers(['8.8.8.8'])
          const records = await resolveSrv(name)
          if (records && records.length) {
            // Build a non-SRV URI using the returned records
            const userInfoMatch = MONGODB_URI.match(/^mongodb\+srv:\/\/([^@]+)@/)
            const userInfo = userInfoMatch ? userInfoMatch[1] + '@' : ''
            const rest = MONGODB_URI.replace(/^mongodb\+srv:\/\//, '').replace(/^([^@]+@)?/, '')
            const dbAndQuery = rest.split('/').slice(1).join('/') // preserves db and query
            const hosts = records.map((r: any) => `${r.name}:${r.port}`).join(',')
            // Use &authSource=admin and &tls=true for fallback URI to match Atlas requirements
            const queryParams = dbAndQuery.includes('?') ? '&' : '?'
            const newUri = `mongodb://${userInfo}${hosts}/${dbAndQuery}${queryParams}authSource=admin&tls=true`
            connectUri = newUri
            console.log('Converted SRV URI to standard form for DNS fallback (masked):', connectUri.replace(/:([^@]+)@/, ':****@'))
          }
        } catch (gErr: any) {
          // fall through — will attempt normal connect which may trigger same error
          console.warn('SRV resolution failed with Google DNS as well:', gErr?.message || gErr)
        }
      }
    } catch (e: any) {
      // parsing or conversion failed; continue with original URI
      console.warn('Failed to convert SRV URI to standard form:', e?.message || e)
    }
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(connectUri, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e: any) {
    cached.promise = null
    // Provide helpful guidance for SRV / DNS failures and optionally allow skipping the connect
    if (e && (e.code === 'ENOTFOUND' || e.code === 'ECONNREFUSED' || /querySrv/i.test(e.message || ''))) {
      console.error('MongoDB SRV/DNS error while connecting:', e.message || e)
      console.error('If this is during a build or prerender, you can set SKIP_DB_ON_CONNECT=1 or SKIP_PRERENDER_DB=1 to bypass DB connection.')
      if (SKIP_DB_ON_CONNECT) {
        return null
      }
    }

    // Specific guidance for Atlas network / IP whitelist errors
    if (e && e.name === 'MongooseServerSelectionError') {
      console.error('MongooseServerSelectionError:', e.message)
      console.error('Common cause: MongoDB Atlas IP access list does not allow this machine. Add your IP to the Atlas Network Access list or allow 0.0.0.0/0 for testing: https://www.mongodb.com/docs/atlas/security-whitelist/')
    }

    // Re-throw so the caller can handle or return an appropriate 500
    throw e
  }

  return cached.conn
}

export default dbConnect
