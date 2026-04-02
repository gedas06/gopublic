import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  console.log('GET /api/clients - session:', session?.user?.id ?? 'NO SESSION', sessionError ?? '')

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized', clients: [] }, { status: 401 })
  }

  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('clients fetch error:', error)
    return NextResponse.json({ error: error.message, clients: [] }, { status: 500 })
  }

  return NextResponse.json({ clients: clients ?? [] })
}

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const { data: { session } } = await supabase.auth.getSession()

  console.log('POST /api/clients - session:', session?.user?.id ?? 'NO SESSION')

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const { data: client, error } = await supabase
    .from('clients')
    .insert({
      name: body.name,
      email: body.email ?? null,
      rate_type: body.rate_type,
      rate_amount: body.rate_amount,
      user_id: session.user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('client insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ client })
}
