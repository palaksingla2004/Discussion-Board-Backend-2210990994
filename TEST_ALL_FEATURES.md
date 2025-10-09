# Complete Feature Test Guide

## ✅ All Features Working with Backend

This guide tests every feature to ensure it works with the backend.

---

## 🔐 1. Authentication (Login/Register)

### Test Registration:
1. Go to http://localhost:3000
2. Click "Register"
3. Fill form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test123!`
   - Confirm Password: `Test123!`
4. Click "Register"
5. ✅ Should redirect to home page
6. ✅ Should see "Create Thread" and "Profile" in navbar

**Backend Endpoint:** `POST /api/auth/register`

### Test Login:
1. Click "Logout" (if logged in)
2. Click "Login"
3. Enter:
   - Email: `admin@forum.com`
   - Password: `Admin123!`
4. Click "Login"
5. ✅ Should redirect to home page
6. ✅ Should see username in navbar

**Backend Endpoint:** `POST /api/auth/login`

---

## 🏠 2. Home Page (Browse Threads)

### Test Thread List:
1. Go to http://localhost:3000
2. ✅ Should see thread list or "No threads found"
3. ✅ Should see search bar
4. ✅ Should see category dropdown
5. ✅ Should see sort dropdown

**Backend Endpoint:** `GET /api/threads`

### Test Search:
1. Type "react" in search box
2. ✅ Results should filter
3. Clear search
4. ✅ All threads should show again

**Backend Endpoint:** `GET /api/threads?search=react`

### Test Category Filter:
1. Select a category from dropdown
2. ✅ Only threads in that category should show
3. Select "All Categories"
4. ✅ All threads should show

**Backend Endpoint:** `GET /api/threads?category=CATEGORY_ID`

### Test Sorting:
1. Select "Recent"
2. ✅ Newest threads first
3. Select "Popular"
4. ✅ Most viewed threads first
5. Select "Most Voted"
6. ✅ Highest voted threads first

**Backend Endpoint:** `GET /api/threads?sort=recent|popular|votes`

---

## 📝 3. Create Thread

### Test Thread Creation:
1. Login first
2. Click "Create Thread" in navbar
3. Fill form:
   - Title: `How to learn React?`
   - Content: `I'm new to React and looking for resources...`
   - Category: Select any category
   - Tags: Type "react" and click "Add Tag"
4. Click "Create Thread"
5. ✅ Should redirect to thread detail page
6. ✅ Should see your thread with title, content, category, tags

**Backend Endpoint:** `POST /api/threads`

**Request Body:**
```json
{
  "title": "How to learn React?",
  "content": "I'm new to React...",
  "category": "CATEGORY_ID",
  "tags": ["TAG_ID"]
}
```

---

## 💬 4. Thread Detail & Replies

### Test Thread Detail:
1. Click on any thread from home page
2. ✅ Should see thread title
3. ✅ Should see thread content
4. ✅ Should see author name
5. ✅ Should see category badge
6. ✅ Should see tags
7. ✅ Should see vote buttons (↑ ↓)
8. ✅ Should see reply form (if logged in)
9. ✅ Should see existing replies

**Backend Endpoint:** `GET /api/threads/:threadId`

### Test Add Reply:
1. On thread detail page
2. Scroll to reply form
3. Type: `Great question! Here's my answer...`
4. Click "Post Reply"
5. ✅ Reply should appear immediately
6. ✅ Should show your username
7. ✅ Should show "just now" timestamp

**Backend Endpoint:** `POST /api/replies/:threadId`

**Request Body:**
```json
{
  "content": "Great question! Here's my answer..."
}
```

### Test Nested Reply:
1. Find a reply
2. Click "Reply" button on that reply
3. Type: `I agree with this!`
4. Click "Submit Reply"
5. ✅ Nested reply should appear indented
6. ✅ Should be under the parent reply

**Backend Endpoint:** `POST /api/replies/:threadId`

**Request Body:**
```json
{
  "content": "I agree with this!",
  "parentReplyId": "PARENT_REPLY_ID"
}
```

