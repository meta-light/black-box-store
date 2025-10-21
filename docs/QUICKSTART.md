# Quick Start Guide - Dawn Black Box Store

Get up and running in 5 minutes! 🚀

## Prerequisites Check

Before installing, verify you have these installed:

```bash
# Check Node.js (need v18+)
node --version

# Check Docker
docker --version

# Check Git
git --version
```

Don't have them? Install:
- **Node.js**: https://nodejs.org/
- **Docker**: https://www.docker.com/products/docker-desktop
- **Git**: https://git-scm.com/

## Installation

### One-Line Install

```bash
curl -fsSL https://raw.githubusercontent.com/meta-light/black-box-store/main/install.sh | bash
```

### Or Manual Install

```bash
git clone https://github.com/meta-light/black-box-store.git
cd black-box-store
bash install.sh
```

### Post-Install

Reload your shell configuration:

```bash
# macOS (zsh)
source ~/.zshrc

# Linux or macOS (bash)
source ~/.bashrc
```

## Usage

### Start the Black Box Store

```bash
dbb-store
```

That's it! The web interface will open automatically at `http://localhost:3456`

### Managing Apps

In the web interface:

1. **Browse** available DePIN apps
2. **Install** any app with one click
3. **Start/Stop** apps as needed
4. **View Logs** to monitor apps
5. **Uninstall** when done

### Stop the Server

Press `Ctrl+C` in the terminal where `dbb-store-store` is running.

## Common Commands

```bash
# Start the Black Box Store
dbb-store-store

# Update to latest version
cd ~/.black-box-store
git pull
npm install
npm run build

# Check Docker status
docker info

# View running containers
docker ps
```

## Troubleshooting

### Command not found: dbb-store

```bash
# Add to PATH manually
echo 'export PATH="$HOME/.black-box-store/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Docker not running

**macOS**: Open Docker Desktop from Applications

**Linux**:
```bash
sudo systemctl start docker
```

### Port 3456 already in use

Edit `~/.black-box-store/bin/dbb-store` and change the `PORT` variable to a different port.

## What Gets Installed?

- Repository cloned to `~/.black-box-store`
- CLI command `dbb-store` added to your PATH
- All dependencies installed automatically

## Next Steps

- 📚 [Read full documentation](https://github.com/meta-light/black-box-store/blob/main/README.md)
- 🛠️ [Learn how to add apps](https://github.com/meta-light/black-box-store/blob/main/docs/ADDING_APPS.md)
- 🛒 [Get Dawn Black Box hardware](https://shop.dawninternet.com/)

## Need Help?

- [Open an issue](https://github.com/meta-light/black-box-store/issues)
- [View documentation](https://github.com/meta-light/black-box-store/tree/main/docs)

---

Happy node running! 🎉