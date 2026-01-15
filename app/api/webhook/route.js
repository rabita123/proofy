import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET // From Stripe dashboard

export async function POST(req) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response('Webhook Error', { status: 400 })
  }

  // Handle checkout session completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata.user_id

    // Update profile to Premium
    const { error } = await supabase
      .from('profiles')
      .update({ is_premium: true })
      .eq('id', userId)

    if (error) console.error('Failed to update profile to Premium:', error)
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
