import { redirect } from 'next/navigation'
import { urls } from '@/lib/urls'

export default function LoginForgotPasswordPage() {
  redirect(urls.admin('/login/forgot-password'))
}