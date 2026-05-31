import { Suspense } from 'react'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f6efe6]" />}>
      <AdminLoginForm />
    </Suspense>
  )
}
