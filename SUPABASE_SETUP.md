# Supabase Setup Guide for Lekker Ababili

This guide will help you set up Supabase for the Lekker Ababili app.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your Supabase project created

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Enter project details:
   - **Name**: lekker-ababili
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to your users
4. Click "Create new project"

## Step 2: Get Your API Keys

1. Go to your project settings
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key

## Step 3: Update Environment Variables

Update your `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Run Database Schema

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Click "New query"
4. Copy the contents of `supabase-schema.sql` and paste it
5. Click "Run" to execute the schema

This will create:
- Users table (extends auth.users)
- User progress tracking
- Lessons table
- Lesson completions
- Vocabulary/wordbook
- Achievements system
- Row Level Security (RLS) policies

## Step 5: Configure Authentication

### Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)

### Enable Social Auth (Optional)

If you want Google, Apple, or Facebook login:

1. Go to **Authentication** → **Providers**
2. Enable the provider you want
3. Add the OAuth credentials from your provider's console

## Step 6: Seed Initial Data (Optional)

You can add initial lessons by running SQL queries in the SQL Editor:

```sql
-- Example: Add English beginner lesson
INSERT INTO public.lessons (
  language,
  title,
  title_af,
  description,
  description_af,
  difficulty,
  content,
  order_index
) VALUES (
  'en',
  'English Greetings',
  'Engelse Groete',
  'Learn basic English greetings and introductions',
  'Leer basiese Engelse groete en bekendstellings',
  'beginner',
  '{"vocab": ["Hello", "Goodbye", "Thank you"], "phrases": ["How are you?", "Nice to meet you"]}'::jsonb,
  1
);
```

## Step 7: Test the Connection

In your app, test the Supabase connection:

```typescript
import { supabase, supabaseHelpers } from './lib/supabase';

// Test connection
const testConnection = async () => {
  const user = await supabaseHelpers.getCurrentUser();
  console.log('Connected to Supabase!', user);
};
```

## Database Schema Overview

### Tables

1. **users** - User profiles (linked to auth.users)
2. **user_progress** - Track learning progress per language
3. **lessons** - Store lesson content
4. **lesson_completions** - Track completed lessons
5. **vocabulary** - User's personal wordbook
6. **achievements** - Available achievements
7. **user_achievements** - Earned achievements

### Security

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- Lessons and achievements are publicly readable
- All modifications are restricted to own data

## Next Steps

1. Add your Supabase credentials to `.env`
2. Run the schema SQL in Supabase SQL Editor
3. Test authentication in your app
4. Start adding lesson content

## Useful Supabase Features

- **Realtime**: Subscribe to database changes
- **Storage**: Store user avatars, audio files
- **Edge Functions**: Serverless functions for complex operations
- **Database Functions**: Custom SQL functions for business logic

## Resources

- Supabase Docs: https://supabase.com/docs
- Supabase JS Client: https://supabase.com/docs/reference/javascript
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security
