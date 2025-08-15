// netlify/functions/chat.ts
export async function handler(event: any) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Allow browser preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' }
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing OPENAI_API_KEY' }),
    }
  }

  let userMessage = ''
  try {
    const body = JSON.parse(event.body || '{}')
    userMessage = body.userMessage || ''
  } catch {}

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // use a current model
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
    }),
  })

  const data = await resp.json()

  if (!resp.ok) {
    console.error('OpenAI error:', data)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'OpenAI request failed', details: data }),
    }
  }

  const text = data.choices?.[0]?.message?.content ?? ''
  return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ text }) }
}
