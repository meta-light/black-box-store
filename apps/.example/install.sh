#!/bin/bash

# Example DePIN Node - Host Dependencies Installation
# This script only installs system-level dependencies
# The actual node runs inside Docker containers via docker-compose.yaml

set -e

echo "=========================================="
echo "Example DePIN Node - Installing Dependencies"
echo "=========================================="
echo ""

# Update package lists
echo "Updating package lists..."
apt-get update -qq

# Install required system packages
echo "Installing required packages..."
apt-get install -y \
    curl \
    wget \
    ca-certificates \
    git \
    && rm -rf /var/lib/apt/lists/*

echo ""
echo "✓ System dependencies installed"
echo ""

# Optional: Create any necessary host directories
# mkdir -p /data/your-app

# Optional: Download configuration files
# curl -o config.json https://your-project.com/config.json

# Optional: Check for required environment variables
# if [ -z "$YOUR_API_KEY" ]; then
#     echo "⚠️  Warning: YOUR_API_KEY environment variable is not set"
#     echo "   Set it before starting the node"
# fi

# Optional: Verify system requirements
# MIN_DISK_GB=10
# AVAILABLE_DISK=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')
# if [ "$AVAILABLE_DISK" -lt "$MIN_DISK_GB" ]; then
#     echo "⚠️  Warning: Low disk space. Have ${AVAILABLE_DISK}GB, need ${MIN_DISK_GB}GB+"
# fi

echo "=========================================="
echo "Dependencies installation complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Configure any required settings or API keys"
echo "2. Install the app via DePIN App Store"
echo "3. Monitor logs to verify successful startup"
echo ""
echo "See docs.md for detailed instructions"
echo ""
