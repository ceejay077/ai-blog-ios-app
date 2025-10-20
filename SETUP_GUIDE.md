# SEO Article Generator - Setup Guide

A complete React Native/Expo app for generating SEO-optimized blog articles using AI.

## 🚀 Features

- ✅ User authentication (Login/Signup)
- ✅ AI-powered article generation (Anthropic Claude)
- ✅ SEO optimization with keyword integration
- ✅ Premium membership system
- ✅ Image upload for premium users
- ✅ PDF download functionality
- ✅ Article history
- ✅ Social media share buttons (UI ready)
- ✅ Payment modal ($4.99 per article)
- ✅ Free tier (500 words max)
- ✅ Premium tier (unlimited words + images)

## 📋 Prerequisites

- Node.js 18+ installed
- Expo CLI installed (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Expo Go app on your iPhone
- Supabase account
- Anthropic API key

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

The `.env` file has already been created with your credentials:
- ✅ Anthropic API Key
- ✅ Supabase URL and Anon Key

### 3. Set Up Supabase Database

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `cnitbkwaztuctpaknerf`
3. Navigate to **SQL Editor**
4. Copy the contents of `supabase-schema.sql` and paste it into the SQL editor
5. Click **Run** to execute the SQL

This will create:
- `users` table with premium status
- `articles` table for storing generated content
- Storage bucket for images
- Row Level Security policies
- Automatic triggers for user creation

### 4. Create Storage Bucket (Alternative Method)

If the SQL method doesn't create the bucket:

1. Go to **Storage** in your Supabase Dashboard
2. Click **New bucket**
3. Name it: `article-images`
4. Set it as **Public bucket**
5. Click **Create bucket**

### 5. Enable Email Authentication

1. Go to **Authentication** > **Providers** in Supabase
2. Ensure **Email** provider is enabled
3. Configure email templates if needed

## 🏃 Running the App

### Start Development Server

```bash
npm start
```

### Run on iOS Simulator

```bash
npm run ios
```

### Run on Physical iPhone

1. Install **Expo Go** from the App Store
2. Scan the QR code displayed in terminal
3. The app will load on your device

## 📱 App Flow

### 1. Welcome Screen
- Displays app logo and tagline
- "Get Started" button leads to login

### 2. Authentication
- **Login**: Email + password
- **Signup**: Email + password + confirmation
- Automatic redirect after successful login

### 3. Create Article Screen
- Form fields:
  - Article Title (required)
  - Target Keywords (required)
  - Target Audience (required)
  - Tone (optional: Professional, Casual, Friendly, Authoritative)
  - Image Upload (Premium only)
  - Image Alt Text (Premium only)
- Shows user tier (Free/Premium)
- Payment modal ($4.99 per article)
- Navigation to History and Profile

### 4. Article Result Screen
- Displays generated article
- Word count display
- Actions:
  - **Regenerate**: Go back to form
  - **Download PDF**: Creates formatted PDF
  - **Copy Text**: Copy to clipboard
  - **Social Share**: Buttons for Twitter, Facebook, LinkedIn, WhatsApp (UI only)
- "Create New Article" button

### 5. History Screen
- Lists all previously generated articles
- Shows title, preview, word count, date
- Pull to refresh
- Tap article to view it again

### 6. Profile Screen
- User information (email, tier status)
- Article count statistics
- Upgrade to Premium button (for free users)
- Settings options
- Logout button

## 🔐 User Tiers

### Free Tier
- ❌ 500 words maximum
- ❌ No image uploads
- ✅ $4.99 per article
- ✅ All core features

### Premium Tier
- ✅ Unlimited word count (up to 2000)
- ✅ Image uploads with alt text
- ✅ $4.99 per article
- ✅ All premium features

## 🎨 Design System

- **Primary Color**: #007AFF (iOS Blue)
- **Background**: #FFFFFF (White)
- **Secondary Background**: #F8F9FA (Light Gray)
- **Text Primary**: #000000 (Black)
- **Text Secondary**: #666666 (Gray)
- **Premium Badge**: #FFD700 (Gold)
- **Error/Logout**: #FF3B30 (Red)

## 📝 API Integration

### Anthropic Claude
- Model: `claude-3-5-sonnet-20241022`
- Max tokens: 2000
- Generates SEO-optimized content
- Natural keyword integration

### Supabase
- Authentication: Email/Password
- Database: PostgreSQL with RLS
- Storage: Image uploads
- Real-time: Not currently used

## 🐛 Troubleshooting

### Environment Variables Not Loading
```bash
# Restart the Expo dev server
npm start -- --clear
```

### Database Errors
- Verify all tables are created in Supabase
- Check RLS policies are enabled
- Ensure user profile is created after signup

### Image Upload Issues
- Verify storage bucket exists
- Check bucket is set to public
- Ensure storage policies are created

### Anthropic API Errors
- Verify API key is correct
- Check API key has sufficient credits
- Ensure no typos in `.env` file

## 📚 File Structure

```
my-seo-article-generator/
├── app/
│   ├── (app)/              # Protected app screens
│   │   ├── create-article.tsx
│   │   ├── article-result.tsx
│   │   ├── history.tsx
│   │   └── profile.tsx
│   ├── (auth)/             # Authentication screens
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── index.tsx           # Welcome screen
│   └── _layout.tsx         # Root layout
├── contexts/
│   └── AuthContext.tsx     # Authentication state
├── lib/
│   ├── supabase.ts         # Supabase client & functions
│   └── anthropic.ts        # AI article generation
├── .env                    # Environment variables
├── supabase-schema.sql     # Database schema
└── package.json            # Dependencies
```

## 🚧 Future Enhancements

### Phase 2 (To Be Implemented)
- [ ] Actual Stripe payment integration
- [ ] WordPress API integration for direct posting
- [ ] Push notifications (Expo Notifications)
- [ ] Social media sharing functionality
- [ ] Article editing capability
- [ ] Export to multiple formats (Word, Markdown)
- [ ] SEO score analyzer
- [ ] Keyword research tool
- [ ] Multiple language support

## 🔒 Security Notes

1. **API Keys**: Never commit `.env` to version control
2. **Row Level Security**: Enabled on all tables
3. **Storage Policies**: Users can only access their own images
4. **Authentication**: Handled securely by Supabase Auth

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Contact: support@seoarticlegenerator.com

## 📄 License

This project is proprietary software.

---

Built with ❤️ using React Native, Expo, Supabase, and Anthropic Claude AI
