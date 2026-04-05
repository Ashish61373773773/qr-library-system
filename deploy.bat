@echo off
echo 🚀 QR Library System Deployment Script
echo ======================================

echo Step 1: Installing Vercel CLI...
npm install -g vercel

echo Step 2: Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo Your app should be live at the URL shown above
pause