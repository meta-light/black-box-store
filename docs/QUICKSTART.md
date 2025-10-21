# Quick Start Guide

Get the DePIN App Store running in 5 minutes!

## Prerequisites

- Ubuntu 20.04+ machine
- sudo/root access
- Internet connection

## Installation

### 1. Download the Project

```bash
# If using git
git clone <repository-url>
cd depin-app-store

# Or if you have the archive
tar -xzf depin-app-store.tar.gz
cd depin-app-store
```

### 2. Run the Installer

```bash
sudo bash install.sh
```

This will:
- ✅ Install Node.js 20.x
- ✅ Install Docker & Docker Compose
- ✅ Install the DePIN App Store
- ✅ Create a systemd service
- ✅ Start the application

Installation takes about 5-10 minutes.

### 3. Access the App Store

Open your browser and navigate to:
```
http://localhost:3000
```

## First Steps

### Upload Your First App

1. Click **"Upload App"**
2. Fill in the form:
   - Name: `Test Node`
   - Company: `My Company`
   - Description: `A test DePIN node`
   - Version: `1.0.0`
   - Category: `Storage`
3. Upload a `docker-compose.yml` file (use `examples/sample-app-compose.yml` for testing)
4. Click **"Upload App"**

### Install an App

1. Find your app in the list
2. Click **"Install"**
3. Wait for installation to complete
4. Status will change to "Running" with a green indicator

### Manage Apps

- **Stop**: Click "Stop" to pause a running app
- **Start**: Click "Start" to resume a stopped app
- **View Logs**: Click "View Logs" to see container output
- **Uninstall**: Click "Uninstall" to remove the app and its containers

## Testing with the Sample App

```bash
# Use the provided sample
cd examples
cp sample-app-compose.yml ../my-test-app.yml
cd ..

# Upload via the web interface
# Then install it
```

After installation, the sample app will be accessible at `http://localhost:8080`

## Common Commands

```bash
# Check service status
sudo systemctl status depin-app-store

# View logs
sudo journalctl -u depin-app-store -f

# Restart service
sudo systemctl restart depin-app-store

# Stop service
sudo systemctl stop depin-app-store

# Start service
sudo systemctl start depin-app-store
```

## Development Mode

To run in development mode (for testing/development):

```bash
# Install dependencies
npm install

# Run in dev mode
npm run dev
```

Access at `http://localhost:3000`

## Troubleshooting

### Service won't start

```bash
# Check logs for errors
sudo journalctl -u depin-app-store -n 50

# Try starting manually
cd /opt/depin-app-store
npm start
```

### Docker not found

```bash
# Install Docker manually
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in
```

### Port 3000 already in use

```bash
# Find what's using the port
sudo lsof -i :3000

# Change the port
sudo systemctl edit depin-app-store
```

Add:
```ini
[Service]
Environment=PORT=8080
```

Then restart:
```bash
sudo systemctl daemon-reload
sudo systemctl restart depin-app-store
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Explore [examples/](examples/) for sample Docker Compose files

## Support

Having issues? Check:
1. Service logs: `sudo journalctl -u depin-app-store -f`
2. Docker status: `sudo systemctl status docker`
3. Port availability: `sudo lsof -i :3000`
4. Disk space: `df -h`

## Uninstall

To remove the DePIN App Store:

```bash
sudo systemctl stop depin-app-store
sudo systemctl disable depin-app-store
sudo rm /etc/systemd/system/depin-app-store.service
sudo rm -rf /opt/depin-app-store
sudo systemctl daemon-reload
```

---

**That's it! You're ready to manage your DePIN nodes.** 🚀

