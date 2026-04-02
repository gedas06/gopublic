import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  console.log('GET /api/clients - user:', user?.id ?? 'NO USER', userError?.message ?? '')

  if (!user) return NextResponse.json({ error: 'Unauthorized', clients: [] }, { status: 401 })

  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message, clients: [] }, { status: 500 })
  return NextResponse.json({ clients: clients ?? [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  console.log('POST /api/clients - user:', user?.id ?? 'NO USER', userError?.message ?? '')

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { data: client, error } = await supabase
    .from('clients')
    .insert({
      name: body.name,
      email: body.email ?? null,
      rate_type: body.rate_type,
      rate_amount: body.rate_amount,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ client })
}
