# Lekker Ababili - Language Learning for Afrikaans Speakers

A modern web-based language learning platform designed specifically for **Afrikaans speakers** to learn other languages. All lessons, explanations, and instructions are provided in Afrikaans, making it easier for native Afrikaans speakers to grasp new languages.

## 🌍 Purpose

**Lekker Ababili** helps Afrikaans speakers learn languages like English, Spanish, French, German, Chinese, and more - all taught in their native Afrikaans language.

## ✨ Features

- **Multi-Language Support**: Learn English, Spanish, French, German, Portuguese, Italian, Zulu, Xhosa, Chinese, Japanese, Korean, Arabic, Russian, Dutch, and more
- **AI-Powered Tutoring**: Interactive chat tutor that explains concepts in Afrikaans
- **Interactive Exercises**: Quizzes and practice sessions with Afrikaans instructions
- **AR Translation**: Camera-based real-time translation with Afrikaans explanations
- **Voice Practice**: Pronunciation coaching with Afrikaans feedback
- **Progress Tracking**: Monitor your learning journey
- **Adaptive Learning**: Personalized lesson paths based on your progress

## 🛠 Tech Stack

- **React** with **TypeScript** for type safety
- **Vite** for fast development and builds
- **Tailwind CSS** + **shadcn/ui** for modern styling
- **React Router** for navigation
- **Context API** for state management
- **TTS Services** for pronunciation
- **Supabase** for backend (optional)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Supabase account (https://supabase.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ADHDSuperShift/lekker-ababili.git
   cd lekker-ababili
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase** (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions)
   - Create a Supabase project
   - Run the database schema from `supabase-schema.sql`
   - Copy your project URL and anon key

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://127.0.0.1:8080
   npm run ios    # for iOS simulator
   npm run android # for Android emulator
   ```

## Project Structure

```
src/
├── contexts/          # React Context providers
│   ├── AuthContext.tsx
│   └── AppContext.tsx
├── screens/           # Main application screens
│   ├── AuthScreen.tsx
│   ├── LearnScreen.tsx
│   ├── ChatScreen.tsx
│   ├── ExercisesScreen.tsx
│   └── ProfileScreen.tsx
└── App.tsx           # Main app component with navigation
```

## Key Components

### Authentication
- Login/Register forms with validation
- Persistent user sessions with AsyncStorage
- Mock authentication for development

### Learning Features
- Lesson cards with difficulty indicators
- Progress tracking and statistics
- Interactive exercises with scoring
- AI chat tutor with conversation history

### User Experience
- Native mobile UI components
- Smooth animations and transitions
- Responsive design for different screen sizes
- Intuitive bottom tab navigation

## Development

The app uses React Native best practices:
- StyleSheet API for performant styling
- Native components (View, Text, TouchableOpacity)
- Platform-specific optimizations
- Proper keyboard handling
- Safe area considerations

## Future Enhancements

- Real backend integration
- Voice recognition for pronunciation
- Offline lesson downloads
- Social features and leaderboards
- Push notifications for study reminders