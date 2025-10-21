# Deployment Guide

This guide covers deploying the DePIN App Store on Ubuntu machines.

## System Requirements

### Minimum Requirements
- **OS**: Ubuntu 20.04 LTS or later
- **CPU**: 2 cores
- **RAM**: 2 GB
- **Disk**: 10 GB free space (plus space for Docker images)
- **Network**: Internet connection for initial setup

### Recommended Requirements
- **OS**: Ubuntu 22.04 LTS
- **CPU**: 4 cores
- **RAM**: 4 GB
- **Disk**: 50 GB+ free space
- **Network**: Stable internet connection

## Deployment Steps

### 1. Prepare the Ubuntu Machine

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install prerequisites
sudo apt-get install -y curl git
```

### 2. Deploy the Application

#### Option A: From Source

```bash
# Clone the repository
git clone <your-repo-url> /tmp/depin-app-store
cd /tmp/depin-app-store

# Run installer
sudo bash install.sh
```

#### Option B: From Archive

```bash
# Upload the archive to the server
scp depin-app-store.tar.gz user@server:/tmp/

# On the server
cd /tmp
tar -xzf depin-app-store.tar.gz
cd depin-app-store
sudo bash install.sh
```

### 3. Verify Installation

```bash
# Check service status
sudo systemctl status depin-app-store

# Check if the service is running
curl http://localhost:3000

# View logs
sudo journalctl -u depin-app-store -n 50
```

## Post-Installation Configuration

### Changing the Port

If you need to run on a different port:

1. Edit the systemd service:
```bash
sudo systemctl edit depin-app-store
```

2. Add the following:
```ini
[Service]
Environment=PORT=8080
```

3. Reload and restart:
```bash
sudo systemctl daemon-reload
sudo systemctl restart depin-app-store
```

### Running Behind a Reverse Proxy

For production deployments, use Nginx or Apache as a reverse proxy.

#### Nginx Example

```bash
# Install Nginx
sudo apt-get install nginx

# Create config
sudo nano /etc/nginx/sites-available/depin-app-store
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/depin-app-store /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Adding SSL/HTTPS

Use Let's Encrypt for free SSL certificates:

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com
```

### Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

## Scaling and Performance

### Resource Limits

You can set resource limits in the systemd service:

```bash
sudo systemctl edit depin-app-store
```

Add:

```ini
[Service]
MemoryLimit=2G
CPUQuota=200%
```

### Monitoring

#### Basic Monitoring

```bash
# Watch service status
watch -n 5 sudo systemctl status depin-app-store

# Monitor logs
sudo journalctl -u depin-app-store -f

# Monitor Docker containers
watch -n 5 docker ps
```

#### Advanced Monitoring

Consider integrating with:
- **Prometheus + Grafana**: For metrics and dashboards
- **Loki**: For log aggregation
- **cAdvisor**: For container metrics

## Backup and Recovery

### Backup Data

```bash
# Create backup directory
sudo mkdir -p /backup/depin-app-store

# Backup data
sudo tar -czf /backup/depin-app-store/backup-$(date +%Y%m%d-%H%M%S).tar.gz \
  /opt/depin-app-store/data/
```

### Automated Backups

Create a cron job:

```bash
sudo crontab -e
```

Add:

```cron
# Backup every day at 2 AM
0 2 * * * tar -czf /backup/depin-app-store/backup-$(date +\%Y\%m\%d-\%H\%M\%S).tar.gz /opt/depin-app-store/data/
```

### Restore from Backup

```bash
# Stop service
sudo systemctl stop depin-app-store

# Restore data
sudo tar -xzf /backup/depin-app-store/backup-YYYYMMDD-HHMMSS.tar.gz -C /

# Start service
sudo systemctl start depin-app-store
```

## Troubleshooting

### Service Fails to Start

```bash
# Check service status
sudo systemctl status depin-app-store

# View detailed logs
sudo journalctl -u depin-app-store -n 100 --no-pager

# Check Node.js installation
node --version
npm --version
```

### Docker Issues

```bash
# Check Docker service
sudo systemctl status docker

# Check Docker permissions
groups $USER

# Test Docker
sudo docker run hello-world
```

### Port Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill process (if safe)
sudo kill -9 <PID>
```

### High Memory Usage

```bash
# Check memory usage
free -h

# Check app memory usage
sudo systemctl status depin-app-store | grep Memory

# Restart service
sudo systemctl restart depin-app-store
```

## Updating the Application

### Update from Git

```bash
# Pull latest changes
cd /opt/depin-app-store
sudo git pull

# Install dependencies
sudo npm install

# Rebuild
sudo npm run build

# Restart service
sudo systemctl restart depin-app-store
```

### Manual Update

```bash
# Stop service
sudo systemctl stop depin-app-store

# Backup current installation
sudo mv /opt/depin-app-store /opt/depin-app-store.backup

# Deploy new version
sudo tar -xzf depin-app-store-new.tar.gz -C /opt/

# Restore data
sudo cp -r /opt/depin-app-store.backup/data /opt/depin-app-store/

# Install dependencies and build
cd /opt/depin-app-store
sudo npm install
sudo npm run build

# Start service
sudo systemctl start depin-app-store
```

## Security Hardening

### 1. Limit Docker Socket Access

Create a dedicated user:

```bash
sudo useradd -r -s /bin/false depin-user
sudo usermod -aG docker depin-user
```

Update systemd service to use this user.

### 2. Enable AppArmor/SELinux

```bash
# Check AppArmor status
sudo aa-status

# Ensure Docker profile is loaded
sudo apparmor_parser -r /etc/apparmor.d/docker
```

### 3. Regular Updates

```bash
# Set up automatic security updates
sudo apt-get install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### 4. Firewall Rules

```bash
# Only allow necessary ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw enable
```

## Multi-Machine Deployment

For deploying to multiple machines:

### 1. Create Deployment Package

```bash
# On development machine
cd depin-app-store
tar -czf depin-app-store.tar.gz --exclude=node_modules --exclude=.next --exclude=data .
```

### 2. Deploy to Multiple Servers

```bash
# Copy to servers
for server in server1 server2 server3; do
    scp depin-app-store.tar.gz user@$server:/tmp/
    ssh user@$server "cd /tmp && tar -xzf depin-app-store.tar.gz && cd depin-app-store && sudo bash install.sh"
done
```

### 3. Use Configuration Management

Consider using:
- **Ansible**: For automated deployment
- **Terraform**: For infrastructure as code
- **Docker Swarm**: For container orchestration
- **Kubernetes**: For advanced orchestration

## Production Checklist

- [ ] Ubuntu system updated
- [ ] Docker installed and configured
- [ ] Node.js installed
- [ ] Application deployed
- [ ] Systemd service running
- [ ] Reverse proxy configured (if needed)
- [ ] SSL certificate installed (if public)
- [ ] Firewall configured
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Resource limits configured
- [ ] Security hardening applied
- [ ] Documentation reviewed
- [ ] Team trained on operations

## Support and Maintenance

### Regular Maintenance Tasks

- **Daily**: Check service status and logs
- **Weekly**: Review Docker container status
- **Monthly**: Update system packages
- **Quarterly**: Review and update application
- **Annually**: Security audit

### Getting Help

For issues:
1. Check the logs: `sudo journalctl -u depin-app-store -n 100`
2. Review this documentation
3. Check Docker status: `sudo systemctl status docker`
4. Open an issue on the project repository

