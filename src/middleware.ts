import { NextResponse, type NextRequest } from 'next/server'

// Firebase Auth is client-side only — no server-side session cookies.
// All auth protection is handled in the client components via useAuth().
// This middleware is kept minimal: it only sets COOP headers for Firebase popups.
export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Ensure Firebase Auth popups can communicate back
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
