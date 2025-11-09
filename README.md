# 🛡️ Dreadnode - AI-Powered Cybersecurity Simulation Platform

<div align="center">

![Dreadnode](https://img.shields.io/badge/Dreadnode-Cybersecurity-00ffff?style=for-the-badge&logo=shield&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Real-time AI-driven cybersecurity simulation with self-healing networks, automated defense, and threat intelligence**

[🌐 Live Demo](#) • [📖 Documentation](#features) • [🚀 Deployment](#deployment) • [💻 Dev Bhoomi Hackathon](#-dev-bhoomi-hackathon)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [🎮 Usage](#-usage)
- [🏗️ Project Structure](#️-project-structure)
- [🚀 Deployment](#-deployment)
- [📊 Key Metrics](#-key-metrics)
- [🎯 Hackathon Highlights](#-hackathon-highlights)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Team](#-team)

---

## 🎯 Overview

**Dreadnode** is an advanced cybersecurity simulation platform that demonstrates real-world network defense mechanisms through an interactive, AI-powered visualization system. The platform simulates various cyber attacks, automated defense responses, and self-healing network capabilities, making it an ideal tool for cybersecurity education, training, and demonstration.

### Key Highlights

- 🔄 **Self-Healing Networks**: Automatic recovery and redundancy systems
- 🤖 **AI-Powered Defense**: Local threat intelligence without external API dependencies
- 🎨 **Interactive Visualization**: Real-time 3D network topology with attack vectors
- 📊 **Comprehensive Analytics**: Threat intelligence, forensics, and performance metrics
- 🔒 **Zero External Dependencies**: Fully functional offline with local processing

---

## ✨ Features

### 🛡️ Advanced Defense Mechanisms

- **Adaptive Firewalls**: Intelligent firewalls that learn from attacks and auto-repair
- **Honeypot Networks**: Decoy systems to trap and analyze attackers
- **Quarantine Zones**: Isolated recovery areas for compromised nodes
- **Cascading Defenses**: Multi-layer protection with automatic escalation

### 🔄 Recovery Systems

- **Progressive Healing**: Multi-stage recovery (Critical → Healing → Stable → Healthy)
- **Auto-Firewall Recovery**: Firewalls automatically repair when damaged
- **Backup Node Activation**: Automatic redundancy when primary nodes fail
- **Self-Healing Networks**: Automatic network path restoration

### 🧠 Local Threat Intelligence

- **Pattern Recognition**: Local ML-based attack pattern detection
- **Signature Database**: Built-in attack signature library
- **Anomaly Detection**: Statistical anomaly detection without external APIs
- **Threat Scoring**: Real-time threat level calculation
- **Attack Prediction**: AI-powered attack probability forecasting

### 📊 Analytics & Monitoring

- **Real-time Dashboards**: System health, threat levels, and performance metrics
- **Attack History**: Complete attack timeline with forensic analysis
- **Recovery Metrics**: Healing success rates and recovery time tracking
- **Threat Intelligence Panel**: Detailed threat analysis and recommendations
- **Forensics Panel**: Digital forensics analysis with evidence collection

### 🎨 Visual Features

- **Interactive Network Graph**: Web-like mesh network with thin wire connections
- **Attack Visualization**: Real-time attack vectors and data flow
- **Recovery Animations**: Visual healing progress and firewall repair
- **Threat Heatmaps**: Color-coded threat levels across the network
- **3D Network Topology**: Immersive network visualization (React Three Fiber)

### 🎮 Simulation Modes

- **Demo Mode**: Automated attack simulation for demonstrations
- **Manual Mode**: Full control over attacks and defenses
- **Chaos Mode**: Single, multi-vector, or cascading attacks
- **Custom Scenarios**: Create and test custom attack patterns

### 🔍 Attack Types Supported

- **DDoS Attacks**: Distributed Denial of Service
- **AI Corruption**: Machine learning model poisoning
- **Node Overload**: Resource exhaustion attacks
- **Web3 Congestion**: Blockchain network attacks
- **Memory Leaks**: Resource depletion attacks
- **CPU Spikes**: Computational resource attacks
- **Network Partition**: Network isolation attacks
- **Data Corruption**: Data integrity attacks
- **DNS Poisoning**: Domain name system attacks
- **Insider Exploits**: Internal threat simulation
- **Zero-Day Exploits**: Unknown vulnerability attacks

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript 5.5** - Type safety
- **Vite 5.4** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Three Fiber** - 3D visualization
- **Zustand** - State management
- **shadcn/ui** - UI component library

### Backend/Logic
- **Local ML Processing** - Pattern recognition and anomaly detection
- **State Management** - Zustand for reactive state
- **Real-time Simulation** - Event-driven architecture

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Git** - Version control

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/Aditya060806/DreadNode.git

# Navigate to project directory
cd DreadNode

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8089`

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

---

## 🎮 Usage

### Basic Operation

1. **Start Simulation**: Click the play button to start the simulation
2. **Simulate Attacks**: Use the control panel to trigger various attack types
3. **Monitor Defense**: Watch automated defenses respond in real-time
4. **View Analytics**: Check threat intelligence, forensics, and metrics panels
5. **Control Recovery**: Manually trigger healing or let automated systems handle it

### Control Panel Features

- **Attack Simulation**: Select attack type and trigger
- **Multi-Vector Attacks**: Simulate coordinated attacks
- **Speed Control**: Adjust simulation speed
- **Demo Mode**: Automated demonstration mode
- **Pause/Resume**: Control simulation state

### Panels & Dashboards

- **Status Display**: Overall system health and threat level
- **Monitoring Dashboard**: Real-time system metrics
- **Threat Intelligence**: Attack patterns and threat analysis
- **Forensics Panel**: Attack timeline and evidence
- **Historical Analysis**: Performance trends and metrics
- **Recovery System Status**: Healing and firewall repair status

---

## 🏗️ Project Structure

```
DreadNode/
├── src/
│   ├── components/          # React components
│   │   ├── DreadNode.tsx   # Main container
│   │   ├── NeuralNode.tsx  # Network node component
│   │   ├── NeuralPathway.tsx # Connection lines
│   │   ├── ControlPanel.tsx # Attack controls
│   │   ├── MonitoringDashboard.tsx # Metrics
│   │   ├── ThreatIntelligencePanel.tsx # Threat analysis
│   │   ├── ForensicsPanel.tsx # Attack forensics
│   │   └── ui/             # shadcn/ui components
│   ├── store/              # State management
│   │   └── simulationStore.ts # Main state store
│   ├── services/           # Business logic
│   │   ├── threatIntelligence.ts # Threat analysis
│   │   ├── automatedDefense.ts # Defense automation
│   │   └── patternMatching.ts # Pattern detection
│   ├── types/              # TypeScript types
│   │   ├── forensics.ts    # Forensic types
│   │   └── communication.ts # Communication types
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets
├── vercel.json            # Vercel configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

#### Option 1: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy" (auto-detects Vite configuration)

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### Option 3: Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Connect your Git repository
3. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click "Deploy"

### Other Deployment Options

- **Netlify**: Similar to Vercel, connect Git repo
- **GitHub Pages**: Requires additional SPA routing configuration
- **Docker**: Containerize and deploy anywhere

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

---

## 📊 Key Metrics

The platform tracks and displays:

- **System Health**: Overall network health percentage
- **Recovery Time**: Average time to recover from attacks
- **Firewall Effectiveness**: Success rate of firewall blocks
- **Network Uptime**: Percentage of time network is operational
- **Attack Mitigation**: Percentage of attacks successfully defended
- **Resource Efficiency**: Optimal use of system resources
- **Threat Level**: Real-time global threat assessment
- **Node Status**: Individual node health and status

---

## 🎯 Hackathon Highlights

### Dev Bhoomi Hackathon Features

This project addresses key hackathon themes:

1. **Real-World Cybersecurity**: Simulates actual attack scenarios and defense mechanisms
2. **AI-Driven Defense**: Local AI-powered threat detection and automated responses
3. **Automation**: Fully automated defense systems with minimal human intervention
4. **Digital Forensics**: Comprehensive attack analysis and evidence collection
5. **Threat Intelligence**: Real-time threat detection and pattern recognition
6. **Secure Communication**: Encrypted communication channels between nodes

### Innovative Aspects

- ✅ **Zero API Dependencies**: Works completely offline
- ✅ **Self-Healing Architecture**: Automatic recovery and redundancy
- ✅ **Interactive Visualization**: Real-time 3D network visualization
- ✅ **Comprehensive Analytics**: Threat intelligence and forensics
- ✅ **Production-Ready**: Optimized build and deployment configuration

---

## 🎨 Screenshots

> **Note**: Add screenshots of your application here
> - Network visualization
> - Attack simulation
> - Threat intelligence panel
> - Forensics dashboard
> - Recovery system

---

## 🔧 Configuration

### Environment Variables (Optional)

The project works without any environment variables. However, if you want to enable Gemini API features (currently disabled):

1. Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

2. Restart the development server

**Note**: All features work with local intelligence - no API key required!

### Customization

- **Network Layout**: Modify node positions in `src/store/simulationStore.ts`
- **Attack Types**: Add new attack types in the simulation store
- **Defense Strategies**: Customize defense logic in `src/services/automatedDefense.ts`
- **UI Theme**: Customize Tailwind CSS in `tailwind.config.ts`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint for code quality
- Write descriptive commit messages
- Update documentation for new features
- Test thoroughly before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Dreadnode Team**

- **Aditya Pandey** - [GitHub](https://github.com/Aditya060806)

### Acknowledgments

- Built for **Dev Bhoomi Hackathon**
- Inspired by real-world cybersecurity challenges
- Uses modern web technologies for maximum performance

---

## 🔗 Links

- **GitHub Repository**: [https://github.com/Aditya060806/DreadNode](https://github.com/Aditya060806/DreadNode)
- **Live Demo**: [Deploy to Vercel for live URL](#)
- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Project Improvements**: [PROJECT_IMPROVEMENTS.md](./PROJECT_IMPROVEMENTS.md)

---

## 📈 Roadmap

- [ ] Multi-player defense mode
- [ ] Attack scenario challenges
- [ ] Real-world threat feed integration
- [ ] Advanced 3D visualization mode
- [ ] Export attack reports as PDF
- [ ] Voice commands for controls
- [ ] Mobile-responsive dashboard
- [ ] Custom attack scenario builder

See [PROJECT_IMPROVEMENTS.md](./PROJECT_IMPROVEMENTS.md) for detailed roadmap.

---

## 🐛 Known Issues

- None currently reported

If you find any issues, please [open an issue](https://github.com/Aditya060806/DreadNode/issues) on GitHub.

---

## 💡 Tips for Hackathon Judges

1. **Start Demo Mode**: Click "Demo Mode" to see automated attack simulation
2. **Trigger Attacks**: Use the control panel to simulate various attack types
3. **Watch Automated Defense**: Observe how the system automatically responds
4. **Check Analytics**: View threat intelligence and forensics panels
5. **Monitor Recovery**: Watch nodes heal and firewalls repair automatically

---

<div align="center">

**Built with ❤️ for Dev Bhoomi Hackathon**

[⭐ Star this repo](https://github.com/Aditya060806/DreadNode) • [🐛 Report Bug](https://github.com/Aditya060806/DreadNode/issues) • [💡 Request Feature](https://github.com/Aditya060806/DreadNode/issues)

</div>
