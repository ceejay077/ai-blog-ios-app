# SEO Article Generator 📝

A professional React Native mobile application for generating SEO-optimized blog articles using AI, built with Expo, Supabase, and Anthropic Claude.

## ✨ Features

### Core Functionality
- 🔐 **User Authentication** - Secure email/password login and signup
- 🤖 **AI Article Generation** - Powered by Anthropic Claude 3.5 Sonnet
- 📊 **SEO Optimization** - Keyword integration and audience targeting
- 💳 **Payment System** - $4.99 per article generation (UI ready)
- 📱 **Responsive Design** - Optimized for iPhone with clean, minimal UI

### User Tiers
- **Free Tier**: 500 words max, no image uploads
- **Premium Tier**: Unlimited words (up to 2000), image uploads with alt text

### Article Management
- 📚 **Article History** - View all previously generated articles
- 📄 **PDF Export** - Download articles as formatted PDFs
- 📋 **Copy to Clipboard** - Quick content sharing
- 🌐 **Social Share Buttons** - Ready for Twitter, Facebook, LinkedIn, WhatsApp

### Premium Features
- 🖼️ **Image Uploads** - Add images with SEO-friendly alt text
- ♾️ **Unlimited Words** - Generate longer, comprehensive articles
- ⚡ **Priority Support** - Get help when you need it

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Expo CLI
- iOS Simulator or iPhone with Expo Go
- Supabase account
- Anthropic API key

### Installation

1. **Clone and Install**
```bash
cd my-seo-article-generator
npm install
```

2. **Set Up Database**
   - Open Supabase Dashboard
   - Run the SQL in `supabase-schema.sql`
   - Create `article-images` storage bucket

3. **Start the App**
```bash
npm start
```

4. **Run on iOS**
```bash
npm run ios
# OR scan QR code with Expo Go app
```

## 📖 Documentation

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🏗️ Architecture

```
├── app/                    # Expo Router pages
│   ├── (app)/             # Protected app screens
│   ├── (auth)/            # Authentication screens
│   ├── index.tsx          # Welcome screen
│   └── _layout.tsx        # Root layout
├── contexts/              # React Context providers
├── lib/                   # API clients and utilities
├── .env                   # Environment variables
└── supabase-schema.sql    # Database schema
```

## 🛠️ Tech Stack

- **Frontend**: React Native, Expo, TypeScript
- **Navigation**: Expo Router (file-based)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: Anthropic Claude 3.5 Sonnet
- **State Management**: React Context
- **Styling**: React Native StyleSheet

## 📱 Screenshots

### Welcome Screen
Clean landing page with app branding and call-to-action.

### Create Article
Intuitive form with:
- Article title and keywords
- Target audience selection
- Tone customization
- Image upload (Premium)
- Real-time tier indication

### Generated Article
Professional article display with:
- Word count tracking
- One-tap actions (Regenerate, Download, Copy)
- Social sharing options

### Profile & Settings
User dashboard showing:
- Account statistics
- Premium upgrade options
- Article history access
- Secure logout

## 🔒 Security

- **Row Level Security** on all database tables
- **Secure API keys** via environment variables
- **User data isolation** - users only access their own content
- **Authentication** handled by Supabase Auth

## 🎯 Roadmap

### Coming Soon
- [ ] Stripe payment integration
- [ ] WordPress API integration
- [ ] Push notifications
- [ ] Social media publishing
- [ ] Article editing
- [ ] Multiple export formats
- [ ] SEO score analyzer
- [ ] Multi-language support

## 💡 Usage

1. **Sign Up** - Create your account
2. **Fill Form** - Enter article details
3. **Confirm Payment** - $4.99 per article
4. **Generate** - AI creates your content
5. **Download/Share** - Export as PDF or copy text

## 🐛 Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --clear
```

### Environment Variables Not Loading
- Restart Expo dev server
- Check `.env` file exists and has correct values

### Database Connection Errors
- Verify Supabase schema is set up
- Check API keys in `.env`
- Ensure RLS policies are enabled

## 📝 License

Proprietary - All rights reserved

## 🤝 Contributing

This is a proprietary project. For feature requests or bug reports, please contact the development team.

## 📧 Support

- Email: support@seoarticlegenerator.com
- Documentation: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🙏 Acknowledgments

- **Anthropic** - AI article generation
- **Supabase** - Backend infrastructure
- **Expo** - React Native framework

---

**Built with ❤️ for content creators who need SEO-optimized articles fast.**
