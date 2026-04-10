# 🔑 Google Places API Integration Guide for Peckish App

This guide explains how to fully integrate the Google Places API into your Peckish restaurant discovery app.

## ✅ What's Already Done

The following Google Places API functions have been added to `src/App.tsx`:

1. **`searchGooglePlaces(query, location)`** - Search for nearby restaurants
2. **`getPlaceDetails(placeId)`** - Get detailed information about a specific place
3. **`getPlacePhotoUrl(photoReference, maxWidth)`** - Retrieve place photos
4. **`autocompletePlaces(input, location)`** - Autocomplete suggestions for search

## 🚀 Setup Steps

### Step 1: Get Your Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Places API**
   - **Maps JavaScript API** (optional, for embedded maps)
   - **Geocoding API** (optional, for address conversion)
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

### Step 2: Configure Your API Key

Open `src/App.tsx` and replace the placeholder on line 15:

```typescript
// BEFORE (line 15):
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE";

// AFTER:
const GOOGLE_MAPS_API_KEY = "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // Your actual API key
```

### Step 3: Set Up Billing (Required)

Google Places API requires a billing account:
1. In Google Cloud Console, go to "Billing"
2. Link a billing account (credit/debit card required)
3. Google offers $200 free credit monthly, which is enough for most small apps

### Step 4: Restrict Your API Key (Recommended for Production)

To prevent unauthorized use:
1. Go to "Credentials" in Google Cloud Console
2. Click on your API key
3. Under "Application restrictions", choose:
   - **HTTP referrers** (for web apps) - Add your domain
   - **IP addresses** (for server-side calls)
4. Under "API restrictions", select "Restrict key" and check only:
   - Places API
   - Maps JavaScript API (if using)
   - Geocoding API (if using)

## 📖 How to Use the API Functions

### Example 1: Search Nearby Restaurants

```typescript
// Inside a component with access to userLoc
const places = await searchGooglePlaces("restaurant", userLoc);
// Returns array of places with name, address, rating, lat/lng, etc.
```

### Example 2: Get Place Details

```typescript
const details = await getPlaceDetails("ChIJN1t_tDeuEmsRUsoyG83frY4");
// Returns detailed info including reviews, photos, opening hours, etc.
```

### Example 3: Display a Photo

```typescript
const photoUrl = getPlacePhotoUrl(photoReference, 800);
// Use in img tag: <img src={photoUrl} alt="Place photo" />
```

### Example 4: Autocomplete Search

```typescript
const suggestions = await autocompletePlaces("sushi", userLoc);
// Returns array of predictions with placeId and description
```

## 💰 Pricing Information

As of 2024, Google Places API pricing:

- **Place Details**: $17 per 1000 requests
- **Text Search**: $32 per 1000 requests  
- **Place Autocomplete**: $2.83 per 1000 requests
- **Photos**: $7 per 1000 requests

**Free tier**: $200 monthly credit (approximately 11,700 Place Details requests)

Monitor usage at: https://console.cloud.google.com/billing

## 🔒 Security Best Practices

⚠️ **Important**: Never expose your API key in client-side code for production apps!

For production, consider:

1. **Use a backend proxy** - Make API calls from your server instead of the browser
2. **Environment variables** - Store API key in `.env` file (not committed to git)
3. **API key restrictions** - Always restrict by referrer/IP and API type

### Alternative: Environment Variable Approach

Create a `.env` file in your project root:

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Then update `src/App.tsx`:

```typescript
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const USE_GOOGLE_PLACES = GOOGLE_MAPS_API_KEY !== "";
```

Add `.env` to your `.gitignore` file.

## 🧪 Testing

After configuration, test the integration:

1. Run the app: `npm run dev`
2. Navigate to a restaurant detail page
3. The Google Places functions are ready to be called when needed
4. Check browser console for any API errors

## 📝 Next Steps to Fully Integrate

To make use of these functions in your UI:

1. **Update search screen** - Use `autocompletePlaces()` for real-time suggestions
2. **Add "Find with Google" button** - Call `searchGooglePlaces()` to discover new restaurants
3. **Enhance restaurant details** - Use `getPlaceDetails()` to fetch live ratings/reviews
4. **Display photos** - Use `getPlacePhotoUrl()` for high-quality place images

## 🆘 Troubleshooting

### Common Errors:

- **"REQUEST_DENIED"** - API key is invalid or restricted incorrectly
- **"BILLING_NOT_INITIATED"** - Need to set up billing account
- **"ZERO_RESULTS"** - No places found matching your query
- **"OVER_QUERY_LIMIT"** - Exceeded quota or billing limit

Check the [official documentation](https://developers.google.com/maps/documentation/places/web-service) for more details.

---

**Need help?** Check the Google Places API documentation or contact support through Google Cloud Console.
