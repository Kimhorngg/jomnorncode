# JomNornCode Learning Platform

A modern, full-featured Learning Management System (LMS) built with React, Vite, and Tailwind CSS. The platform enables users to discover courses, track progress, complete quizzes, and earn certificates.

## 🚀 Features

- **Course Management** - Browse and enroll in courses with detailed curriculum
- **Interactive Learning** - Lessons with code editors supporting HTML, JavaScript, and CSS
- **Quiz System** - Complete quizzes to test knowledge
- **Progress Tracking** - Monitor course completion with progress indicators
- **Certificates** - Generate and download PDF certificates upon course completion
- **User Authentication** - Firebase authentication with social login support (Google, Facebook)
- **Admin Dashboard** - Comprehensive dashboard for managing courses, quizzes, users, and certificates
- **Dark Mode** - Full dark mode support with #101827 dark backgrounds
- **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- **Real-time Updates** - Hot Module Replacement (HMR) for seamless development

## 🛠️ Tech Stack

- **Frontend Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v3+
- **State Management:** Redux
- **Routing:** React Router v6
- **Authentication:** Firebase
- **Code Editor:** Monaco Editor
- **Icons:** Lucide React, React Icons
- **Alerts:** SweetAlert2
- **Notifications:** React Hot Toast
- **PDF Generation:** jsPDF
- **Email:** EmailJS

## 📂 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── navbar/         # Navigation components
│   ├── firebase/       # Firebase configuration
│   └── social-auth/    # Social authentication
├── pages/              # Page components
│   ├── Course.jsx
│   ├── Learn.jsx
│   ├── Quiz.jsx
│   ├── Enrollment.jsx
│   ├── Certificate.jsx
│   ├── Dashboard.jsx   # Admin dashboard
│   └── ...
├── features/           # Redux slices
│   └── auth/          # Authentication state
├── services/           # API services
├── utils/              # Utility functions
├── assets/             # Images and static files
└── main.jsx           # Entry point
```

## 🎨 Color Scheme

- **Primary Blue:** #3f71ae
- **Dark Blue:** #112d51
- **Accent Orange:** #f39c0f
- **Dark Background:** #101827
- **Light Background:** #f5f7fb

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Key Pages

| Page         | Route                    | Description                            |
| ------------ | ------------------------ | -------------------------------------- |
| Homepage     | `/`                      | Landing page with course showcase      |
| Courses      | `/course`                | Browse all available courses           |
| Learn Lesson | `/learn-lesson/:id`      | Interactive lesson with code editor    |
| Quiz         | `/quiz/:id`              | Course quiz assessment                 |
| Enrollment   | `/enrollment/:courseId`  | Certificate enrollment form            |
| Certificate  | `/certificate/:courseId` | View and download certificate          |
| Dashboard    | `/dashboard`             | Admin management panel                 |
| Profile      | `/profile`               | User profile and stats                 |
| Document     | `/document`              | Platform documentation with pagination |

## 🔐 Authentication

- Firebase Authentication
- Social login (Google, Facebook)
- Role-based access control (Admin, Student)
- Token-based API authentication

## 📊 Admin Dashboard Features

- **Course Management** - Create, edit, delete courses
- **Quiz Management** - Manage quiz questions and scoring
- **User Tracking** - Monitor student progress and activity
- **Certificate Tracking** - View all issued certificates
- **Dark Mode Support** - Full dark mode styling

## 🎯 Recent Enhancements

- ✅ Back buttons on Certificate and Enrollment pages with proper navigation
- ✅ Dark mode with #101827 background colors
- ✅ Document page pagination (3 items per page)
- ✅ Blue theme (#3f71ae) throughout the application
- ✅ Full-screen code editor with language detection
- ✅ Social media meta tags with custom thumbnail
- ✅ Responsive navbar aligned throughout all pages

## 📦 Dependencies

Key dependencies are listed in `package.json`. Notable packages:

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "redux": "^4.x",
  "react-redux": "^8.x",
  "@monaco-editor/react": "^4.x",
  "tailwindcss": "^3.x",
  "firebase": "^10.x",
  "jspdf": "^2.x"
}
```

## 🌐 Deployment

Deployed on **Vercel** at [jomnorncode3.vercel.app](https://jomnorncode3.vercel.app/)

## 📧 Email Integration

Contact form integration via EmailJS for user inquiries and support.

## 🔄 API Integration

Connected to backend API at `https://jomnorncode-api.cheat.casa/api` for:

- Course data
- User enrollment
- Quiz submissions
- Certificate generation

## 📝 ESLint Configuration

The project uses ESLint with React-specific rules. For production applications, consider enabling TypeScript with type-aware lint rules.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is part of the JomNornCode learning platform.
