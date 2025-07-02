#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * 
 * This script validates that all required environment variables are set
 * before building or running the application.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const requiredEnvVars = {
  // Database
  DATABASE_URL: 'PostgreSQL connection string for Prisma ORM',
  DIRECT_URL: 'Direct PostgreSQL connection string for migrations',
  
  // Authentication
  NEXTAUTH_URL: 'The canonical URL of your site',
  NEXTAUTH_SECRET: 'Secret key for NextAuth session encryption (min 32 chars)',
  
  // Email
  RESEND_API_KEY: 'Resend API key for transactional emails',
  EMAIL_FROM: 'Default from email address',
  
  // AWS
  AWS_ACCESS_KEY_ID: 'AWS access key for S3',
  AWS_SECRET_ACCESS_KEY: 'AWS secret key for S3',
  AWS_REGION: 'AWS region for S3 bucket',
  BUCKET_NAME: 'S3 bucket name for file storage',
  
  // AI Services
  OPENAI_API_KEY: 'OpenAI API key',
  PERPLEXITY_API_KEY: 'Perplexity API key',
  GEMINI_API_KEY: 'Google Gemini API key',
  GROQ_API_KEY: 'Groq API key for audio transcription',
};

const optionalEnvVars = {
  // Deployment
  VERCEL_URL: 'Automatically set by Vercel',
  PORT: 'Server port (defaults to 3000)',
  NODE_ENV: 'Node environment',
  
  // Event Processing
  INNGEST_EVENT_KEY: 'Inngest event processing key',
  
  // Email (alternative SMTP config)
  EMAIL_SERVER_PASSWORD: 'SMTP password if not using Resend',
  
  // Monitoring
  CHROMATIC_PROJECT_TOKEN: 'Chromatic project token for visual testing',
};

interface ValidationResult {
  missing: string[];
  warnings: string[];
  valid: boolean;
}

function validateEnvironment(): ValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];
  
  // Check required variables
  for (const [key, description] of Object.entries(requiredEnvVars)) {
    if (!process.env[key]) {
      missing.push(`${key}: ${description}`);
    }
  }
  
  // Special validations
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    warnings.push('NEXTAUTH_SECRET should be at least 32 characters long');
  }
  
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgresql://')) {
    warnings.push('DATABASE_URL should start with postgresql://');
  }
  
  if (process.env.NEXTAUTH_URL && process.env.NODE_ENV === 'production') {
    if (process.env.NEXTAUTH_URL.startsWith('http://')) {
      warnings.push('NEXTAUTH_URL should use HTTPS in production');
    }
  }
  
  // Check if any optional vars are partially configured
  if (process.env.AWS_ACCESS_KEY_ID && !process.env.AWS_SECRET_ACCESS_KEY) {
    warnings.push('AWS_ACCESS_KEY_ID is set but AWS_SECRET_ACCESS_KEY is missing');
  }
  
  return {
    missing,
    warnings,
    valid: missing.length === 0,
  };
}

function main() {
  console.log('🔍 Validating environment variables...\n');
  
  const result = validateEnvironment();
  
  if (result.missing.length > 0) {
    console.error('❌ Missing required environment variables:\n');
    result.missing.forEach(item => console.error(`   • ${item}`));
    console.error('\n📋 Copy .env.local.example to .env.local and fill in the values\n');
  }
  
  if (result.warnings.length > 0) {
    console.warn('⚠️  Warnings:\n');
    result.warnings.forEach(warning => console.warn(`   • ${warning}`));
    console.warn('');
  }
  
  if (result.valid) {
    console.log('✅ All required environment variables are set!\n');
    
    // Show optional vars that aren't set
    const unsetOptional = Object.keys(optionalEnvVars).filter(key => !process.env[key]);
    if (unsetOptional.length > 0) {
      console.log('ℹ️  Optional variables not set (this is OK):');
      unsetOptional.forEach(key => console.log(`   • ${key}`));
      console.log('');
    }
  } else {
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateEnvironment };