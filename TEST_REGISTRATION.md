# 🧪 Test Registration - Step by Step

## Current Issue
Dashboard shows "undefined" because no user is registered yet.

## Solution: Complete Registration First

### Step 1: Clear Browser Data
1. Open DevTools (F12)
2. Go to Application tab
3. Clear Storage → Clear site data
4. Close DevTools

### Step 2: Go to Registration Page
**URL:** http://localhost:3000/register

### Step 3: Complete Registration

**Fill in the form:**
- Select: **Bidder** (or Auction Lister)
- Name: `Test User`
- Email: `test@example.com`
- Phone: `+1234567890`

**Upload Images:**
- ID Image: Any image file
- Selfie: Any image file

**Click:** "Continue to Verification"

### Step 4: Wait for Processing
- System uploads images
- Extracts text (OCR)
- Performs face matching (or uses demo score)
- Shows: "Face detection failed, using demo score" (this is normal!)

### Step 5: See Result
- Match Score: 85%
- Status: Verified ✅
- Click: "Complete Registration"

### Step 6: Redirected to Dashboard
- You should now see your profile
- Name, Email, User Type displayed
- Verification status shown

## If Dashboard Still Shows Error

### Check localStorage:
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Look for:
   - `userId`: Should have a value like `user_1`
   - `userType`: Should be `bidder` or `auctionLister`

### If localStorage is empty:
Registration didn't complete. Try again from Step 1.

### If localStorage has userId:
Refresh the dashboard page.

## Quick Test Commands

### Check if backend is running:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status":"OK","message":"KYC Backend Running (Mock DB)"}
```

### Check registered users:
```bash
curl http://localhost:5000/api/auth/users
```

Should return list of users (empty if none registered).

## Expected Flow

```
1. /register
   ↓
2. Fill form + upload images
   ↓
3. Face matching (demo score 85%)
   ↓
4. Complete registration
   ↓
5. userId saved to localStorage
   ↓
6. Redirect to /dashboard
   ↓
7. Dashboard fetches user data
   ↓
8. Shows your profile ✅
```

## Common Mistakes

❌ Going directly to `/dashboard` without registering
✅ Complete `/register` first

❌ Using old `/kyc` page
✅ Use new `/register` page

❌ Expecting data after server restart
✅ Data is in-memory, lost on restart

## Success Indicators

✅ Registration page loads
✅ Can upload images
✅ See "Face detection failed, using demo score"
✅ See match score 85%
✅ Click "Complete Registration"
✅ Redirected to dashboard
✅ Dashboard shows your name and email
✅ No errors in console (except face detection warning)

## If Still Having Issues

1. **Restart Backend:**
   ```bash
   # Stop backend (Ctrl+C)
   cd backend
   npm start
   ```

2. **Restart Frontend:**
   ```bash
   # Stop frontend (Ctrl+C)
   cd frontend
   npm run dev
   ```

3. **Clear Browser Cache:**
   - Hard refresh: Ctrl+Shift+R
   - Or clear all browser data

4. **Try Incognito Mode:**
   - Open incognito window
   - Go to http://localhost:3000/register
   - Complete registration

## Verification

After successful registration, you should be able to:

1. ✅ See your profile on dashboard
2. ✅ Login with your email at `/login`
3. ✅ See your user in the list:
   ```bash
   curl http://localhost:5000/api/auth/users
   ```

## Next Steps

Once registration works:
1. Register multiple users
2. Test login functionality
3. Integrate with auction system
4. Add more features

## Need Help?

Check these files:
- `SYSTEM_STATUS.md` - Complete system overview
- `MOCK_DATABASE_INFO.md` - Database information
- `NEW_REGISTRATION_FLOW.md` - Registration details
- `TROUBLESHOOTING.md` - Common issues

Your system is working! Just need to complete the registration flow properly. 🚀
