# Trending Feed Setup Guide

## Overview

The main screen now features a beautiful "Discover" feed similar to Facebook or Google Discover, showing trending stories from multiple sources.

## Features

✅ Google Trends integration for real trending topics
✅ GNews API for fetching related news articles
✅ Unsplash API for matching images
✅ Beautiful gradient UI design
✅ Pull-to-refresh functionality
✅ Loading states and error handling
✅ Graceful fallback to demo data when API keys are missing
✅ Retry mechanism for failed requests

## API Keys Setup

### 1. GNews API (Free Tier)

- Visit: https://gnews.io/
- Sign up for a free account
- Get your API key from the dashboard
- Add to `.env`: `EXPO_PUBLIC_GNEWS_API_KEY=your_key_here`
- Free tier: 100 requests/day

### 2. Unsplash API (Free)

- Visit: https://unsplash.com/developers
- Create a new application
- Get your Access Key from the dashboard
- Add to `.env`: `EXPO_PUBLIC_UNSPLASH_ACCESS_KEY=your_key_here`
- Free tier: 50 requests/hour

### 3. Update your .env file

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key
EXPO_PUBLIC_GNEWS_API_KEY=your_gnews_key
EXPO_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_key
```

## Demo Mode

If API keys are not configured, the app will automatically display beautiful demo content with:

- 5 sample trending articles
- Real images from Unsplash
- Various topics (Technology, Business, Environment, Health, Science)

## How It Works

### Data Flow

```
1. Google Trends API → Fetch top 5 trending topics
2. GNews API → Get 1-3 articles per topic
3. Unsplash API → Fetch matching image for each article
4. Combine → Display in beautiful card layout
```

### Error Handling

- **Network errors**: Automatic retry with exponential backoff (3 attempts)
- **Missing API keys**: Falls back to demo data
- **Failed image loading**: Uses placeholder images
- **Pull-to-refresh**: Easy manual refresh

## UI Components

- **LinearGradient**: Stunning gradient backgrounds (#667eea to #764ba2)
- **React Native Paper**: Polished cards and buttons
- **Custom Cards**: Rounded corners, shadows, smooth spacing
- **Image Overlays**: Gradient overlays for better text readability
- **Topic Chips**: Color-coded category badges
- **Read More Button**: Opens articles in browser

## Testing

1. Without API keys: Should show demo data
2. Pull down: Should trigger refresh animation
3. Tap article: Should open in browser
4. Check console: Should see API status logs

## Troubleshooting

### "Loading trending stories..." never finishes

- Check internet connection
- Verify API keys are correct in `.env`
- Check console for specific error messages

### Images not loading

- Verify Unsplash API key
- Check if you've exceeded rate limits
- Will show placeholder images as fallback

### No trending topics

- Google Trends might be temporarily unavailable
- Will use fallback topics: Technology, Business, Health, Science, Entertainment

## Performance Tips

- Images are lazy-loaded
- FlatList is optimized for scrolling
- Pull-to-refresh caches data
- Retry mechanism prevents excessive API calls

## Future Enhancements

- [ ] Add search functionality
- [ ] Filter by topic/category
- [ ] Save articles for later
- [ ] Share articles
- [ ] Dark mode support
- [ ] Pagination for infinite scroll
- [ ] Local caching with AsyncStorage
