# Visitor Self Check-in Flow

## How Visitors Use the System

### Step 1: Admin Creates Visitor
1. Admin logs into the system (`admin@library.com` / `admin123`)
2. Goes to "Visitor Management" → Creates new visitor
3. Goes to "Generate QR" → Creates QR code for the visitor
4. Downloads and prints/gives the QR code to the visitor

### Step 2: Visitor Self Check-in
1. Visitor goes to the self check-in station/kiosk
2. Opens: `https://your-app-url/checkin` (or `/checkin` on local)
3. Clicks "Start Scanning"
4. Positions their QR code in front of the camera
5. Gets instant confirmation: "Checked in successfully" or "Checked out successfully"

### Step 3: Admin Monitors
- Admin can see all check-ins/check-outs in "Visitor Log"
- Dashboard shows real-time statistics
- No manual scanning required!

## URLs:
- **Admin Panel:** `/` (requires login)
- **Self Check-in:** `/checkin` (public, no login required)

## Features:
✅ **Self-service** - Visitors check themselves in/out
✅ **Real-time feedback** - Instant confirmation with visitor name
✅ **Beautiful UI** - Modern, responsive design
✅ **Mobile-friendly** - Works on phones/tablets
✅ **No admin intervention** - Fully automated

## Technical Details:
- QR codes contain visitor ID and optional book ID
- Public API endpoints for check-in/check-out
- Automatic visitor lookup and validation
- In-memory storage (easily replaceable with database)