### Test Edit Reply:
1. Find your own reply
2. Click "Edit" button
3. Change text
4. Click "Save"
5. ✅ Reply should update
6. ✅ Should show "edited" indicator

**Backend Endpoint:** `PUT /api/replies/:threadId/replies/:replyId`

### Test Delete Reply:
1. Find your own reply
2. Click "Delete" button
3. Confirm deletion
4. ✅ Reply should disappear

**Backend Endpoint:** `DELETE /api/replies/:threadId/replies/:replyId`

---

## 🗳️ 5. Voting System

### Test Vote on Thread:
1. On thread detail page
2. Click up arrow (↑)
3. ✅ Vote count should increase by 1
4. ✅ Arrow should change color (if styled)
5. Click down arrow (↓)
6. ✅ Vote count should decrease by 2 (removes upvote, adds downvote)

**Backend Endpoint:** `POST /api/votes/threads/:threadId`

**Request Body:**
```json
{
  "type": "upvote"  // or "downvote"
}
```

### Test Vote on Reply:
1. Find any reply
2. Click up arrow (↑)
3. ✅ Reply vote count should increase
4. Click down arrow (↓)
5. ✅ Reply vote count should decrease

**Backend Endpoint:** `POST /api/votes/threads/:threadId/replies/:replyId`

---

## 👤 6. User Profile

### Test View Own Profile:
1. Login
2. Click "Profile" in navbar
3. ✅ Should see your username
4. ✅ Should see reputation
5. ✅ Should see join date
6. ✅ Should see role (admin/user)
7. ✅ Should see "Threads by [username]"
8. ✅ Should see list of your threads

**Backend Endpoint:** `GET /api/users/:userId`

### Test View Other User Profile:
1. On any thread, click author username
2. ✅ Should see their profile
3. ✅ Should see their threads
4. ✅ Should see their stats

**Backend Endpoint:** `GET /api/users/:userId`

### Test User's Threads:
1. On profile page
2. ✅ Should see list of threads by that user
3. Click on a thread
4. ✅ Should go to thread detail

**Backend Endpoint:** `GET /api/users/:userId/threads`

---

## 🏷️ 7. Categories & Tags

### Test Categories:
1. Go to home page
2. ✅ Category dropdown should have options
3. Select a category
4. ✅ Threads should filter
5. Create thread page should have same categories

**Backend Endpoint:** `GET /api/categories`

### Test Tags:
1. On create thread page
2. Start typing in tags field
3. ✅ Should see tag suggestions
4. Add multiple tags
5. ✅ Should appear as badges
6. Remove a tag
7. ✅ Should disappear

**Backend Endpoint:** `GET /api/tags`

---

## 🔒 8. Protected Routes

### Test Without Login:
1. Logout
2. Try to access: http://localhost:3000/create
3. ✅ Should redirect to login page
4. Try to vote on thread
5. ✅ Should redirect to login or show error
6. Try to reply
7. ✅ Should not see reply form

### Test With Login:
1. Login
2. Access: http://localhost:3000/create
3. ✅ Should show create thread form
4. Vote on thread
5. ✅ Should work
6. Add reply
7. ✅ Should work

---

## 📊 9. Data Persistence (MongoDB)

### Verify in MongoDB:
```bash
mongosh
use forum_db

# Check users
db.users.find()

# Check threads
db.threads.find()

# Check categories
db.categories.find()

# Check tags
db.tags.find()

# Check specific thread with replies
db.threads.findOne({ title: /React/ })
```

### Verify Thread Saved:
1. Create a thread
2. Check MongoDB:
```javascript
db.threads.findOne({ title: "How to learn React?" })
```
3. ✅ Should see the thread document

### Verify Reply Saved:
1. Add a reply
2. Check MongoDB:
```javascript
db.threads.findOne({ title: "How to learn React?" }, { replies: 1 })
```
3. ✅ Should see replies array with your reply

