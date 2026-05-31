'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Edit2, ExternalLink, FileText, Check, Clock } from 'lucide-react'
import { getDirectImageUrl } from '@/lib/utils/imageUtils'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blogs?limit=100')
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    
    try {
      const res = await fetch(`/api/blogs/${slug}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts(posts.filter(p => p.slug !== slug))
      }
    } catch (error) {
      alert('Failed to delete blog post')
    }
  }

  return (
    <div className="bg-cream-100 min-h-screen p-8 text-charcoal-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-display text-4xl text-brown-800">Blog Management</h1>
            <p className="font-body text-charcoal-500 mt-2 text-sm italic underline">admin.localhost:3000/blogs</p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/admin/blogs/new" 
              className="bg-brown-800 text-white px-6 py-2.5 rounded-md font-body text-sm flex items-center gap-2 hover:bg-brown-900 transition-colors"
            >
              <Plus size={18} />
              Add New Post
            </Link>
            <Link 
              href="/admin" 
              className="text-sm font-body text-charcoal-600 hover:text-brown-800 underline self-center"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-800"></div>
          </div>
        ) : (
          <div className="bg-white rounded-sm border border-cream-200 overflow-hidden shadow-sm">
            <table className="w-full text-left font-body text-sm">
              <thead className="bg-cream-50 border-b border-cream-200 text-charcoal-400 uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4">Preview</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-12 relative rounded overflow-hidden bg-cream-100 border border-cream-200">
                        <img 
                          src={getDirectImageUrl(post.mainImage)} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-semibold text-charcoal-900 truncate" title={post.title}>{post.title}</div>
                      <div className="text-[10px] text-charcoal-400 font-mono mt-1">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-cream-100 text-charcoal-600 text-[10px] font-bold uppercase tracking-tighter">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-charcoal-500 whitespace-nowrap">
                      {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${post.publishStatus === 'published' ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <span className={`text-[10px] font-bold uppercase ${post.publishStatus === 'published' ? 'text-green-700' : 'text-amber-700'}`}>
                          {post.publishStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link 
                          href={`/blogs/${post.slug}`} 
                          target="_blank"
                          className="p-2 text-charcoal-400 hover:text-blush-500 transition-colors"
                          title="View on site"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <Link 
                          href={`/admin/blogs/edit/${post.slug}`}
                          className="p-2 text-charcoal-400 hover:text-blue-500 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => deletePost(post.slug)}
                          className="p-2 text-charcoal-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {posts.length === 0 && (
              <div className="text-center py-20 text-charcoal-400">
                No blog posts found. Share your wisdom with the world!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
