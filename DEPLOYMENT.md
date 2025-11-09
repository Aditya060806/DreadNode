# Vercel Deployment Guide for Dreadnode

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration
   - Click "Deploy"

### Option 3: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Browse All Templates"
3. Select "Vite" or "Other"
4. Connect your Git repository
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click "Deploy"

## 📋 Build Configuration

The project is already configured with:
- ✅ `vercel.json` - Vercel configuration
- ✅ `vite.config.ts` - Optimized build settings
- ✅ Code splitting for better performance
- ✅ SPA routing support (all routes → index.html)

## 🔧 Environment Variables (Optional)

If you want to use Gemini API (currently disabled):
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `VITE_GEMINI_API_KEY=your_api_key_here`
3. Redeploy

**Note**: The project works without Gemini API - all features use local intelligence.

## 🎯 Post-Deployment

### Custom Domain (Optional)
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed

### Performance Optimization
- ✅ Code splitting is enabled
- ✅ Asset caching is configured
- ✅ Build optimizations are in place

## 📊 Build Settings Summary

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node Version | 18.x (default) |
| Install Command | `npm install` |

## 🐛 Troubleshooting

### Build Fails
1. Check Node.js version (use 18.x or 20.x)
2. Verify all dependencies are in `package.json`
3. Check build logs in Vercel dashboard

### Routing Issues
- ✅ SPA routing is configured in `vercel.json`
- All routes redirect to `index.html`

### Performance Issues
- ✅ Code splitting is enabled
- ✅ Large chunks are split (react-vendor, ui-vendor, three-vendor)
- ✅ Assets are cached for 1 year

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

## ✨ Features Ready for Production

- ✅ No external API dependencies (works offline)
- ✅ Optimized build configuration
- ✅ Code splitting for faster loads
- ✅ SPA routing support
- ✅ Asset caching
- ✅ Production-ready build

## 🎉 Ready to Deploy!

Your project is configured and ready for Vercel deployment. Just run `vercel --prod` or connect via GitHub!

