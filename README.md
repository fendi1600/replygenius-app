# ReplyGenius Mobile App 📱

AI-powered social media reply assistant for Malaysian SMEs.  
Built with **Expo** · **React Native** · **TypeScript** · **Supabase** · **Claude AI**

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your keys
cp .env.example .env

# 3. Start dev server
npx expo start

# 4. Scan QR with Expo Go app (iOS/Android)
```

---

## 🔑 Environment Variables

Fill in `.env` after creating each service:

| Variable | Where to get it |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | supabase.com → Project Settings → API |
| `EXPO_PUBLIC_SUPABASE_ANON` | supabase.com → Project Settings → API |
| `EXPO_PUBLIC_CLAUDE_API_KEY` | console.anthropic.com → API Keys |
| `EXPO_PUBLIC_META_APP_ID` | developers.facebook.com → App Settings |
| `EXPO_PUBLIC_META_APP_SECRET` | developers.facebook.com → App Settings |

---

## 🗄️ Database Setup

1. Go to **supabase.com** → SQL Editor
2. Paste and run `supabase/schema.sql`
3. Go to Authentication → Email → Enable email signups

---

## 🔌 Meta API Setup (MVP1 — FB + IG)

1. **developers.facebook.com** → Create App → Business type
2. Add products: **Facebook Login**, **Pages API**, **Instagram Graph API**
3. Get permissions:
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `pages_messaging`
   - `instagram_basic`
   - `instagram_manage_comments`
   - `instagram_manage_messages` *(requires Business Verification)*
4. Deploy webhook: `supabase functions deploy meta-webhook`
5. Set webhook secrets:
   ```bash
   supabase secrets set META_VERIFY_TOKEN=your-random-token
   supabase secrets set META_APP_SECRET=your-app-secret
   ```
6. In Meta App Dashboard → Webhooks → Subscribe to: `feed`, `messages`, `comments`

---

## 🤖 Test API Connections

```bash
# Add your keys to .env first, then:
META_PAGE_TOKEN=your_page_token npx ts-node scripts/test-api.ts
```

---

## 📱 Build for Device

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build Android APK (preview)
eas build --platform android --profile preview

# Build iOS (simulator)
eas build --platform ios --profile development
```

---

## 🌐 Dual Language

- English (`i18n/en.json`) and Bahasa Melayu (`i18n/ms.json`)
- Auto-detects device language
- User can switch in Settings → Language

---

## 📁 Project Structure

```
app/
├── (auth)/          splash, signin, signup
├── (tabs)/          home, inbox, analytics, accounts, templates, notifications, settings, rules
└── reply/[id].tsx   AI reply detail screen
components/ui/       Button, Card, Avatar, Toggle, Badge, PlatformBadge, LogoMark
services/            meta.ts, ai.ts, supabase.ts
stores/              useAuthStore, useInboxStore
i18n/                en.json, ms.json
supabase/            schema.sql, edge-functions/
```

---

## 🗓️ Roadmap

- **MVP1** (now): FB + IG comments + DMs, AI reply, basic analytics
- **MVP2**: TikTok + YouTube, auto-reply rules, advanced analytics
- **MVP3**: WhatsApp Business API, team collaboration, agency dashboard

---

Built by MintG · Powered by Anthropic Claude
