import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/lib/models/BlogPost'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react'
import { getDirectImageUrl } from '@/lib/utils/imageUtils'

type Props = {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  await dbConnect()
  return BlogPost.findOne({ slug, publishStatus: 'published' })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.slug)
  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.seo?.title || `${post.title} | MIH Interiors Blog`,
    description: post.seo?.description || post.excerpt,
    keywords: post.seo?.keywords?.join(', '),
    alternates: {
      canonical: post.seo?.canonicalUrl || `https://mihinteriors.in/blogs/${post.slug}`,
    },
    openGraph: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      images: [post.seo?.ogImage || post.mainImage],
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
    },
  }
}

export default async function BlogPostDetail({ params }: Props) {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.slug)
  if (!post) notFound()

  // JSON-LD for Search Engines
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.excerpt,
    'image': post.mainImage,
    'author': {
      '@type': 'Person',
      'name': post.author.name,
      'jobTitle': post.author.role
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'MIH Interiors',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://mihinteriors.in/logo.png'
      }
    },
    'datePublished': post.publishedAt.toISOString(),
    'dateModified': post.updatedAt?.toISOString() || post.publishedAt.toISOString(),
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://mihinteriors.in/blogs/${post.slug}`
    }
  }

  return (
    <main className="bg-white min-h-screen pt-40 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto px-6 md:px-8">
        {/* Back link */}
        <ScrollReveal direction="left">
          <Link 
            href="/blogs" 
            className="inline-flex items-center gap-2 text-charcoal-400 hover:text-blush-500 font-body text-xs uppercase tracking-widest mb-12 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Wisdom
          </Link>
        </ScrollReveal>

        {/* Article Header */}
        <header className="mb-16">
          <ScrollReveal>
            <span className="text-blush-500 font-body uppercase tracking-[0.3em] text-[10px] font-bold mb-6 block">
              {post.category}
            </span>
            <h1 className="font-display text-4xl md:text-6xl text-brown-900 leading-tight mb-10">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-8 py-8 border-y border-cream-100">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-cream-200 overflow-hidden">
                  {post.author.image ? (
                    <Image src={post.author.image} alt={post.author.name} width={48} height={48} className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brown-800 font-display">MIH</div>
                  )}
                </div>
                <div>
                  <div className="font-display text-sm text-brown-800">{post.author.name}</div>
                  <div className="font-body text-[10px] text-charcoal-400 uppercase tracking-widest">{post.author.role}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-8 text-charcoal-400 text-xs font-body uppercase tracking-widest">
                <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="flex items-center gap-2"><Clock size={14} /> {post.readingTime}</span>
              </div>
            </div>
          </ScrollReveal>
        </header>

        {/* Featured Image */}
        <ScrollReveal delay={0.2}>
          <div className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-2xl mb-20 bg-cream-50">
            <Image
              src={getDirectImageUrl(post.mainImage)}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </ScrollReveal>

        {/* Content Section */}
        <div className="max-w-2xl mx-auto px-6 md:px-0">
          <ScrollReveal>
            <div 
              className="prose prose-lg prose-brown mx-auto font-body text-charcoal-700 break-words overflow-hidden
                prose-p:leading-[1.8] prose-p:mb-10 prose-p:text-left
                prose-headings:font-display prose-headings:text-brown-900 prose-headings:mb-8 prose-headings:mt-16 prose-headings:tracking-tight prose-headings:leading-[1.4]
                prose-strong:text-brown-900 prose-strong:font-bold
                prose-blockquote:border-l-4 prose-blockquote:border-blush-500 prose-blockquote:bg-cream-100/50 prose-blockquote:py-8 prose-blockquote:px-10 prose-blockquote:rounded-r-3xl prose-blockquote:italic prose-blockquote:text-brown-800 prose-blockquote:my-16 prose-blockquote:leading-[1.8]
                prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-img:my-16
                prose-a:text-blush-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline transition-all
                prose-li:mb-4 prose-li:leading-[1.8] prose-ol:my-10 prose-ul:my-10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </ScrollReveal>

          {/* Keywords / Tags */}
          {post.seo?.keywords && post.seo.keywords.length > 0 && (
            <div className="mt-20 pt-12 border-t border-cream-100">
              <div className="flex flex-wrap gap-2">
                {post.seo.keywords.map((tag: string) => (
                  <span key={tag} className="px-4 py-1.5 rounded-full bg-cream-50 text-charcoal-500 text-[10px] font-bold uppercase tracking-widest border border-cream-100">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Share */}
          <div className="mt-16 bg-charcoal-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h4 className="font-display text-xl mb-2">Share this insight</h4>
              <p className="font-body text-xs text-cream-100/50">Inspire your network with MIH design wisdom.</p>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full hover:bg-blush-500 transition-all group">
                <Share2 size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="font-body text-xs font-bold uppercase tracking-widest">Share Insight</span>
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="mt-40 px-6">
        <ScrollReveal>
          <div className="max-w-5xl mx-auto bg-cream-100 rounded-[3rem] p-12 md:p-20 relative overflow-hidden border border-cream-200">
            <div className="relative z-10 text-center">
              <span className="text-blush-500 font-body uppercase tracking-[0.3em] text-[10px] font-bold mb-6 block">Ready for your project?</span>
              <h2 className="font-display text-4xl md:text-5xl text-brown-900 mb-10">Turn these trends into <br /> your <span className="text-blush-500 italic">reality.</span></h2>
              <Link 
                href="#quote"
                className="inline-block bg-charcoal-900 text-white px-12 py-5 rounded-full font-body uppercase tracking-widest text-sm font-bold hover:bg-brown-800 transition-all duration-300 shadow-2xl"
              >
                Inquire Now
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
