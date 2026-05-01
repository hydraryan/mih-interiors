'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { Calendar, Clock, ArrowRight, Sparkles, BookOpen } from 'lucide-react'
import { getDirectImageUrl } from '@/lib/utils/imageUtils'

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blogs')
        const data = await res.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const featuredPost = posts.find(p => p.featured) || posts[0]
  const otherPosts = posts.filter(p => p._id !== featuredPost?._id)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-[#fbf4eb] text-charcoal-900 font-body selection:bg-brown-200 overflow-x-hidden">
      
      {/* CHAPTER 1: THE JOURNAL (Hero) */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-white pt-24 md:pt-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fbf4eb] z-20" />
          <Image 
            src="/blog-hero.png"
            alt="Editorial Sanctuary"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-30 text-center px-6">
          <ScrollReveal>
            <div className="flex flex-col items-center">
              <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-charcoal-900/10 bg-white/50 px-6 py-2.5 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-brown-600" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-charcoal-700">The MIH Journal</span>
              </div>
              
              <h1 className="font-display text-7xl md:text-[11rem] leading-[0.8] text-charcoal-900 tracking-tighter">
                Perspectives <br />
                <span className="italic text-brown-600">on Craft.</span>
              </h1>
              
              <p className="mt-12 max-w-2xl text-lg md:text-2xl leading-relaxed text-charcoal-500 font-light">
                A curated collection of design wisdom, architectural trends, and stories from the heart of our studio.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-32 mt-24 md:mt-32">
        
        {/* CHAPTER 2: THE FEATURED (Hero Narrative) */}
        {!loading && featuredPost && (
          <ScrollReveal delay={0.2}>
            <Link 
              href={`/blogs/${featuredPost.slug}`}
              className="group relative block w-full aspect-[21/9] md:aspect-[24/10] overflow-hidden rounded-[3.5rem] mb-32 bg-charcoal-100 shadow-2xl border-[8px] border-white"
            >
              <Image
                src={getDirectImageUrl(featuredPost.mainImage)}
                alt={featuredPost.title}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
              
              <div className="absolute bottom-12 left-12 right-12 z-20 flex flex-col items-start md:flex-row md:items-end justify-between gap-8">
                <div className="max-w-3xl space-y-6">
                  <div className="flex items-center gap-4 text-white font-bold text-[10px] uppercase tracking-[0.4em]">
                    <span className="px-4 py-1.5 rounded-full bg-brown-600 backdrop-blur-md text-white border border-white/20">Featured Post</span>
                    <span className="hidden md:inline">•</span>
                    <span className="hidden md:inline">{featuredPost.category}</span>
                  </div>
                  <h2 className="text-white font-display text-3xl md:text-5xl lg:text-6xl leading-tight group-hover:text-brown-100 transition-colors drop-shadow-2xl">
                    {featuredPost.title}
                  </h2>
                </div>
                
                <div className="hidden md:flex flex-col items-end gap-6">
                   <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-charcoal-900 group-hover:bg-brown-600 group-hover:text-white transition-all duration-500 shadow-2xl">
                      <ArrowRight className="h-6 w-6" />
                   </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        )}

        {/* CHAPTER 3: THE GRID (Journal Collection) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map(n => (
              <div key={n} className="aspect-[4/5] bg-white/50 animate-pulse rounded-[3rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {otherPosts.map((post, idx) => (
              <ScrollReveal key={post._id} delay={idx * 0.1}>
                <Link 
                  href={`/blogs/${post.slug}`}
                  className="group block bg-white rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-brown-900/5 transition-all duration-700 border border-charcoal-900/5 h-full flex flex-col"
                >
                  <div className="relative aspect-[4/5] overflow-hidden p-4">
                    <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-[#f6efe6]">
                      <Image
                        src={getDirectImageUrl(post.mainImage)}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-charcoal-900/5 group-hover:bg-transparent transition-all z-10" />
                      <div className="absolute top-6 left-6 z-20">
                        <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-charcoal-900 text-[9px] font-bold uppercase tracking-[0.3em] shadow-sm border border-charcoal-900/5">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-10 pt-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-charcoal-400 text-[9px] uppercase tracking-[0.4em] mb-6 font-bold">
                      <Calendar size={12} className="text-brown-400" />
                      <span>{formatDate(post.publishedAt)}</span>
                      <span className="opacity-20">•</span>
                      <Clock size={12} className="text-brown-400" />
                      <span>{post.readingTime}</span>
                    </div>
                    
                    <h3 className="font-display text-3xl text-charcoal-900 mb-6 group-hover:text-brown-700 transition-colors leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="font-body text-charcoal-500 text-sm leading-relaxed line-clamp-3 mb-10 font-light">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-auto pt-8 border-t border-charcoal-900/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-[#fbf4eb] flex items-center justify-center text-brown-600">
                            <BookOpen size={14} />
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal-400">Read Article</span>
                      </div>
                      <ArrowRight size={18} className="text-charcoal-300 group-hover:translate-x-2 group-hover:text-brown-600 transition-all duration-500" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        {posts.length === 0 && !loading && (
          <div className="text-center py-48">
            <h2 className="font-display text-4xl text-charcoal-300">The Journal is being curated.</h2>
            <p className="mt-4 font-body text-charcoal-400">Check back soon for new perspectives.</p>
          </div>
        )}
      </div>
    </div>
  )
}
