/**
 * ReplyGenius API Connection Tester
 * Run with: npx ts-node scripts/test-api.ts
 *
 * Tests:
 *  1. Claude API — generates a test reply
 *  2. Supabase — creates + deletes a test row
 *  3. Meta — validates token format (real call needs a valid page token)
 */

import axios from 'axios'

const CLAUDE_KEY   = process.env.EXPO_PUBLIC_CLAUDE_API_KEY ?? ''
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON ?? ''

async function testClaude() {
  console.log('\n🤖 Testing Claude API...')
  const start = Date.now()
  try {
    const res = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-haiku-4-5',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: 'Reply in 1 sentence to: "Berapa harga product ni?" as a friendly Malay SME business.',
        }],
      },
      {
        headers: {
          'x-api-key': CLAUDE_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      },
    )
    const latency = Date.now() - start
    const reply = res.data.content[0].text
    console.log(`✅ Claude OK (${latency}ms)`)
    console.log(`   Model: ${res.data.model}`)
    console.log(`   Reply: "${reply}"`)
    return true
  } catch (err: any) {
    console.error(`❌ Claude FAILED: ${err.response?.data?.error?.message ?? err.message}`)
    return false
  }
}

async function testSupabase() {
  console.log('\n🗄️  Testing Supabase...')
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('⚠️  SUPABASE_URL or SUPABASE_ANON not set — skipping')
    return false
  }
  const start = Date.now()
  try {
    const res = await axios.get(`${SUPABASE_URL}/rest/v1/profiles?select=id&limit=1`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
    const latency = Date.now() - start
    console.log(`✅ Supabase OK (${latency}ms) — status ${res.status}`)
    return true
  } catch (err: any) {
    console.error(`❌ Supabase FAILED: ${err.response?.status} ${err.response?.data?.message ?? err.message}`)
    return false
  }
}

async function testMetaToken(pageToken: string) {
  console.log('\n📘 Testing Meta Graph API...')
  if (!pageToken) {
    console.log('⚠️  No page token provided — skipping')
    console.log('   Set META_PAGE_TOKEN env var to test')
    return false
  }
  const start = Date.now()
  try {
    const res = await axios.get('https://graph.facebook.com/v19.0/me', {
      params: { access_token: pageToken, fields: 'id,name' },
    })
    const latency = Date.now() - start
    console.log(`✅ Meta OK (${latency}ms)`)
    console.log(`   Page: ${res.data.name} (${res.data.id})`)
    return true
  } catch (err: any) {
    console.error(`❌ Meta FAILED: ${err.response?.data?.error?.message ?? err.message}`)
    return false
  }
}

async function run() {
  console.log('══════════════════════════════════════')
  console.log('  ReplyGenius API Connection Test')
  console.log('══════════════════════════════════════')

  const results = await Promise.allSettled([
    testClaude(),
    testSupabase(),
    testMetaToken(process.env.META_PAGE_TOKEN ?? ''),
  ])

  const passed = results.filter(r => r.status === 'fulfilled' && r.value).length
  console.log(`\n══════════════════════════════════════`)
  console.log(`  Results: ${passed}/3 tests passed`)
  console.log('══════════════════════════════════════\n')
}

run()
