import type { Comment, ConnectedAccount, Template, Notification, AutoRule } from '../types'

export const mockComments: Comment[] = [
  {
    id: 'C-001', platform: 'instagram', sourceType: 'comment',
    username: 'Aisyah Razak', userInitials: 'AR', accountName: '@mintgemuk',
    text: 'Berapa harga food dia? Nak order untuk kucing saya 🐱',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    sentiment: 'question', language: 'ms', status: 'pending', isRead: false,
    post: { id: 'P1', caption: 'Introducing our new cat food range 🐾', color: '#E1306C' },
    aiSuggestions: [
      { tone: 'friendly',     text: 'Harga makanan kucing kami bermula RM25/kg! DM kami untuk senarai harga penuh & promo terkini 🐾' },
      { tone: 'professional', text: 'Terima kasih atas minat anda. Harga bermula dari RM25/kg. Sila hubungi kami melalui DM untuk maklumat lanjut.' },
      { tone: 'sales',        text: 'Harga bermula RM25/kg sahaja! 🎉 DM kami sekarang & dapatkan diskaun 10% untuk order pertama anda!' },
    ],
  },
  {
    id: 'C-002', platform: 'facebook', sourceType: 'comment',
    username: 'Hafiz Azmi', userInitials: 'HA', accountName: 'MintGemuk Official',
    text: 'Dah 3 hari order tak sampai lagi. Seriously tak profesional 😡',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    sentiment: 'negative', language: 'ms', status: 'pending', isRead: false,
    post: { id: 'P2', caption: 'Free delivery for orders above RM100', color: '#1877F2' },
    aiSuggestions: [
      { tone: 'friendly',     text: 'Maaf sangat Hafiz! Boleh PM kami no tracking & no order? Kami akan semak segera 🙏' },
      { tone: 'professional', text: 'Kami memohon maaf atas kelewatan ini. Sila hubungi kami melalui DM dengan nombor pesanan anda untuk semakan segera.' },
      { tone: 'sales',        text: 'Maaf atas inconvenience! PM kami segera — kami akan prioritise semakan anda dan tambah RM10 voucher sebagai pampasan 🙏' },
    ],
  },
  {
    id: 'C-003', platform: 'youtube', sourceType: 'comment',
    username: 'Sarah Lee', userInitials: 'SL', accountName: 'MintGemuk TV',
    text: 'Love this content! How often do you post new videos?',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    sentiment: 'positive', language: 'en', status: 'pending', isRead: false,
    post: { id: 'P3', caption: 'How I grew my cat food business from zero', color: '#FF0000' },
    aiSuggestions: [
      { tone: 'friendly',     text: 'Thank you Sarah! 😊 We post every Tuesday & Friday — subscribe so you never miss out! 🎬' },
      { tone: 'professional', text: 'Thank you for your kind feedback. We publish new content every Tuesday and Friday. Please subscribe to stay updated.' },
      { tone: 'sales',        text: 'Thanks Sarah! 🎉 We drop new videos Tue & Fri! Hit subscribe + the 🔔 bell — and check our latest product links in description!' },
    ],
  },
  {
    id: 'C-004', platform: 'tiktok', sourceType: 'comment',
    username: 'Zara Hamdan', userInitials: 'ZH', accountName: '@mintgemuk',
    text: 'Comel gila kucing tu! Ada jual tak? 😍',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    sentiment: 'question', language: 'ms', status: 'pending', isRead: false,
    post: { id: 'P4', caption: 'Gemuk si kucing comel MintG 🐱', color: '#111827' },
    aiSuggestions: [
      { tone: 'friendly',     text: 'Hahaha comel kan! 😍 Gemuk ni tak jual tapi product dia ada! DM kami untuk tahu lebih lanjut 🐾' },
      { tone: 'professional', text: 'Terima kasih atas minat anda. Kucing kami tidak dijual tetapi produk penjagaan haiwan tersedia. Sila hubungi kami.' },
      { tone: 'sales',        text: 'Gemuk memang iconic! 😂 Dia tak jual tapi makanan dia ada! DM kami sekarang — ada promo weekend ni 🎁' },
    ],
  },
  {
    id: 'C-005', platform: 'instagram', sourceType: 'comment',
    username: 'Spam Bot 9999', userInitials: 'SB', accountName: '@mintgemuk',
    text: 'WIN FREE IPHONE 15! CLICK LINK IN BIO!!!!! 🎁🎁🎁',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    sentiment: 'neutral', language: 'en', status: 'spam', isRead: true,
    post: { id: 'P1', caption: 'Introducing our new cat food range 🐾', color: '#E1306C' },
    aiSuggestions: [],
  },

  // DMs
  {
    id: 'DM-001', platform: 'facebook', sourceType: 'dm',
    username: 'Hasnah Yusof', userInitials: 'HY', accountName: 'MintGemuk Official',
    text: 'Saya nak order untuk majlis kahwin 80 pax. Boleh buat?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    sentiment: 'question', language: 'ms', status: 'pending', isRead: false,
    aiSuggestions: [
      { tone: 'friendly',     text: 'Wah tahniah! 🎉 Boleh je! Kami ada pakej korporat untuk 80 pax. Boleh share details & tarikh event? Kami bagi quotation segera 😊' },
      { tone: 'professional', text: 'Tahniah atas majlis akan datang. Kami menyediakan pakej korporat. Sila berikan tarikh dan keperluan event untuk sebut harga.' },
      { tone: 'sales',        text: 'Congrats! 🎊 Order 80 pax layak dapat diskaun 15% + free packaging khas! Boleh share tarikh? Kami proses ASAP 🚀' },
    ],
  },
  {
    id: 'DM-002', platform: 'instagram', sourceType: 'dm',
    username: 'Janice Wong', userInitials: 'JW', accountName: '@mintgemuk',
    text: 'Hi, is the olive hoodie still available in size M?',
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    sentiment: 'question', language: 'en', status: 'pending', isRead: false,
    aiSuggestions: [
      { tone: 'friendly',     text: 'Hi Janice! 😊 Let me check stock for you right now! We\'ll confirm within the hour 🙏' },
      { tone: 'professional', text: 'Hello Janice. Thank you for your inquiry. We will check availability for the olive hoodie in size M and revert shortly.' },
      { tone: 'sales',        text: 'Hi Janice! The olive hoodie is super popular 🔥 Let me check — and if we have it, we can hold it for 24hrs for you!' },
    ],
  },
]

