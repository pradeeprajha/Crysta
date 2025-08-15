// src/lib/chatClient.ts
export async function sendMessage(userMessage: string) {
  const res = await fetch('/.netlify/functions/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userMessage }),
  })
  if (!res.ok) throw new Error('Request failed')
  const data = await res.json()
  return data.text as string
}
