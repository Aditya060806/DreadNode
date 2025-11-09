# Dreadnode - AI-Powered Cybersecurity Simulation Platform

## Project info

**URL**: https://lovable.dev/projects/b5733976-d773-436a-97b4-8b6c81769164

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b5733976-d773-436a-97b4-8b6c81769164) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Gemini AI Integration

This project uses Google's Gemini AI for advanced threat intelligence, automated defense, and pattern analysis.

### Setup Gemini API Key

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env` file in the root directory:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
3. Restart the development server

### Features Enabled with Gemini

- **Threat Intelligence**: Real-time analysis of attack patterns and log analysis
- **Automated Defense**: AI-powered automatic defense responses using function calling
- **Pattern Matching**: Embedding-based anomaly detection and pattern recognition
- **Forensic Analysis**: AI-enhanced attack timeline and evidence collection

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Google Gemini AI (@google/generative-ai)
- Zustand (State Management)
- Framer Motion (Animations)

## How can I deploy this project?

### Deploy to Vercel (Recommended)

**Option 1: Using Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Option 2: Using GitHub Integration**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

**Option 3: Using Vercel Dashboard**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Connect your Git repository
3. Vercel will auto-detect Vite configuration
4. Click "Deploy"

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Other Deployment Options

- **Netlify**: Similar to Vercel, just connect your Git repo
- **GitHub Pages**: Requires additional configuration for SPA routing
- **Lovable**: Simply open [Lovable](https://lovable.dev/projects/b5733976-d773-436a-97b4-8b6c81769164) and click on Share -> Publish

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
