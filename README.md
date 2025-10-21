# DePIN App Store

A modern, self-hosted application store for managing DePIN (Decentralized Physical Infrastructure Network) nodes on Ubuntu machines. Upload Docker Compose files and manage your infrastructure nodes through a beautiful web interface.

## Features

- 🚀 **Easy Installation**: One-command installation on Ubuntu
- 📦 **Pre-configured Apps**: DePIN node applications pre-defined in the repository
- 🐳 **Docker Compose Integration**: Automatically manage Docker containers
- 🎨 **Modern UI**: Beautiful, responsive web interface built with Next.js and Tailwind CSS
- 📊 **Real-time Status**: Monitor running/stopped apps with network status indicators
- 📝 **Container Logs**: View logs directly from the web interface
- 🔄 **Lifecycle Management**: Start, stop, install, and uninstall apps with one click
- 📖 **Documentation Links**: Direct access to each app's documentation

## Prerequisites

- Ubuntu 20.04 or later
- Root/sudo access
- Internet connection

## Installation

### Quick Install (Recommended)

1. Clone or download this repository to your Ubuntu machine:
```bash
git clone <repository-url>
cd depin-app-store
```

2. Run the installation script:
```bash
sudo bash install.sh
```

The script will:
- Install Node.js 20.x
- Install Docker and Docker Compose
- Set up the DePIN App Store
- Create a systemd service
- Start the application

3. Access the app store at `http://localhost:3000`

### Manual Installation

If you prefer to install manually:

1. **Install Node.js 20.x:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install Docker:**
```bash
# Add Docker's official GPG key
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

3. **Set up the application:**
```bash
cd depin-app-store
npm install
npm run build
npm start
```

## Usage

### Accessing the App Store

Open your web browser and navigate to:
```
http://localhost:3000
```

### Adding New Apps to the Store

Apps are defined in the `apps/` directory. Each app has its own folder with:
- `info.ts` - App metadata
- `docker-compose.yaml` - Docker Compose configuration
- `docs.md` - Documentation
- `install.sh` - Installation script

To add a new app:
1. Create a new folder in `apps/` with your app name (lowercase, no spaces)
2. Create the required files following the structure of existing apps
3. Commit and push to the repository

### Installing an App

1. Browse available apps
2. Click **"Install"** on the app you want
3. Wait for the installation to complete
4. The app status will change to "Running"

### Managing Apps

- **Install**: Install an available app
- **Start**: Start a stopped app
- **Stop**: Stop a running app
- **Uninstall**: Remove the app and its containers
- **View Logs**: View container logs in real-time
- **Documentation**: Access the app's official documentation

### System Commands

Control the DePIN App Store service:

```bash
# Start the service
sudo systemctl start depin-app-store

# Stop the service
sudo systemctl stop depin-app-store

# Restart the service
sudo systemctl restart depin-app-store

# Check status
sudo systemctl status depin-app-store

# View logs
sudo journalctl -u depin-app-store -f
```

## Adding a New DePIN App

### App Directory Structure

Create a new directory in `apps/` with this structure:

```
apps/your-app-name/
├── info.ts                 # App metadata
├── docker-compose.yaml     # Docker Compose configuration
├── docs.md                 # Documentation
└── install.sh              # Installation script
```

### info.ts Template

```typescript
import { Info } from "../interface";

export const info: Info = {
    name: "Your App Name",
    description: "Description of your DePIN node",
    company: "Your Company",
    version: "1.0.0",
    category: "Storage|Network|Compute|IoT|Other",
    dockerComposeFile: "docker-compose.yaml",
    docs: "https://your-docs-url.com",
    icon: "https://your-icon-url.com/icon.png",
    requirements: {
        minMemoryGb: "2",
        minCpu: "1",
        minDiskGb: "10"
    },
    status: "mainnet" // or "testnet" or "devnet"
}
```

### docker-compose.yaml Example

```yaml
version: '3.8'

services:
  your-service:
    image: your-image:latest
    ports:
      - "8080:8080"
    volumes:
      - ./data:/data
    environment:
      - ENV_VAR=value
    restart: unless-stopped
```

## Architecture

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Storage**: JSON file-based storage (easily replaceable with a database)
- **Container Management**: Docker Compose CLI
- **Runtime**: Node.js 20+

### Project Structure

```
depin-app-store/
├── app/
│   ├── api/
│   │   └── apps/              # API routes
│   │       ├── route.ts       # List apps
│   │       └── [id]/          # App-specific routes
│   ├── layout.tsx
│   └── page.tsx               # Main UI
├── apps/                      # Pre-defined DePIN apps (in repo)
│   ├── interface.ts           # App info interface
│   ├── pipe-network/          # Example app
│   └── tapedrive/             # Example app
├── components/
│   └── AppCard.tsx            # App card component
├── lib/
│   ├── docker.ts              # Docker Compose integration
│   └── storage.ts             # Data persistence
├── types/
│   └── index.ts               # TypeScript definitions
├── docs/                      # Documentation
│   └── ADDING_APPS.md         # Guide for adding apps
├── data/                      # Runtime data (auto-created)
│   └── installations.json     # Installation records
├── install.sh                 # Ubuntu installation script
└── README.md                  # This file
```

## Data Storage

Apps are defined in the `apps/` directory (version controlled):
- Each app has its own folder with metadata and compose files
- Apps are loaded at runtime from the filesystem

Runtime data is stored in the `data/` directory:
- `installations.json`: Installation records and status

## Security Considerations

⚠️ **Important Security Notes:**

1. This application runs on localhost by default
2. Docker socket access is required (high privilege)
3. Uploaded Docker Compose files are executed with host Docker privileges
4. This is intended for private, trusted environments
5. For production use, consider:
   - Adding authentication
   - Implementing input validation and sanitization
   - Running behind a reverse proxy
   - Implementing resource limits
   - Adding network isolation

## Development

To run in development mode:

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

## Troubleshooting

### Service won't start
```bash
# Check logs
sudo journalctl -u depin-app-store -n 50

# Check if port 3000 is already in use
sudo lsof -i :3000
```

### Docker permission issues
```bash
# Ensure user is in docker group
sudo usermod -aG docker $USER

# Log out and back in for changes to take effect
```

### App installation fails
```bash
# Check Docker is running
sudo systemctl status docker

# Check Docker Compose is installed
docker compose version

# View app store logs
sudo journalctl -u depin-app-store -f
```

## Uninstallation

To remove the DePIN App Store:

```bash
# Stop and disable the service
sudo systemctl stop depin-app-store
sudo systemctl disable depin-app-store

# Remove the service file
sudo rm /etc/systemd/system/depin-app-store.service
sudo systemctl daemon-reload

# Remove the installation directory
sudo rm -rf /opt/depin-app-store
```

## API Documentation

### List All Apps
```
GET /api/apps
```
Returns all apps defined in the `apps/` directory with their current status.

### Get App Details
```
GET /api/apps/[id]
```
Returns detailed information about a specific app.

### Install App
```
POST /api/apps/[id]/install
```
Installs an app using Docker Compose.

### Uninstall App
```
POST /api/apps/[id]/uninstall
```
Uninstalls an app and removes its containers.

### Start App
```
POST /api/apps/[id]/start
```
Starts a stopped app.

### Stop App
```
POST /api/apps/[id]/stop
```
Stops a running app.

### Get Logs
```
GET /api/apps/[id]/logs?tail=100
```
Retrieves container logs for an installed app.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the project repository.
