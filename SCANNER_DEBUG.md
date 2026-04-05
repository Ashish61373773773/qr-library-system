# Self Check-in Scanner Troubleshooting

## 🔧 **Scanner Not Working? Try These Steps:**

### **Step 1: Check Browser Permissions**
1. Click the 🔒 lock icon in the address bar
2. Make sure "Camera" permission is set to "Allow"
3. Refresh the page

### **Step 2: Test Camera Access**
1. Go to `http://localhost:5178/checkin`
2. Click "Check Camera Access" button
3. If camera not found, try:
   - Refresh the page
   - Use a different browser (Chrome recommended)
   - Check if camera is being used by another app

### **Step 3: Manual Camera Permission**
1. Click "Request Camera Permission" if shown
2. Allow camera access when prompted
3. Try "Start Scanning" again

### **Step 4: Alternative Solutions**
- **HTTPS Required**: Some browsers require HTTPS for camera access
- **Mobile**: Test on mobile device with camera
- **Incognito Mode**: Try in incognito/private browsing

## 🐛 **Debug Information**

Open browser Developer Tools (F12) and check Console for errors like:
- `Failed to start camera`
- `Camera permission denied`
- `html5-qrcode scanner errors`

## 📱 **Testing the Scanner**

1. **Generate QR Code**: Admin panel → Generate QR → Download
2. **Test Scan**: Go to `/checkin` → Start Scanning → Show QR to camera
3. **Expected Result**: Success dialog with visitor name and check-in/out message

## 🔄 **If Still Not Working**

The scanner uses two methods:
1. **Primary**: Html5QrcodeScanner (recommended)
2. **Fallback**: Html5Qrcode (alternative)

Both should work if camera permissions are granted.

## 📞 **Quick Test**

Run this in browser console to test camera:
```javascript
navigator.mediaDevices.getUserMedia({video: true})
  .then(() => console.log('Camera works!'))
  .catch(err => console.error('Camera error:', err));
```