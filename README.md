# Pega site

## About
A partialy prerendered site with dynamic content loaded from Firebase

## Developement
1. Clone repo
2. Create `.env` file with [Firebase](https://console.firebase.google.com/project/pega-site/settings/general) en [Geoapify](https://myprojects.geoapify.com/api/0C4jUeVhRBormH2L1Kio/keys) API keys
3. Run `npm i` in root folder
4. Run `npm run dev` to start local server

```env
// .env file
VITE_APIKEY="..."
VITE_AUTHDOMAIN="..."
VITE_PROJECTID="..."
VITE_STORAGEBUCKET="..."
VITE_MESSAGINGSENDERID="..."
VITE_APPID="..."
VITE_MEASUREMENTID="..."
VITE_GEOAPIFY_APIKEY="..."
VITE_USEMOCKING="false"
```

## TODO
- Combine searchable code into component
