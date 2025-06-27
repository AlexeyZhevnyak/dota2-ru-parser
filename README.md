# Dota 2 Profile Parser

A Next.js application that parses Dota 2 profiles from dota2.ru and analyzes them using Google's Gemini AI.

## Features

- Parse user profiles from dota2.ru
- Extract topics and posts
- Analyze user posts with Gemini AI
- Display results in a user-friendly interface

## Project Structure

The project follows a modern, modular architecture:

```
src/
├── app/               # Next.js app router
├── components/        # React components
│   ├── forms/         # Form components
│   ├── layout/        # Layout components
│   └── ui/            # UI components
├── config/            # Application configuration
├── hooks/             # Custom React hooks
├── lib/               # Legacy code (deprecated)
├── services/          # Service modules
├── styles/            # Styles
└── types/             # TypeScript type definitions
```

## Technologies Used

- **Frontend**: React 19, Next.js 15, TypeScript
- **UI**: Ant Design
- **AI**: Google Gemini AI
- **Parsing**: JSDOM

## Getting Started

### Prerequisites

- Node.js 18+
- Google API key for Gemini AI

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
GOOGLE_API_KEY=your_google_api_key
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Architecture

The application follows these architectural principles:

- **Separation of Concerns**: UI components, business logic, and data fetching are separated
- **Functional Programming**: Uses functional components and hooks
- **Type Safety**: Comprehensive TypeScript types
- **Configuration Management**: Centralized configuration
- **Service-Oriented**: Business logic is encapsulated in service modules

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
