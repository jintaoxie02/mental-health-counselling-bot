# Mental Health App Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mental-health-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   **Option A: Use the setup script (Recommended)**
   ```bash
   npm run setup-env
   ```
   This will create a `.env.local` file with instructions. Edit it with your actual API keys.
   
   **Option B: Create manually**
   Create a `.env.local` file in the root directory (as specified in prompt.txt line 5) with the following content:
   ```env
   # API Keys for Mental Health App
   OPENROUTER_API_KEY=your_actual_openrouter_api_key_here
   SILICONFLOW_API_KEY=your_actual_siliconflow_api_key_here
   ```

   **Important:** Replace the placeholder values with your actual API keys:
   
   - **OpenRouter API Key**: Get your free API key from [OpenRouter](https://openrouter.ai/)
   - **SiliconFlow API Key**: Get your API key from [SiliconFlow](https://api.siliconflow.cn/)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## API Key Setup

### OpenRouter API Key
1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up for a free account
3. Navigate to your API keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

### SiliconFlow API Key
1. Go to [SiliconFlow](https://api.siliconflow.cn/)
2. Sign up for an account
3. Navigate to your API keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

## Troubleshooting

### "I'm here to support you. Could you share what's on your mind?" Error
This error occurs when the API keys are not properly configured. Please:

1. Check that your `.env.local` file exists in the root directory (as specified in prompt.txt line 5)
2. Verify that both API keys are set correctly
3. Restart the development server after making changes
4. Check the browser console for any error messages

### Other Common Issues
- **Port already in use**: Change the port in `package.json` or kill the process using the port
- **Module not found**: Run `npm install` to install missing dependencies
- **API rate limits**: Check your API key usage limits on the respective platforms

## Features

- **Multi-language Support**: Cantonese (地道香港廣東話口語), Mandarin, and English
- **Conversation History**: Persistent chat history per user with browser identity tracking
- **Professional Counseling**: AI-powered mental health support with 30 years experience
- **Responsive Design**: Works on desktop and mobile devices
- **Material Design 3**: Modern, accessible UI with health professional theme
- **Agentic RAG**: Advanced knowledge retrieval from knowledge.txt
- **Client Isolation**: No data leakage between clients

## Deployment

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 