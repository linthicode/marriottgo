# Backend-Frontend Integration Guide

This guide explains how the backend AI recommendation system integrates with the frontend.

## Overview

The integration enables two key features:
1. **Automatic User Embedding Updates**: When a user creates a post, their preferences are automatically updated
2. **AI-Powered Recommendations**: When a user clicks on a post, they see personalized recommendations

## Architecture

```
Frontend (React) ←→ Backend API (Flask) ←→ Supabase Database
```

## Integration Points

### 1. Post Creation Flow

**Frontend**: `src/components/ModalPost.jsx`
- After successfully creating a post in Supabase
- Calls `POST /events/post-created` with the post ID
- Backend updates user embeddings based on the post data

**Backend**: `backend/Main.py`
- Endpoint: `POST /events/post-created`
- Extracts post data from Supabase
- Updates user embedding using ML model
- Stores updated embedding back to Supabase

### 2. Recommendation Flow

**Frontend**: `src/components/ModalBook.jsx`
- When ModalBook opens with a post ID
- Calls `GET /api/recs/from-post/{post_id}`
- Displays AI recommendations in the UI

**Backend**: `backend/Main.py`
- Endpoint: `GET /api/recs/from-post/{post_id}`
- Fetches user embedding and post location
- Generates location dataset around the post
- Returns top 4 personalized recommendations

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
pip install -r ../requirements.txt
python Main.py
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Test Integration

```bash
node test_backend_integration.js
```

## API Endpoints

### POST /events/post-created
Updates user embeddings when a new post is created.

**Request:**
```json
{
  "post_id": "uuid-string"
}
```

**Response:**
```json
{
  "ok": true,
  "user_id": "user-uuid",
  "post_id": "post-uuid"
}
```

### GET /api/recs/from-post/{post_id}
Gets personalized recommendations for a specific post.

**Response:**
```json
{
  "top_four": ["Place 1", "Place 2", "Place 3", "Place 4"],
  "near": "Location Name",
  "user_posts_count": 5,
  "total_places_found": 25
}
```

## Error Handling

- If embedding update fails, post creation still succeeds
- If recommendations fail, ModalBook shows loading state
- All API calls include proper error handling and logging

## Configuration

### Backend Configuration
- Update `SUPABASE_URL` and `SUPABASE_KEY` in `backend/db.py`
- Modify API endpoints in `backend/Main.py` if needed

### Frontend Configuration
- Update API URLs in `src/components/ModalPost.jsx` and `src/components/ModalBook.jsx`
- Default: `http://localhost:5000`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Flask-CORS is properly configured
2. **Connection Refused**: Verify backend is running on port 5000
3. **Supabase Errors**: Check database credentials and table structure
4. **ML Model Errors**: Ensure all Python dependencies are installed

### Debug Steps

1. Check browser console for frontend errors
2. Check backend console for API errors
3. Verify Supabase connection
4. Test API endpoints directly with curl/Postman

## Development Notes

- The integration is designed to be fault-tolerant
- Frontend continues to work even if backend is unavailable
- User experience is not disrupted by API failures
- All API calls are asynchronous and non-blocking
