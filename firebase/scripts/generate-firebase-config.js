// scripts/generate-firebase-config.js
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');

// Check if .env exists before attempting to load it
if (fs.existsSync(envPath)) {
  // Requires Node.js 20.6.0+ / 22+ / 24+
  process.loadEnvFile(envPath);
} else {
  console.warn('⚠️  No .env file found. Falling back to system environment variables.');
}

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  recaptchaEnterpriseKey: process.env.RECAPTCHA_ENTERPRISE_KEY,
  vertexLocation: process.env.FIREBASE_VERTEX_LOCATION,
};

// Validate that critical variables are present (optional but recommended)
if (!config.apiKey || !config.projectId) {
  console.warn(
    '⚠️  Missing critical Firebase configuration in environment variables. You will need to define them in .env before running the application.',
  );
}

const targetPath = path.resolve(process.cwd(), 'src/firebase.config.json');

fs.writeFileSync(targetPath, JSON.stringify(config, null, 2), 'utf-8');
console.log('✅ Firebase configuration generated successfully at ' + targetPath);
