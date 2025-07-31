# Mental Health Support App

A professional AI-powered mental health counseling platform built with Next.js, TypeScript, and Material Design 3. This application provides 24/7 mental health support with privacy and confidentiality at its core.

## 🌟 Features

### Core Functionality
- **Professional Counseling**: AI-powered mental health support with 30 years of experience simulation
- **Multi-language Support**: Cantonese (地道香港廣東話口語), Mandarin (普通话), and English
- **Agentic RAG**: Advanced retrieval-augmented generation for context-aware responses
- **Client Isolation**: Complete privacy with individual browser identity tracking
- **Real-time Streaming**: Live response streaming for natural conversation flow
- **Knowledge Base**: Uses knowledge.txt for domain expertise

### User Experience
- **Material Design 3**: Modern, accessible UI following Google's design principles
- **Responsive Design**: Works seamlessly on all devices
- **Professional Theme**: Health-focused color scheme and animations
- **Interactive Elements**: Smooth animations and transitions
- **Session Management**: Track conversation history and client statistics

### Technical Features
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Type-safe development
- **LangChain**: Advanced AI/LLM integration
- **Vector Database**: Semantic search for knowledge retrieval
- **Client-side Storage**: Secure conversation history management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenRouter API key
- SiliconFlow API key

### Installation

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
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   SILICONFLOW_API_KEY=your_siliconflow_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### API Keys Setup

#### OpenRouter API Key
1. Visit [OpenRouter](https://openrouter.ai/)
2. Create an account and get your API key
3. Add it to `.env.local` as `OPENROUTER_API_KEY`

#### SiliconFlow API Key
1. Visit [SiliconFlow](https://siliconflow.cn/)
2. Create an account and get your API key
3. Add it to `.env.local` as `SILICONFLOW_API_KEY`

### Model Configuration
The app uses:
- **LLM Model**: `deepseek/deepseek-r1-0528:free` (via OpenRouter)
- **Embedding Model**: `BAAI/bge-m3` (via SiliconFlow)
- **Context Window**: 163,840 tokens

## 📁 Project Structure

```
mental-health-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       ├── route.ts          # Main chat API
│   │   │       └── history/
│   │   │           └── route.ts      # History management API
│   │   ├── chat/
│   │   │   └── page.tsx              # Chat interface
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Homepage
│   ├── components/
│   │   ├── AppBarComponent.tsx       # Navigation bar
│   │   ├── chat.tsx                  # Main chat component
│   │   ├── MessageInputComponent.tsx # Message input
│   │   ├── MessageListComponent.tsx  # Message display
│   │   └── Sidebar.tsx               # Sidebar component
│   ├── lib/
│   │   ├── db.ts                     # Database operations
│   │   └── utils.ts                  # Utility functions
│   └── theme.ts                      # Material Design 3 theme
├── data/
│   └── knowledge.txt                 # Domain knowledge base
├── public/                           # Static assets
├── .env.local                        # Environment variables
├── package.json                      # Dependencies
└── README.md                         # This file
```

## 🎨 Design System

### Material Design 3
The app follows Google's Material Design 3 principles:
- **Color Scheme**: Health-focused purple and green palette
- **Typography**: Roboto font family with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Elevation**: Subtle shadows and depth
- **Animation**: Smooth transitions and micro-interactions

### Color Palette
- **Primary**: `#6750A4` (Calming purple)
- **Secondary**: `#4A9C47` (Healing green)
- **Background**: `#FEF7FF` (Soft surface)
- **Surface**: `#FFFFFF` (Clean white)

## 🤖 AI Features

### Agentic RAG Implementation
The app uses an advanced Agentic RAG system:
- **Knowledge Retrieval**: Semantic search through domain knowledge
- **Context Management**: Intelligent conversation tracking
- **Skill Detection**: Automatic identification of relevant counseling skills
- **Response Generation**: Context-aware, professional responses

### Counseling Approach
Based on the Lifeskills Counseling model:
- **RUC Framework**: Relating, Understanding, Changing
- **STC Analysis**: Situation-Thoughts-Consequences
- **Mind Skills**: Rules, Perceptions, Self-Talk, Visual Images, Explanations, Expectations
- **Communication Skills**: Verbal, vocal, bodily, touch, action

## 🔒 Privacy & Security

### Data Protection
- **Client Isolation**: Each user has a unique client ID
- **No Cross-Contamination**: Complete separation between users
- **Local Storage**: Conversations stored locally with encryption
- **No Personal Data**: No collection of personal information

### Security Features
- **API Key Protection**: Environment variable storage
- **HTTPS Only**: Secure communication
- **Input Validation**: Sanitized user inputs
- **Error Handling**: Graceful error management

## 🌐 Deployment

### Vercel Deployment
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add API keys in Vercel dashboard
3. **Build Settings**: Vercel automatically detects Next.js
4. **Deploy**: Automatic deployment on push to main branch

### Environment Variables for Production
```env
OPENROUTER_API_KEY=your_production_openrouter_key
SILICONFLOW_API_KEY=your_production_siliconflow_key
```

## 📱 Usage

### Getting Started
1. **Visit the homepage**: Learn about the service
2. **Click "Get Started"**: Navigate to the chat interface
3. **Select Language**: Choose your preferred language
4. **Start Chatting**: Begin your counseling session

### Features
- **Language Selection**: Switch between Cantonese, Mandarin, and English
- **Session Info**: View conversation statistics and focus areas
- **Reset History**: Clear conversation history when needed
- **Responsive Design**: Works on desktop, tablet, and mobile

### Best Practices
- **Be Honest**: Share your thoughts and feelings openly
- **Be Patient**: Allow time for thoughtful responses
- **Be Consistent**: Regular sessions provide better results
- **Be Safe**: This is not a replacement for professional help in crisis

## 🛠️ Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Next.js recommended configuration
- **Prettier**: Consistent code formatting
- **Material-UI**: Component-based architecture

### Testing
```bash
# Run tests (when implemented)
npm test

# Run type checking
npx tsc --noEmit
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Important Notes

### Crisis Support
This application is designed for general mental health support and is **NOT** a replacement for professional help in crisis situations. If you are experiencing a mental health crisis:

- **Emergency Services**: Call 911 (US) or your local emergency number
- **Crisis Hotlines**: 
  - National Suicide Prevention Lifeline: 988 (US)
  - Crisis Text Line: Text HOME to 741741 (US)
- **Professional Help**: Contact a licensed mental health professional

### Limitations
- **AI Assistant**: This is an AI-powered tool, not a human therapist
- **No Diagnosis**: The app cannot provide medical diagnoses
- **No Medication**: Cannot prescribe or recommend medications
- **Crisis Situations**: Not suitable for acute mental health crises

## 📞 Support

For technical support or questions about the application:
- **Issues**: Create an issue on GitHub
- **Documentation**: Check this README and inline code comments
- **Community**: Join our community discussions

---

**Built with ❤️ for mental health support**