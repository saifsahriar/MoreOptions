import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Supabase Session Management
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user && request.nextUrl.pathname !== '/admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // 2. CSP Nonce Generation
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oqvcwfmbgmrjvffiyhhm.supabase.co';

  // React requires 'unsafe-eval' in development mode
  const isDev = process.env.NODE_ENV === 'development';
  const scriptSrc = isDev 
    ? `'self' 'nonce-${nonce}' 'unsafe-eval' 'strict-dynamic' https://www.googletagmanager.com https://hcaptcha.com https://*.hcaptcha.com`
    : `'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://hcaptcha.com https://*.hcaptcha.com`;

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com;
    font-src 'self';
    img-src 'self' data: ${supabaseUrl};
    connect-src 'self' https://www.google-analytics.com https://hcaptcha.com https://*.hcaptcha.com ${supabaseUrl};
    frame-src 'self' https://hcaptcha.com https://*.hcaptcha.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s{2,}/g, ' ').trim()

  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('x-nonce', nonce)
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
