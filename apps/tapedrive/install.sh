#!/bin/bash

# Tapedrive Node - Host Dependencies Installation
# This script only installs system-level dependencies
# The actual node runs inside Docker containers

set -e

echo "=========================================="
echo "Tapedrive Node - Installing Dependencies"
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

# Optional: Check if Solana CLI is installed (for keypair generation)
if ! command -v solana-keygen &> /dev/null; then
    echo "ℹ️  Solana CLI not found (optional)"
    echo ""
    echo "   To generate a miner keypair, install Solana CLI:"
    echo "   sh -c \"\$(curl -sSfL https://release.solana.com/stable/install)\""
    echo ""
    echo "   Or use an existing keypair by placing it at:"
    echo "   $(pwd)/deploy/miner.json"
    echo ""
else
    echo "✓ Solana CLI found"
fi

echo "=========================================="
echo "Dependencies installation complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Generate or provide a miner.json keypair"
echo "2. Fund your miner address on DEVNET"
echo "3. Install the app via DePIN App Store"
echo ""
echo "See docs.md for detailed instructions"
echo ""
