# QR-Based Library Check-in System

A beautiful, modern library management system with QR code check-in functionality.

## 🚀 Quick Deploy

### Option 1: Vercel (Recommended - Free & Easy)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Or use the deployment script:**
   ```bash
   ./deploy.bat
   ```

That's it! Your app will be live instantly.

### Option 2: Netlify + Railway

**Frontend (Netlify):**
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repo
3. Set build command: `npm run build`
4. Set publish directory: `frontend/dist`

**Backend (Railway):**
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Set root directory: `backend`
4. Deploy automatically

### Option 3: Heroku

**Backend:**
```bash
cd backend
heroku create your-app-name
git push heroku main
```

**Frontend:**
Deploy the `frontend/dist` folder to Netlify or Vercel.

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start backend
cd backend && npm start

# Start frontend (new terminal)
cd frontend && npm run dev
```

## 📱 Features

- ✅ Beautiful Material-UI interface
- ✅ QR code generation & scanning
- ✅ Visitor management
- ✅ Real-time check-in/check-out
- ✅ Dashboard with analytics
- ✅ JWT authentication

## 🌐 Live Demo

After deployment, your app will be available at a URL like:
- Vercel: `https://your-app.vercel.app`
- Netlify: `https://your-app.netlify.app`

## 📞 Support

If you need help with deployment, check the platform's documentation or create an issue on GitHub.