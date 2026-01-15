// Stripe functionality temporarily disabled
export async function POST(req) {
  return new Response(JSON.stringify({ error: 'Stripe not configured' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  })
}