### Verify Vote Saved:
1. Vote on thread
2. Check MongoDB:
```javascript
db.threads.findOne({ title: "How to learn React?" }, { votes: 1 })
```
3. ✅ Should see votes array with your vote

---

## 🧪 10. API Response Verification

### Test with Browser DevTools:
1. Open browser (F12)
2. Go to Network tab
3. Perform actions
4. Check API calls:

**Login:**
- Request: `POST /api/auth/login`
- Response: `{ token: "...", user: {...} }`
- Status: 200

**Get Threads:**
- Request: `GET /api/threads`
- Response: `{ threads: [...], pagination: {...} }`
- Status: 200

**Create Thread:**
- Request: `POST /api/threads`
- Response: `{ _id: "...", title: "...", ... }`
- Status: 201

**Add Reply:**
- Request: `POST /api/replies/:threadId`
- Response: `{ message: "Reply added", reply: {...} }`
- Status: 201

**Vote:**
- Request: `POST /api/votes/threads/:threadId`
- Response: Success message
- Status: 200

---

## ✅ Complete Feature Checklist

### Authentication:
- [ ] Register new user
- [ ] Login with credentials
- [ ] Logout
- [ ] Token stored in localStorage
- [ ] Protected routes work

### Home Page:
- [ ] View thread list
- [ ] Search threads
- [ ] Filter by category
- [ ] Sort threads (recent/popular/votes)
- [ ] Click thread to view details

### Create Thread:
- [ ] Form loads with categories
- [ ] Can add tags
- [ ] Can remove tags
- [ ] Thread creates successfully
- [ ] Redirects to thread detail
- [ ] Thread appears in list

### Thread Detail:
- [ ] View thread content
- [ ] See author, date, category, tags
- [ ] Vote buttons work
- [ ] Reply form visible (when logged in)
- [ ] Can add reply
- [ ] Replies display correctly

### Replies:
- [ ] Add top-level reply
- [ ] Add nested reply
- [ ] Edit own reply
- [ ] Delete own reply
- [ ] Replies save to MongoDB

### Voting:
- [ ] Vote on thread
- [ ] Vote on reply
- [ ] Vote count updates
- [ ] Votes save to MongoDB

### Profile:
- [ ] View own profile
- [ ] View other user profiles
- [ ] See user's threads
- [ ] See reputation and stats

### Data Persistence:
- [ ] Threads save to MongoDB
- [ ] Replies save to MongoDB
- [ ] Votes save to MongoDB
- [ ] Users save to MongoDB
- [ ] Data persists after refresh

---

## 🎉 Success Criteria

All features work if:
- ✅ Can register and login
- ✅ Can browse and search threads
- ✅ Can create threads with categories and tags
- ✅ Can add replies (including nested)
- ✅ Can vote on threads and replies
- ✅ Can view profiles
- ✅ All data saves to MongoDB
- ✅ All data persists after refresh
- ✅ No errors in browser console
- ✅ No errors in backend console

---

## 🐛 Common Issues

### Issue: "Unauthorized"
- **Fix:** Login again, token might have expired

### Issue: "Thread not created"
- **Fix:** Check if category and tags are valid IDs

### Issue: "Reply not showing"
- **Fix:** Refresh page, check MongoDB

### Issue: "Vote not working"
- **Fix:** Make sure you're logged in

### Issue: "Profile not loading"
- **Fix:** Check user ID in URL, verify backend response

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

Authentication:
- Register: ✅/❌
- Login: ✅/❌
- Logout: ✅/❌

Home Page:
- View threads: ✅/❌
- Search: ✅/❌
- Filter: ✅/❌
- Sort: ✅/❌

Create Thread:
- Form loads: ✅/❌
- Create works: ✅/❌
- Saves to DB: ✅/❌

Thread Detail:
- View thread: ✅/❌
- Add reply: ✅/❌
- Vote: ✅/❌

Profile:
- View profile: ✅/❌
- See threads: ✅/❌

Overall: ✅/❌
```

---

**Everything should work perfectly with the backend!** 🚀
