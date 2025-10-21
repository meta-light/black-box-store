# Pipe Network Configuration Template

Before installing the Pipe Network node, create a `.env` file in this directory with the following content:

```bash
# Wallet for earnings (REQUIRED)
NODE_SOLANA_PUBLIC_KEY=your_solana_wallet_address_here

# Node identity
NODE_NAME=my-pop-node
NODE_EMAIL=operator@example.com
NODE_LOCATION=San Francisco, USA

# Cache configuration
MEMORY_CACHE_SIZE_MB=512
DISK_CACHE_SIZE_GB=100
DISK_CACHE_PATH=./cache

# Network ports (do not change if using docker-compose)
HTTP_PORT=80
HTTPS_PORT=443

# Home network auto port forwarding
# Set to false for VPS/cloud servers
# Set to true for home setups (requires router UPnP support)
UPNP_ENABLED=false

# Optional: Performance tuning
# TOKIO_WORKER_THREADS=16
# MEMORY_CACHE_SIZE_MB=8192
# DISK_CACHE_SIZE_GB=500
```

## Quick Start

1. Create `.env` file:
   ```bash
   cd apps/pipe-network
   nano .env
   ```

2. Copy the template above and fill in:
   - `NODE_SOLANA_PUBLIC_KEY`: Your Solana wallet address (get from Phantom wallet or `solana address`)
   - `NODE_NAME`: A unique name for your node
   - `NODE_EMAIL`: Your contact email
   - `NODE_LOCATION`: Your node's location

3. Save and install via DePIN App Store

## Getting a Solana Wallet

**Option 1: Phantom Wallet**
1. Install Phantom browser extension
2. Create a new wallet
3. Copy your public address

**Option 2: Solana CLI**
```bash
solana-keygen new
solana address
```

Copy the public key (44 characters, alphanumeric).

⚠️ **Never share your private key or seed phrase!**

## Important Notes

- The `.env` file must exist before starting the node
- Without a valid Solana wallet address, you won't earn rewards
- For VPS/cloud servers, keep `UPNP_ENABLED=false`
- Ensure you have at least 20GB free disk space for cache

