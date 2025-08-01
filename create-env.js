#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envContent = `# Mental Health Counseling App Environment Variables
# API Configuration as specified in prompt.txt

# OpenRouter API for Chat Model (z-ai/glm-4.5-air:free)
# Get your API key from: https://openrouter.ai/
# Model: z-ai/glm-4.5-air:free with 131,072 context window
# Supports hybrid inference modes with "thinking mode" and "non-thinking mode"
OPENROUTER_API_KEY=your_openrouter_api_key_here

# SiliconFlow API for Embeddings (BAAI/bge-m3)
# Get your API key from: https://api.siliconflow.cn/
# Used for embedding generation with BAAI/bge-m3 model
SILICONFLOW_API_KEY=your_siliconflow_api_key_here

# Next.js Environment
NODE_ENV=development

# Vercel Deployment URL
NEXT_PUBLIC_VERCEL_URL=https://mental-health-counselling-bot.vercel.app

# Instructions:
# 1. Replace 'your_openrouter_api_key_here' with your actual OpenRouter API key
# 2. Replace 'your_siliconflow_api_key_here' with your actual SiliconFlow API key
# 3. Ensure the file is saved as .env.local in the root directory
# 4. Restart the development server: npm run dev
# 5. Deploy to Vercel using GitHub integration (no Vercel CLI needed)
`;

const envPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local file already exists!');
  console.log('Please edit the existing file with your API keys.');
} else {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file successfully!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Edit .env.local and replace the placeholder values with your actual API keys');
  console.log('2. Get OpenRouter API key from: https://openrouter.ai/');
  console.log('3. Get SiliconFlow API key from: https://api.siliconflow.cn/');
  console.log('4. The app uses z-ai/glm-4.5-air:free model with BAAI/bge-m3 embeddings');
  console.log('5. Restart the development server: npm run dev');
  console.log('');
  console.log('🔧 The file has been created with instructions inside.');
}

console.log('');
console.log('📚 For more help, see SETUP.md'); 