# DimsToken IDO Platform - Deployment Guide

## 🚀 Live Deployment Instructions

### Prerequisites
- Node.js 18+ installed
- Vercel account (free tier available)
- GitHub repository access

### Step 1: Environment Setup
Create a `.env.local` file in the `dims-token-ido/` directory:
```bash
NEXT_PUBLIC_TOKEN_ADDRESS=0x12988493e2b178B0E3279cE89d4b88CcB2878f61
NEXT_PUBLIC_IDO_ADDRESS=0x8784672035EcF46E17DE2352292183517466d483
```

### Step 2: Deploy to Vercel
1. **Connect to Vercel:**
   ```bash
   npm i -g vercel
   cd dims-token-ido
   vercel
   ```

2. **Follow the prompts:**
   - Link to existing project or create new
   - Set build command: `npm run build`
   - Set output directory: `.next`
   - Add environment variables in Vercel dashboard

3. **Environment Variables in Vercel:**
   - `NEXT_PUBLIC_TOKEN_ADDRESS`: `0x12988493e2b178B0E3279cE89d4b88CcB2878f61`
   - `NEXT_PUBLIC_IDO_ADDRESS`: `0x8784672035EcF46E17DE2352292183517466d483`


### Step 4: Domain Configuration
- **Custom Domain:** Configure in Vercel dashboard
- **SSL:** Automatic HTTPS with Vercel
- **CDN:** Global content delivery included

### Step 5: Verification
1. **Test Wallet Connection:** Ensure MetaMask connects
2. **Test Network:** Verify Sepolia testnet connection
3. **Test Purchase:** Complete a test transaction
4. **Test Responsiveness:** Check mobile compatibility

## 🔗 Expected Live URLs

### Vercel Deployment
- **URL:** `https://dims-token-gu9u7rian-toshomanuel-9574s-projects.vercel.app`


## 📱 Mobile Testing
- **iOS Safari:** Full compatibility
- **Android Chrome:** Full compatibility
- **MetaMask Mobile:** Supported
- **Responsive Design:** Mobile-first approach

## 🔧 Troubleshooting

### Common Issues
1. **Environment Variables:** Ensure all variables are set
2. **Build Errors:** Check Node.js version (18+)
3. **Wallet Connection:** Verify MetaMask is installed
4. **Network Issues:** Ensure Sepolia testnet is selected

### Support
- **Documentation:** See README.md

## ✅ Deployment Checklist
- [ ] Environment variables configured
- [ ] Build successful (`npm run build`)
- [ ] Vercel deployment complete
- [ ] SSL certificate active
- [ ] Wallet connection tested
- [ ] Token purchase tested
- [ ] Mobile responsiveness verified
- [ ] Performance optimized
