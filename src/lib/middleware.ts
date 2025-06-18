import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    request.nextUrl.pathname !== '/'
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding')
    const isInfluencerProtectedRoute = request.nextUrl.pathname.startsWith('/dashboards/influencer')

    if (isOnboardingPage || isInfluencerProtectedRoute) {
      try {
        const { data: profile } = await supabase
          .from('influencer_profiles')
          .select('has_onboarded')
          .eq('user_id', user.id)
          .single()

        // If user hasn't onboarded and is trying to access protected routes
        if ((!profile?.has_onboarded || profile?.has_onboarded === false) && isInfluencerProtectedRoute) {
          const url = request.nextUrl.clone()
          url.pathname = '/onboarding/influencer'
          return NextResponse.redirect(url)
        }

        if (profile?.has_onboarded === true && isOnboardingPage) {
          const url = request.nextUrl.clone()
          url.pathname = '/dashboards/influencer'
          return NextResponse.redirect(url)
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        if (isInfluencerProtectedRoute) {
          const url = request.nextUrl.clone()
          url.pathname = '/onboarding/influencer'
          return NextResponse.redirect(url)
        }
      }
    }
  }

  return supabaseResponse
}
