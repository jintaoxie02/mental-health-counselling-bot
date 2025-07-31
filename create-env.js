#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envContent = `# API Keys for Mental Health App
# Create this file as .env.local (as specified in prompt.txt line 5)

# Get your OpenRouter API key from: https://openrouter.ai/
# Used for deepseek/deepseek-r1-0528:free model with 163,840 context window
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Get your SiliconFlow API key from: https://api.siliconflow.cn/
# Used for BAAI/bge-m3 embeddings
SILICONFLOW_API_KEY=your_siliconflow_api_key_here

# Instructions:
# 1. Replace 'your_openrouter_api_key_here' with your actual OpenRouter API key
# 2. Replace 'your_siliconflow_api_key_here' with your actual SiliconFlow API key
# 3. Save the file as .env.local in the root directory
# 4. Restart the development server: npm run dev
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
  console.log('4. Restart the development server: npm run dev');
  console.log('');
  console.log('🔧 The file has been created with instructions inside.');
}

console.log('');
console.log('📚 For more help, see SETUP.md'); 