export const mockAccounts: ConnectedAccount[] = [
  { id: 'CA-001', platform: 'instagram', name: 'MintGemuk', handle: '@mintgemuk', connected: true,  followers: 24800, commentsToday: 48, status: 'connected'    },
  { id: 'CA-002', platform: 'facebook',  name: 'MintGemuk Official', handle: 'MintGemuk Official', connected: true,  followers: 12400, commentsToday: 31, status: 'connected'    },
  { id: 'CA-003', platform: 'youtube',   name: 'MintGemuk TV', handle: '@mintgemuk', connected: false, followers: 6300,  commentsToday: 0,  status: 'disconnected' },
  { id: 'CA-004', platform: 'tiktok',    name: 'MintGemuk TikTok', handle: '@mintgemuk', connected: false, followers: 41200, commentsToday: 0,  status: 'limited'      },
]

export const mockTemplates: Template[] = [
  { id: 'T-001', category: 'Sales',    title: 'Pricing Info',    body: 'Hi! Our prices start from RM 25/kg. DM us for full price list 😊', language: 'en' },
  { id: 'T-002', category: 'Sales',    title: 'Maklumat Harga',  body: 'Harga bermula RM25/kg! DM kami untuk senarai harga penuh 😊',       language: 'ms' },
  { id: 'T-003', category: 'Sales',    title: 'COD Available',   body: 'COD available in Klang Valley! DM us to place your order 🛍️',       language: 'en' },
  { id: 'T-004', category: 'General',  title: 'Thank You',       body: 'Thank you so much! We appreciate your support ❤️',                  language: 'en' },
  { id: 'T-005', category: 'General',  title: 'Terima Kasih',    body: 'Terima kasih banyak! Kami amat menghargai sokongan anda ❤️',         language: 'ms' },
  { id: 'T-006', category: 'Support',  title: 'Out of Stock',    body: 'Sorry! This item is currently out of stock. Restock soon! 🙏',       language: 'en' },
  { id: 'T-007', category: 'Delivery', title: 'Delivery Time',   body: 'Orders delivered within 1-3 working days after payment 📦',          language: 'en' },
  { id: 'T-008', category: 'Delivery', title: 'Masa Penghantaran', body: 'Pesanan dihantar dalam 1-3 hari bekerja selepas pembayaran 📦',     language: 'ms' },
]

export const mockNotifications: Notification[] = [
  { id: 'N-001', type: 'comment', title: 'New complaint detected',  subtitle: 'Facebook · 2m ago',          unread: true,  group: 'Today',     timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()    },
  { id: 'N-002', type: 'reply',   title: 'New lead detected',       subtitle: 'Instagram · 10m ago',        unread: true,  group: 'Today',     timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()   },
  { id: 'N-003', type: 'auto',    title: 'Auto reply sent',         subtitle: 'to Sarah Lee · 1h ago',      unread: false, group: 'Today',     timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()   },
  { id: 'N-004', type: 'system',  title: 'Weekly analytics ready',  subtitle: 'View your report · 9:00 PM', unread: false, group: 'Yesterday', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: 'N-005', type: 'comment', title: 'New DM from Zara',        subtitle: 'Instagram · 6:30 PM',        unread: false, group: 'Yesterday', timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString() },
  { id: 'N-006', type: 'system',  title: 'TikTok account connected', subtitle: 'Monday',                    unread: false, group: 'This Week',  timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
]

export const mockAutoRules: AutoRule[] = [
  { id: 'AR-001', name: 'Answer FAQs',              desc: 'Auto reply to common questions',  on: true  },
  { id: 'AR-002', name: 'Thank You Messages',       desc: 'Auto reply to positive comments', on: true  },
  { id: 'AR-003', name: 'Order & Delivery Updates', desc: 'Auto reply with order status',    on: false },
  { id: 'AR-004', name: 'Business Hours Only',      desc: 'Reply only 9AM – 9PM',            on: false },
]
