# Lekker Ababili - Mobile Language Learning App

A React Native language learning application built with Expo, featuring AI-powered tutoring, interactive exercises, and progress tracking.

## Features

- **Authentication**: User registration and login with AsyncStorage persistence
- **Learn Screen**: Browse lessons with difficulty levels and progress tracking
- **AI Chat Tutor**: Interactive conversation with AI language assistant
- **Interactive Exercises**: Multiple-choice quizzes with immediate feedback
- **Profile Management**: User stats, achievements, and settings
- **Bottom Tab Navigation**: Intuitive mobile navigation between main features

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **AsyncStorage** for local data persistence
- **Expo Vector Icons** for consistent iconography
- **Context API** for state management

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your mobile device (for testing)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go app or run on simulator:
   ```bash
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