# Hostinger Deployment Guide

## Prerequisites
- Node.js 18+ enabled in Hostinger control panel
- SSH access (if available) or file manager access

## Deployment Steps

### 1. Local Build
```bash
npm install
npm run build
```

### 2. Upload Files
Upload these folders/files to your Hostinger public_html directory:
- `.next/` (entire folder)
- `public/` (if exists)
- `package.json`
- `next.config.ts`
- `server.js`
- `.env.production` (create from template below)

### 3. Hostinger Configuration
In your Hostinger control panel:
1. Enable Node.js (version 18+)
2. Set startup file to: `server.js`
3. Or use: `node_modules/.bin/next start`

### 4. Environment Variables
Create `.env.production`:
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Troubleshooting

### Permission Denied Error
If you get permission errors:
1. Use file manager to set executable permissions on `node_modules/.bin/*`
2. Or run: `find node_modules/.bin -type f -exec chmod +x {} \;`

### Build Fails
- Ensure Node.js 18+ is selected
- Check memory limits (increase if needed)
- Try building locally first

### PDF Generation Issues
- Puppeteer should work on most Hostinger plans
- If issues persist, the app will fallback to client-side PDF generation

## Support
The app includes fallback mechanisms for PDF generation, so it should work even if server-side PDF fails.