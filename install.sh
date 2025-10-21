#!/bin/bash

set -e
echo "========================================"
echo "DePIN App Store Installer"
echo "========================================"
echo ""

if [ ! -f /etc/lsb-release ]; then
    echo "Error: This script is designed for Ubuntu systems"
    exit 1
fi

if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

echo "Installing system dependencies..."

apt-get update

if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "Node.js already installed"
fi

if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    apt-get install -y ca-certificates curl gnupg
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
else
    echo "Docker already installed"
fi

systemctl start docker
systemctl enable docker

if [ -n "$SUDO_USER" ]; then
    usermod -aG docker $SUDO_USER
    echo "Added $SUDO_USER to docker group"
fi

INSTALL_DIR="/opt/depin-app-store"

mkdir -p $INSTALL_DIR

echo "Installing DePIN App Store..."
cp -r ./* $INSTALL_DIR/

chown -R ${SUDO_USER:-root}:${SUDO_USER:-root} $INSTALL_DIR

cd $INSTALL_DIR
echo "Installing Node.js dependencies..."
npm install

echo "Building application..."
npm run build

echo "Creating systemd service..."
cat > /etc/systemd/system/depin-app-store.service << EOF
[Unit]
Description=DePIN App Store
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=${SUDO_USER:-root}
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable depin-app-store
systemctl start depin-app-store

echo ""
echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "The DePIN App Store is now running on http://localhost:3000"
echo ""
echo "Commands:"
echo "  Start:   sudo systemctl start depin-app-store"
echo "  Stop:    sudo systemctl stop depin-app-store"
echo "  Restart: sudo systemctl restart depin-app-store"
echo "  Status:  sudo systemctl status depin-app-store"
echo "  Logs:    sudo journalctl -u depin-app-store -f"
echo ""
echo "Note: If you added a user to the docker group, they need to log out and back in."
echo ""