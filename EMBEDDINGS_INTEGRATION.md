# Embeddings Integration Guide

This guide explains how user preferences from onboarding are converted to embeddings and stored in Supabase for personalized recommendations.

## Overview

The system now automatically:
1. **Captures user preferences** during onboarding questions
2. **Converts preferences to embeddings** (13-dimensional preference vectors)
3. **Stores embeddings in Supabase** profiles table
4. **Uses embeddings for AI recommendations** in the backend

## Architecture

```
Onboarding Questions → Preference Calculation → Supabase Storage → AI Recommendations
```

## Data Flow

### 1. Onboarding Process

**Frontend**: `src/pages/Onboarding.jsx`
- User answers questions about their interests
- System calculates preference scores based on ratings
- Embeddings are saved to Supabase profiles table

**Embedding Calculation**:
```javascript
// Interest categories mapped to indices 0-12
const INTEREST_INDEX = {
  "nature": 0,
  "museums": 1,
  "theatres_and_entertainments": 2,
  "urban_environment": 3,
  "historic": 4,
  "religion": 5,
  "architecture": 6,
  "industrial_facilities": 7,
  "amusements": 8,
  "sport": 9,
  "adult": 10,
  "shops": 11,
  "foods": 12,
};

// Rating to value mapping
function ratingToValue(rating) {
  switch (rating.toLowerCase()) {
    case "high": return 1.0;
    case "medium": return 0.5;
    case "low": return 0.25;
    default: return 0;
  }
}
```

### 2. Supabase Storage

**Table**: `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  embeddings FLOAT[] NOT NULL,  -- 13-dimensional preference vector
  posts INTEGER DEFAULT 0       -- Number of posts created
);
```

**API**: `src/api/profiles.js`
- `createOrUpdateProfile(userId, embeddings, postsCount)`
- `getProfile(userId)`
- `updateUserEmbeddings(userId, embeddings)`

### 3. Backend Integration

**Backend**: `backend/Main.py`
- Uses embeddings for personalized recommendations
- Creates default embeddings if none exist
- Updates embeddings based on user behavior

## Implementation Details

### Frontend Changes

#### 1. New API Module
**File**: `src/api/profiles.js`
- Handles profile creation and updates
- Manages embeddings storage in Supabase

#### 2. Updated Onboarding
**File**: `src/pages/Onboarding.jsx`
- Calculates embeddings from user preferences
- Saves embeddings to Supabase on completion
- Handles errors gracefully

### Backend Changes

#### 1. Default Embeddings
**File**: `backend/Main.py`
- Creates default embeddings for users without preferences
- Prevents API failures when embeddings are missing

#### 2. Error Handling
- Graceful fallback to default embeddings
- Logging for debugging embedding issues

## Embedding Structure

### Dimensions (13 total)
```
Index 0:  nature
Index 1:  museums  
Index 2:  theatres_and_entertainments
Index 3:  urban_environment
Index 4:  historic
Index 5:  religion
Index 6:  architecture
Index 7:  industrial_facilities
Index 8:  amusements
Index 9:  sport
Index 10: adult
Index 11: shops
Index 12: foods
```

### Value Mapping
- **High Interest**: 1.0
- **Medium Interest**: 0.5
- **Low Interest**: 0.25
- **No Selection**: 0.0

### Example Embedding
```javascript
// User with high nature, medium museums, high foods preferences
[1.0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.0]
```

## Usage Examples

### 1. Creating User Profile
```javascript
import { createOrUpdateProfile } from '../api/profiles';

const embeddings = [1.0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.0];
const { data, error } = await createOrUpdateProfile(userId, embeddings, 0);
```

### 2. Backend Usage
```python
# Get user embeddings
user_embedding = get_user_embedding(user_id)
if user_embedding is None:
    # Create default embeddings
    default_embedding = [0.5] * 13
    set_user_embedding(user_id, default_embedding)
    user_embedding = default_embedding
```

## Testing

### Test Script
```bash
node test_embeddings_integration.js
```

### Manual Testing
1. **Complete Onboarding**: Answer questions with different preferences
2. **Check Supabase**: Verify embeddings are stored in profiles table
3. **Test Recommendations**: Create posts and check if recommendations are personalized
4. **Backend Logs**: Check console for embedding-related messages

## Error Handling

### Frontend
- API failures don't prevent onboarding completion
- Local storage backup for offline scenarios
- Console logging for debugging

### Backend
- Default embeddings for missing profiles
- Graceful degradation when embeddings fail
- Detailed logging for troubleshooting

## Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  embeddings FLOAT[] NOT NULL,
  posts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes
```sql
CREATE INDEX idx_profiles_embeddings ON profiles USING GIN (embeddings);
```

## Performance Considerations

### Embedding Size
- **13 dimensions**: Lightweight and efficient
- **Float values**: Standard precision for ML models
- **Array storage**: Optimized for vector operations

### Caching
- Embeddings cached in backend memory
- Supabase handles database optimization
- Local storage backup for offline access

## Future Enhancements

### Potential Improvements
1. **Dynamic Embeddings**: Update based on user behavior
2. **Similarity Matching**: Find users with similar preferences
3. **Clustering**: Group users by preference patterns
4. **A/B Testing**: Compare recommendation algorithms

### Analytics
- Track embedding evolution over time
- Measure recommendation accuracy
- User preference pattern analysis

## Troubleshooting

### Common Issues

1. **Missing Embeddings**
   - Check if onboarding was completed
   - Verify Supabase connection
   - Check browser console for errors

2. **Invalid Embeddings**
   - Ensure 13-dimensional arrays
   - Validate value ranges (0-1)
   - Check interest index mapping

3. **API Failures**
   - Verify Supabase credentials
   - Check network connectivity
   - Review backend logs

### Debug Steps

1. **Check Supabase**: Verify profiles table has user data
2. **Console Logs**: Look for embedding-related messages
3. **Network Tab**: Check API call success/failure
4. **Backend Logs**: Review Python console output

## Security Considerations

### Data Privacy
- Embeddings are anonymized preference vectors
- No personal information in embedding data
- User consent for preference collection

### Access Control
- Supabase RLS policies protect user data
- API endpoints require authentication
- Backend validates user permissions

This integration ensures that every user gets personalized recommendations based on their stated preferences, creating a more engaging and relevant experience.
