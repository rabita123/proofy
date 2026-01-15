// Stripe webhook temporarily disabled
export async function POST(req) {
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
