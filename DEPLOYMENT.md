# Vercel Deployment Guide

This guide will help you deploy the Mental Health Support Companion to Vercel.

## Prerequisites

1. **GitHub Repository**: The code is already pushed to https://github.com/jintaoxie02/mental-health-counselling-bot
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **API Keys**: You'll need OpenRouter and SiliconFlow API keys

## Step 1: Connect to Vercel

1. **Login to Vercel**: Go to [vercel.com](https://vercel.com) and sign in
2. **Import Project**: Click "New Project"
3. **Connect GitHub**: Select "Import Git Repository"
4. **Select Repository**: Choose `jintaoxie02/mental-health-counselling-bot`
5. **Configure Project**: Vercel will auto-detect it as a Next.js project

## Step 2: Configure Environment Variables

In the Vercel project settings, add these environment variables:

### Required Environment Variables
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
SILICONFLOW_API_KEY=your_siliconflow_api_key_here
```

### How to Add Environment Variables
1. Go to your project dashboard in Vercel
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add each variable:
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: Your OpenRouter API key
   - **Environment**: Production, Preview, Development
5. Repeat for `SILICONFLOW_API_KEY`

## Step 3: Deploy

1. **Automatic Deployment**: Vercel will automatically deploy when you push to the main branch
2. **Manual Deployment**: Click "Deploy" in the Vercel dashboard
3. **Wait for Build**: The build process will take 2-3 minutes

## Step 4: Verify Deployment

1. **Check Build Logs**: Ensure no errors during build
2. **Test the Application**: Visit your Vercel URL
3. **Test Features**:
   - Homepage loads correctly
   - Chat functionality works
   - Language switching works
   - Theme switching works
   - API endpoints respond

## Step 5: Custom Domain (Optional)

1. **Add Domain**: In Vercel dashboard, go to "Settings" → "Domains"
2. **Configure DNS**: Follow Vercel's DNS configuration instructions
3. **SSL Certificate**: Vercel automatically provides SSL

## Troubleshooting

### Common Issues

#### 1. Build Failures
- **Check Environment Variables**: Ensure all required env vars are set
- **Check API Keys**: Verify API keys are valid and have credits
- **Check Logs**: Review build logs for specific errors

#### 2. Runtime Errors
- **API Configuration**: Verify API endpoints are accessible
- **Environment Variables**: Check if env vars are properly set
- **Function Timeouts**: API routes may need longer timeout settings

#### 3. Performance Issues
- **Cold Starts**: First request may be slow
- **API Rate Limits**: Check your API provider's rate limits
- **Memory Usage**: Monitor function memory usage

### Debug Mode

To enable debug logging in production, add this environment variable:
```
DEBUG=true
```

## Monitoring

### Vercel Analytics
1. **Enable Analytics**: In project settings
2. **Monitor Performance**: Check Core Web Vitals
3. **Error Tracking**: Monitor function errors

### API Monitoring
1. **OpenRouter Dashboard**: Monitor API usage and costs
2. **SiliconFlow Dashboard**: Monitor embedding usage
3. **Vercel Functions**: Monitor function execution times

## Security Considerations

1. **Environment Variables**: Never commit API keys to git
2. **CORS**: Configure CORS if needed
3. **Rate Limiting**: Implement rate limiting for production
4. **HTTPS**: Vercel automatically provides SSL

## Cost Optimization

1. **API Usage**: Monitor OpenRouter and SiliconFlow usage
2. **Function Optimization**: Optimize API routes for faster execution
3. **Caching**: Implement caching where appropriate
4. **CDN**: Vercel provides global CDN automatically

## Updates and Maintenance

### Automatic Updates
- **GitHub Integration**: Push to main branch triggers automatic deployment
- **Preview Deployments**: Pull requests create preview deployments

### Manual Updates
1. **Redeploy**: Click "Redeploy" in Vercel dashboard
2. **Rollback**: Use Vercel's rollback feature if needed

## Support

### Vercel Support
- **Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

### Application Support
- **Issues**: Create issues in the GitHub repository
- **Documentation**: Check README.md and SETUP.md

---

**Important**: Remember to set up your environment variables in Vercel before the first deployment. The application will not work without the required API keys. 