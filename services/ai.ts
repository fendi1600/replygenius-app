import axios from 'axios'

// ── Fill in after getting your Anthropic API key ─────────────────────────────
// console.anthropic.com → API Keys
const CLAUDE_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY ?? ''
const CLAUDE_MODEL   = 'claude-haiku-4-5'   // fast + cheap for reply generation
const CLAUDE_URL     = 'https://api.anthropic.com/v1/messages'

export type ReplyTone = 'friendly' | 'professional' | 'sales'

interface GenerateReplyParams {
  commentText: string
  username: string
  platform: string
  tone: ReplyTone
  language: 'en' | 'ms'
  businessContext?: string
}

const TONE_INSTRUCTIONS: Record<ReplyTone, string> = {
  friendly:     'Warm, casual, use emoji occasionally. Make the customer feel valued.',
  professional: 'Formal, polished, no emoji. Represent the brand professionally.',
  sales:        'Helpful but subtly guide toward a purchase or DM. Include a soft call-to-action.',
}

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  en: 'Reply in English.',
  ms: 'Balas dalam Bahasa Melayu yang natural dan sopan.',
}

/**
 * Generate 3 AI reply suggestions for a comment.
 * Returns an array of { tone, text } objects.
 */
export async function generateReplies(params: GenerateReplyParams): Promise<{ tone: ReplyTone; text: string }[]> {
  const { commentText, username, platform, tone, language, businessContext } = params

  const systemPrompt = `You are ReplyGenius, an AI assistant that helps Malaysian small businesses reply to social media comments.
${businessContext ? `Business context: ${businessContext}` : ''}
Rules:
- Keep replies concise (1–3 sentences)
- Never make up prices or availability
- If you don't know the answer, invite the customer to DM
- ${LANGUAGE_INSTRUCTIONS[language] ?? LANGUAGE_INSTRUCTIONS.en}`

  const userPrompt = `Generate 3 reply options for this ${platform} comment by @${username}.
Comment: "${commentText}"

Reply styles needed:
1. Friendly tone: ${TONE_INSTRUCTIONS.friendly}
2. Professional tone: ${TONE_INSTRUCTIONS.professional}
3. Sales tone: ${TONE_INSTRUCTIONS.sales}

Return JSON only:
{
  "friendly": "...",
  "professional": "...",
  "sales": "..."
}`

  try {
    const res = await axios.post(
      CLAUDE_URL,
      {
        model: CLAUDE_MODEL,
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      },
      {
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      },
    )

    const raw = res.data.content[0].text
    const json = JSON.parse(raw.replace(/```json|```/g, '').trim())

    return [
      { tone: 'friendly',     text: json.friendly     ?? '' },
      { tone: 'professional', text: json.professional ?? '' },
      { tone: 'sales',        text: json.sales        ?? '' },
    ]
  } catch (err) {
    console.error('[AI] generateReplies error:', err)
    // Fallback — empty suggestions so the user can type manually
    return [
      { tone: 'friendly',     text: '' },
      { tone: 'professional', text: '' },
      { tone: 'sales',        text: '' },
    ]
  }
}

/**
 * Classify comment sentiment + language.
 */
export async function classifyComment(text: string): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative' | 'question'
  language: 'en' | 'ms' | 'id'
  isSpam: boolean
}> {
  try {
    const res = await axios.post(
      CLAUDE_URL,
      {
        model: CLAUDE_MODEL,
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: `Classify this comment. Return JSON only.
Comment: "${text}"
JSON: { "sentiment": "positive"|"neutral"|"negative"|"question", "language": "en"|"ms"|"id", "isSpam": true|false }`,
        }],
      },
      {
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      },
    )
    const raw = res.data.content[0].text
    return JSON.parse(raw.replace(/```json|```/g, '').trim())
  } catch {
    return { sentiment: 'neutral', language: 'en', isSpam: false }
  }
}

/**
 * Test API connectivity — call this from Settings screen.
 */
export async function testConnection(): Promise<{ ok: boolean; model: string; latencyMs: number }> {
  const start = Date.now()
  try {
    const res = await axios.post(
      CLAUDE_URL,
      {
        model: CLAUDE_MODEL,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Say "ok"' }],
      },
      {
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      },
    )
    return { ok: true, model: res.data.model, latencyMs: Date.now() - start }
  } catch {
    return { ok: false, model: '', latencyMs: Date.now() - start }
  }
}
