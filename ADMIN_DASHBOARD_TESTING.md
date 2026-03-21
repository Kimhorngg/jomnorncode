# Admin Dashboard Testing Checklist

## 1. Authentication Testing

### ✅ Admin Login Test

- [ ] Go to `http://localhost:5173/login`
- [ ] Enter Email: `jomnorncode@gmail.com`
- [ ] Enter Password: `jomnorncode1`
- [ ] Click **ចូលគណនី** (Login)
- [ ] ✓ Should show success toast
- [ ] ✓ Should redirect to `/dashboard`

### ✅ Google Auth Test (if using admin email)

- [ ] Click **Google** button on login
- [ ] Sign in with Google
- [ ] ✓ Should sync and redirect to dashboard

### ✅ Non-Admin User Test

- [ ] Login with a regular user email (not admin)
- [ ] ✓ Should login successfully
- [ ] ✓ Should NOT redirect to `/dashboard`
- [ ] ✓ Manual `/dashboard` visit should redirect to home

---

## 2. Dashboard Loading Test

### ✅ Dashboard Page Loads

- [ ] Navigate to `/dashboard` (after admin login)
- [ ] ✓ Page loads without errors
- [ ] ✓ No red error messages in console
- [ ] ✓ Sidebar navigation visible
- [ ] ✓ Logo and branding shows

---

## 3. Admin Dashboard Sections Test

### ✅ Dashboard Section

- [ ] Click **Dashboard** in sidebar
- [ ] ✓ Shows stat cards (Total Courses, Active Students, etc.)
- [ ] ✓ Numbers populate correctly

### ✅ Course Management Section

- [ ] Click **Course Management** → **All Courses**
- [ ] ✓ List of courses displays
- [ ] ✓ Can see course names, student count, status

### ✅ Quiz Management Section

- [ ] Click **Quiz Management** → **All Quizzes**
- [ ] ✓ Shows lessons and quiz counts
- [ ] ✓ Displays lesson titles

---

## 4. User & Tracking Section Test (CRITICAL)

### ✅ View Users Tab

- [ ] Click **User & Tracking** → **View Users**
- [ ] ✓ Table loads with user list
- [ ] ✓ Shows: Student Name, Courses, Progress %, Certificates
- [ ] ✓ **View Details** button available for each user

### ✅ Click "View Details" for a User

- [ ] Click **View Details** on any user
- [ ] ✓ Modal opens
- [ ] ✓ Shows user email
- [ ] ✓ Shows enrolled courses with progress bars
- [ ] ✓ Shows certificates (if any)
- [ ] ✓ X button closes modal

### ✅ Track Progress Tab

- [ ] Click **Track Progress**
- [ ] ✓ Shows users as cards
- [ ] ✓ Each card shows name and overall progress %
- [ ] ✓ Clickable cards open detail modal

### ✅ View Certificates Tab

- [ ] Click **View Certificates**
- [ ] ✓ Shows users with certificate counts
- [ ] ✓ Shows "Issued" or "None" status

---

## 5. API Data Fetching Test

### ✅ Check Network Tab (DevTools)

- [ ] Open DevTools → Network tab
- [ ] Refresh `/dashboard`
- [ ] Look for API calls:
  - [ ] `/api/users?all=true...` (should succeed or return data)
  - [ ] `/api/enrollments/user/{id}` (may have 403s, should be handled)
  - [ ] `/api/certificates/user/{id}` (may have 403s, should be handled)
- [ ] ✓ No red errors blocking the page
- [ ] ✓ Data loads even if some requests fail (graceful fallback)

### ✅ Check Console

- [ ] Open DevTools → Console
- [ ] ✓ No JavaScript errors
- [ ] ✓ No red error messages
- [ ] ✓ May see console.error for 403s (but page still works)

---

## 6. Responsive Design Test

### ✅ Desktop View (1920px+)

- [ ] All sections visible and aligned
- [ ] Sidebar always visible
- [ ] Tables and cards readable

### ✅ Tablet View (768px)

- [ ] Sidebar collapses to hamburger menu
- [ ] Cards stack properly
- [ ] Still readable

### ✅ Mobile View (375px)

- [ ] Menu button accessible
- [ ] Tables scroll horizontally
- [ ] Modal fits on screen

---

## 7. Error Handling Test

### ✅ No Users Found

- [ ] If API returns empty user list
- [ ] ✓ Should show "No users found" message
- [ ] ✓ Should NOT crash

### ✅ API Errors (403, 500)

- [ ] If enrollments or certificates fail
- [ ] ✓ Should still show user list
- [ ] ✓ Should show empty enrollment/certificate sections
- [ ] ✓ Should NOT show red errors

---

## 8. Manual Data Check

### ✅ Verify User Data Accuracy

- [ ] Pick one user from the list
- [ ] Click **View Details**
- [ ] Verify:
  - [ ] Name matches your backend data
  - [ ] Email is correct
  - [ ] Enrolled courses count is accurate
  - [ ] Progress % makes sense

### ✅ Verify Course Data

- [ ] Course names display correctly
- [ ] Progress bars show reasonable percentages
- [ ] Student counts are accurate

---

## Issue Checklist

If you encounter issues, check:

- [ ] **403 Errors on API calls**: This is expected if permissions differ. The page should still load user names.
- [ ] **Blank user list**: Check if `/api/users` endpoint is returning data correctly
- [ ] **Modal doesn't open**: Check console for JavaScript errors
- [ ] **Progress not showing**: Verify enrollments are being fetched
- [ ] **Redirects to home**: Verify user has "admin" role in backend

---

## What to Report

If something breaks, note:

1. What you were doing when it broke
2. Error message in console (if any)
3. Network response status (from DevTools)
4. Screenshot of the issue
