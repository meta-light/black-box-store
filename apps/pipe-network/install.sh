#!/bin/bash

# Pipe Network Node - Host Dependencies Installation
# This script only installs system-level dependencies
# The actual node runs inside Docker containers

set -e

echo "=========================================="
echo "Pipe Network - Installing Dependencies"
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
    && rm -rf /var/lib/apt/lists/*

echo ""
echo "✓ System dependencies installed"
echo ""
echo "=========================================="
echo "Dependencies installation complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Create a .env file with your Solana wallet address"
echo "2. Configure node settings (name, location, cache size)"
echo "3. Install the app via DePIN App Store"
echo ""
echo "See docs.md for detailed configuration instructions"
echo ""
