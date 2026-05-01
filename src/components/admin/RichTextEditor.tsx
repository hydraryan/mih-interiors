'use client'

import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

type RichTextEditorProps = {
  value: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  // Dynamically import Quill to avoid SSR issues
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill-new'), { 
    ssr: false,
    loading: () => <div className="h-64 w-full bg-cream-50 animate-pulse rounded-md" />
  }), [])

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }],
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'align',
    'link', 'image', 'video',
    'color', 'background'
  ]

  return (
    <div className="bg-white rounded-md overflow-hidden border border-cream-200 shadow-inner">
      <ReactQuill 
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Write your masterpiece here..."}
        className="h-96 mb-12 font-body"
      />
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #f1ece4 !important;
          background: #fdfaf5;
          padding: 12px !important;
        }
        .ql-container.ql-snow {
          border: none !important;
          font-family: inherit !important;
          font-size: 16px !important;
        }
        .ql-editor {
          min-height: 384px;
          line-height: 1.6;
          padding: 24px !important;
        }
        .ql-editor.ql-blank::before {
          color: #a39e93 !important;
          font-style: italic;
        }
        .ql-snow .ql-stroke {
          stroke: #4a453e !important;
        }
        .ql-snow .ql-fill {
          fill: #4a453e !important;
        }
        .ql-snow.ql-toolbar button:hover .ql-stroke,
        .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: #c8a47e !important;
        }
      `}</style>
    </div>
  )
}
