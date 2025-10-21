# Pipe Network CDN Node

A quick guide to get your Pipe Network POP (Point of Presence) node online and ready for mainnet.

## Prerequisites

⚠️ **BEFORE INSTALLING**: You must create a `.env` file with your configuration.

### Quick Setup

1. **Get a Solana Wallet** (if you don't have one):
   - Install [Phantom Wallet](https://phantom.app/) browser extension, or
   - Use Solana CLI: `solana-keygen new` then `solana address`

2. **Create `.env` file** in `apps/pipe-network/` directory:

```bash
# Required: Your Solana wallet for earning rewards
NODE_SOLANA_PUBLIC_KEY=your_solana_wallet_address

# Node identity
NODE_NAME=my-pop-node
NODE_EMAIL=operator@example.com
NODE_LOCATION=San Francisco, USA

# Cache settings
MEMORY_CACHE_SIZE_MB=512
DISK_CACHE_SIZE_GB=100
DISK_CACHE_PATH=./cache
HTTP_PORT=80
HTTPS_PORT=443
UPNP_ENABLED=false
```

See [ENV_TEMPLATE.md](ENV_TEMPLATE.md) for full configuration options.

3. **Install via DePIN App Store**: Once your `.env` is ready, install the app from the app store interface.

---

## 1. Requirements

### Supported OS
- Ubuntu 24.04+ or Debian 11+

### Network
- Open TCP ports: 80 and 443
- Stable internet connection

### Storage
- At least 20 GB free space
- SSD/NVMe recommended for cache

---

## 2. Installation via DePIN App Store

The installation is automated through Docker. The system will:
1. Download the latest Pipe POP binary
2. Configure the node with your `.env` settings
3. Start the CDN node automatically

No manual installation needed!

---

## 3. Configuration Details

Your `.env` file should contain:

# Wallet for earnings
NODE_SOLANA_PUBLIC_KEY=your_solana_wallet_address

# Node identity
NODE_NAME=my-pop-node
NODE_EMAIL="operator@example.com"
NODE_LOCATION="San Francisco, USA"

# Cache configuration
MEMORY_CACHE_SIZE_MB=512
DISK_CACHE_SIZE_GB=100
DISK_CACHE_PATH=./cache

# Network ports
HTTP_PORT=80
HTTPS_PORT=443

# Home network auto port forwarding (disable on VPS/servers)
UPNP_ENABLED=true
💡 Tip: If you run on a VPS, keep UPNP_ENABLED=false. For home setups, enable it and make sure your router allows UPnP.

4. Wallet Setup
If you don’t have a Solana wallet yet:

Install Phantom Wallet, or

Use Solana CLI:

solana-keygen new
solana address
Copy your public key (44 chars, starts with letters/numbers). Paste it into .env as NODE_SOLANA_PUBLIC_KEY.

⚠️ Never share your private key or seed phrase.

5. Run the Node
Choose one of the options below to start your node — pick the method that fits your setup.

Option 1 — Manual Run
Ideal for quick testing or temporary sessions.

source .env && ./pop
Option 2 — Background Process
Run it detached from the terminal (logs to pop.log).

nohup bash -c "source .env && ./pop" > pop.log 2>&1 &
Option 3 — Systemd Service (Recommended)
Create /etc/systemd/system/pipe.service:

[Unit]
Description=Pipe Network POP Node
After=network-online.target
Wants=network-online.target

[Service]
WorkingDirectory=/opt/pipe
ExecStart=/bin/bash -c 'source /opt/pipe/.env && /opt/pipe/pop'
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
Enable and start:

sudo systemctl daemon-reload
sudo systemctl enable pipe

sudo systemctl start pipe
sudo journalctl -u pipe -f
💡 Tip: Systemd ensures auto-restart on crash and starts automatically at boot.

6. Verification
Check if it's running:

# Health check
curl http://localhost:8081/health
7. Monitoring
View node status and earnings:

cd /opt/pipe

./pop status
./pop earnings
Prometheus metrics:

curl http://localhost:9090/metrics
Logs ( If use Systemd Service):

journalctl -u pipe -f
8. Troubleshooting
Issue	Solution
Port 80/443 in use	sudo lsof -i :80 → kill conflicting process
UPnP failed (home use)	Enable UPnP in router or set UPNP_ENABLED=false
Low disk space	Reduce DISK_CACHE_SIZE_GB in .env
High memory usage	Lower MEMORY_CACHE_SIZE_MB (e.g. 256)
9. Performance Tuning
For high-traffic setups:

# Increase worker threads
export TOKIO_WORKER_THREADS=16

# Larger cache
export MEMORY_CACHE_SIZE_MB=8192
export DISK_CACHE_SIZE_GB=500

# Use SSD/NVMe for cache
export DISK_CACHE_PATH=/mnt/nvme/cache
Use SSD/NVMe for best caching performance.

10. Quick Recap
Download binary -> chmod +x pop
Create .env
Open ports 80 & 443
Run with source .env && ./pop
Verify with /health - the output should return"status":"healthy"
Your node is now part of the PipeCDN mesh and ready to earn $PIPE rewards. 🚀