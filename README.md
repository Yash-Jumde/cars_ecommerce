# Car Marketplace

A full-stack e-commerce application built with Next.js, Sanity CMS, and Firebase authentication.

## Features

- Product browsing and detailed product pages
- User authentication (signup/login)
- Shopping cart functionality
- Payment processing with Razorpay
- Content management with Sanity Studio

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: TailwindCSS 4
- **CMS**: Sanity
- **Authentication**: Firebase
- **Payment Processing**: Razorpay
- **Notifications**: react-hot-toast

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm or yarn package manager
- A Sanity account
- A Firebase account
- A Razorpay account (for payment processing)

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd cars
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:

```
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-04-13
NEXT_PUBLIC_SANITY_TOKEN=your_sanity_token

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

## Running the Development Server

Start the development server using Turbopack (for faster development experience):

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Sanity Studio

Access the Sanity Studio CMS at [http://localhost:3000/studio](http://localhost:3000/studio). 

You'll need to log in with your Sanity credentials to manage content.

## Build for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

- `/components` - React components
- `/context` - Context providers for authentication and state management
- `/lib` - Utility functions and API clients
- `/pages` - Next.js pages and API routes
- `/public` - Static assets
- `/src/sanity` - Sanity CMS configuration and schemas
- `/styles` - CSS styles

## Setting up Sanity

The project uses Sanity as its content management system. The schema is already set up in the `/src/sanity/schemaTypes` directory.

Make sure you have created a Sanity project and obtained the necessary credentials for the environment variables.

## Setting up Firebase Authentication

1. Create a project in the [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication in the Authentication section
3. Get your Firebase configuration from Project Settings and add it to your `.env.local` file

## Setting up Razorpay

1. Create an account on [Razorpay](https://razorpay.com/)
2. Get your API keys from the Dashboard
3. Add your keys to the `.env.local` file

## License

[MIT](LICENSE)