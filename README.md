# Forum - Full Stack Discussion Platform

A complete full-stack discussion forum application with a robust backend API and modern React frontend. Built with Node.js, Express, MongoDB, and React.

## Quick Start

See [SETUP.md](SETUP.md) for detailed setup instructions.

**Automated Setup (Windows):**
```powershell
.\setup.ps1
```

Then start both servers:
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open http://localhost:3000 in your browser.

---

# Backend API Documentation

## Features

### Core Functionality
- **User Authentication**: JWT-based authentication with registration and login
- **Thread Management**: Create, read, update, delete discussion threads
- **Nested Replies**: Support for nested comment system with unlimited depth
- **Voting System**: Upvote/downvote threads and replies with reputation tracking
- **Categories**: Organize threads into different categories
- **Tags**: Tag threads for better discoverability and filtering
- **Search & Filtering**: Search threads by content, filter by categories, tags, and sort options

### Advanced Features
- **User Profiles**: Customizable user profiles with reputation system
- **Role-based Access**: User, moderator, and admin roles
- **Rate Limiting**: Protection against spam and abuse
- **Input Validation**: Comprehensive validation for all endpoints
- **Security**: Helmet.js, CORS, password hashing with bcrypt
- **Pagination**: Efficient pagination for all list endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Security**: Helmet, bcryptjs, CORS
- **Rate Limiting**: Express-rate-limit

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd forum-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/forum_db
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Seed the database (optional)**
   ```bash
   node utils/seedData.js
   ```

6. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 🧪 Testing the API

### ⚡ Thunder Client (Recommended - VS Code)
**Easiest way to test the API with a GUI interface:**

1. **Install Thunder Client extension** in VS Code
2. **Import collection**: Use `thunder-client-collection.json`
3. **Start testing**: All requests are pre-configured with automatic token management

See **[THUNDER_CLIENT_GUIDE.md](THUNDER_CLIENT_GUIDE.md)** for detailed instructions.

### 🤖 Automated Testing
Run the automated test script to verify everything works:

**Windows (PowerShell):**
```powershell
.\test-api.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x test-api.sh
./test-api.sh
```

### 📋 Manual Testing
For detailed manual testing with curl/PowerShell commands, see **[TESTING_GUIDE.md](TESTING_GUIDE.md)**

**Testing Options:**
- **Thunder Client** - GUI interface with automatic token management ⭐ **Recommended**
- **Automated Scripts** - One-click testing of all endpoints
- **Manual Commands** - Step-by-step curl/PowerShell examples
- **Postman/Insomnia** - Import the collection format

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:userId/threads` - Get user's threads
- `GET /api/users` - Search users

### Threads
- `GET /api/threads` - Get all threads (with filtering)
- `POST /api/threads` - Create new thread
- `GET /api/threads/:threadId` - Get single thread
- `PUT /api/threads/:threadId` - Update thread
- `DELETE /api/threads/:threadId` - Delete thread

### Replies
- `POST /api/replies/:threadId` - Add reply to thread
- `PUT /api/replies/:threadId/replies/:replyId` - Update reply
- `DELETE /api/replies/:threadId/replies/:replyId` - Delete reply

### Votes
- `POST /api/votes/threads/:threadId` - Vote on thread
- `POST /api/votes/threads/:threadId/replies/:replyId` - Vote on reply
- `GET /api/votes/threads/:threadId/stats` - Get vote statistics

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:categoryId` - Get single category
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:categoryId` - Update category (admin only)
- `DELETE /api/categories/:categoryId` - Delete category (admin only)

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/popular` - Get popular tags
- `GET /api/tags/:tagId` - Get tag with threads
- `GET /api/tags/suggest/:partial` - Get tag suggestions
- `PUT /api/tags/:tagId` - Update tag (admin only)
- `DELETE /api/tags/:tagId` - Delete tag (admin only)

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

### Create Thread
```bash
POST /api/threads
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "How to learn React effectively?",
  "content": "I'm new to React and looking for the best learning resources...",
  "category": "60f7b3b3b3b3b3b3b3b3b3b3",
  "tags": ["react", "javascript", "beginner"]
}
```

### Vote on Thread
```bash
POST /api/votes/threads/60f7b3b3b3b3b3b3b3b3b3b3
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "type": "upvote"
}
```

## Query Parameters

### Threads Filtering
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `category` - Filter by category ID
- `tags` - Filter by tag IDs (array)
- `sort` - Sort by: 'recent', 'popular', 'votes'
- `search` - Search in title and content

Example:
```
GET /api/threads?category=60f7b3b3b3b3b3b3b3b3b3b3&tags=react,javascript&sort=popular&page=1&limit=10
```

## Data Models

### User Schema
```javascript
{
  username: String (unique, 3-30 chars),
  email: String (unique),
  password: String (hashed),
  avatar: String (URL),
  bio: String (max 500 chars),
  reputation: Number (default: 0),
  role: String (user/moderator/admin),
  isActive: Boolean,
  joinedAt: Date,
  lastActive: Date
}
```

### Thread Schema
```javascript
{
  title: String (max 200 chars),
  content: String (max 10000 chars),
  author: ObjectId (User),
  category: ObjectId (Category),
  tags: [ObjectId] (Tag),
  votes: [{ user: ObjectId, type: String }],
  replies: [ReplySchema], // Nested replies
  views: Number,
  isPinned: Boolean,
  isLocked: Boolean,
  createdAt: Date,
  lastActivity: Date
}
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive validation for all inputs
- **CORS Protection**: Configurable CORS settings
- **Helmet Security**: Security headers protection
- **Role-based Access**: Different permission levels

## Error Handling

The API returns consistent error responses:

```javascript
{
  "message": "Error description",
  "errors": [/* Validation errors if applicable */]
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Sample Data

Run the seed script to populate the database with sample data:

```bash
node utils/seedData.js
```

This creates:
- Sample users (including admin account)
- Categories (Programming, Web Development, Career, etc.)
- Tags (javascript, react, nodejs, etc.)
- Sample threads with replies and votes

**Sample Accounts:**
- Admin: `admin@forum.com` / `Admin123!`
- User: `john@example.com` / `Password123!`
- User: `sarah@example.com` / `Password123!`
- User: `mike@example.com` / `Password123!`

## Development

### Project Structure
```
forum-backend/
├── models/           # Mongoose schemas
├── routes/           # Express route handlers
├── middleware/       # Custom middleware
├── utils/           # Utility functions
├── server.js        # Main application file
└── package.json     # Dependencies and scripts
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (when implemented)

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
