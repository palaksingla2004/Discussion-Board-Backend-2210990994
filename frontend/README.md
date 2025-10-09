# Forum Frontend

Modern React frontend for the discussion forum platform.

## Features

- User authentication (login/register)
- Browse and search threads
- Create new threads with categories and tags
- Reply to threads with nested comments
- Upvote/downvote threads and replies
- User profiles
- Responsive design

## Tech Stack

- React 18
- React Router v6
- Axios for API calls
- Vite for build tooling
- React Icons
- date-fns for date formatting

## Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   ├── context/        # React context (Auth)
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## API Integration

The frontend connects to the backend API running on http://localhost:5000. The Vite proxy configuration handles API requests automatically.

## Usage

1. Make sure the backend server is running on port 5000
2. Start the frontend development server
3. Open http://localhost:3000 in your browser
4. Register a new account or login with existing credentials
5. Browse threads, create new ones, and participate in discussions
