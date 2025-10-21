# Testing Guide

This guide covers testing the DePIN App Store to ensure everything works correctly.

## Quick Smoke Test

After installation, run these quick tests:

```bash
# 1. Check service is running
sudo systemctl status depin-app-store

# 2. Check web interface loads
curl http://localhost:3000

# 3. Check API health
curl http://localhost:3000/api/health

# 4. Check Docker is accessible
docker ps
```

All should return successfully.

## Comprehensive Testing

### 1. Installation Testing

#### On Fresh Ubuntu Machine

```bash
# Test clean installation
sudo bash install.sh

# Verify Docker installed
docker --version
docker compose version

# Verify Node.js installed
node --version
npm --version

# Verify service created and running
sudo systemctl status depin-app-store

# Verify web interface accessible
curl -I http://localhost:3000
```

Expected: All commands succeed, status code 200.

#### Idempotency Test

```bash
# Run installer again
sudo bash install.sh
```

Expected: Should complete without errors, handle existing installations gracefully.

### 2. Web Interface Testing

#### Basic UI Flow

1. **Open Browser**
   - Navigate to `http://localhost:3000`
   - Verify page loads with "DePIN App Store" title
   - Check all UI elements render

2. **Test Filters**
   - Click "All Apps" - should show all apps
   - Click "Available" - should show uninstalled apps
   - Click "Installed" - should show installed apps

3. **Responsive Design**
   - Test on different screen sizes
   - Check mobile view (< 768px)
   - Check tablet view (768px - 1024px)
   - Check desktop view (> 1024px)

### 3. App Upload Testing

#### Valid Upload

```bash
# Use sample app
cd examples
```

1. Click "Upload App" button
2. Fill form:
   - Name: `Test Storage Node`
   - Company: `Test Corp`
   - Description: `A test storage node for DePIN`
   - Version: `1.0.0`
   - Category: `Storage`
3. Upload `sample-app-compose.yml`
4. Click "Upload App"

Expected: Success message, app appears in list.

#### Invalid Upload Tests

**Missing Fields:**
```
1. Leave "Name" empty
2. Try to submit
Expected: Browser validation error
```

**Invalid YAML:**
```yaml
# Create invalid-compose.yml
services:
  test:
    image: nginx
    invalid_key: [broken yaml structure
```

Expected: Error message about invalid YAML.

**Non-YAML File:**
```
1. Try uploading a .txt or .json file
Expected: File picker should reject or error on upload
```

### 4. App Installation Testing

#### Successful Installation

1. Find app with status "Available"
2. Click "Install"
3. Confirm dialog
4. Wait for completion

Verify:
```bash
# Check containers created
docker ps | grep sample

# Check project exists
docker compose ls

# Verify status in UI changed to "Running"
```

#### Installation Errors

**Docker Not Running:**
```bash
# Stop Docker
sudo systemctl stop docker

# Try to install app via UI
# Expected: Error message
```

**Port Conflict:**
```bash
# Start something on port 8080
python3 -m http.server 8080 &

# Try to install sample app (uses 8080)
# Expected: Installation fails with port conflict error
```

**Insufficient Disk Space:**
```bash
# Check available space
df -h

# If sufficient space, this test is optional
# Otherwise: Expected failure with disk space error
```

### 5. App Management Testing

#### Start/Stop Operations

**Stop Running App:**
1. Find running app
2. Click "Stop"
3. Confirm

Verify:
```bash
docker ps | grep sample  # Should show stopped container
```

**Start Stopped App:**
1. Find stopped app
2. Click "Start"

Verify:
```bash
docker ps | grep sample  # Should show running container
```

#### View Logs

1. Click "View Logs" on running app
2. Verify modal opens
3. Check logs are displayed
4. Close modal

Expected: Container logs visible.

#### Uninstall

1. Stop app if running
2. Click "Uninstall"
3. Confirm

Verify:
```bash
# Containers should be removed
docker ps -a | grep sample  # Should return nothing

# Volumes may remain (by design)
docker volume ls
```

#### Delete from Store

1. Ensure app is uninstalled first
2. Click "Delete from Store"
3. Confirm

Verify:
- App removed from UI
- App removed from data/apps.json
- Compose file removed from data/compose-files/

### 6. API Testing

#### List Apps

```bash
curl http://localhost:3000/api/apps
```

Expected: JSON array of apps.

#### Get Single App

```bash
# Replace {id} with actual app ID
curl http://localhost:3000/api/apps/{id}
```

Expected: JSON object with app details.

#### Health Check

```bash
curl http://localhost:3000/api/health
```

Expected:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "version": "1.0.0",
  "checks": {
    "docker": "ok",
    "storage": "ok",
    "api": "ok"
  },
  "stats": {
    "totalApps": 1,
    "installedApps": 0,
    "runningApps": 0
  }
}
```

#### Install App (API)

```bash
curl -X POST http://localhost:3000/api/apps/{id}/install
```

Expected: Success response, containers created.

#### Get Logs (API)

```bash
curl http://localhost:3000/api/apps/{id}/logs?tail=50
```

Expected: JSON with logs.

### 7. File System Testing

#### Data Directory Structure

```bash
cd /opt/depin-app-store/data

# Check structure
ls -la

# Should see:
# - apps.json
# - installations.json
# - compose-files/
```

#### Data Persistence

```bash
# Upload and install an app

# Restart service
sudo systemctl restart depin-app-store

# Verify app still shows in UI
curl http://localhost:3000/api/apps
```

Expected: Apps persist across restarts.

#### Backup and Restore

```bash
# Create backup
sudo tar -czf backup.tar.gz /opt/depin-app-store/data/

# Delete an app

# Restore
sudo systemctl stop depin-app-store
sudo tar -xzf backup.tar.gz -C /
sudo systemctl start depin-app-store

# Verify app restored
```

### 8. Docker Integration Testing

#### Compose File Execution

Test various compose file features:

**Multi-Service:**
```yaml
services:
  web:
    image: nginx:alpine
  db:
    image: postgres:15-alpine
```

**Volumes:**
```yaml
services:
  app:
    image: nginx:alpine
    volumes:
      - data:/data
volumes:
  data:
```

**Networks:**
```yaml
services:
  app:
    image: nginx:alpine
    networks:
      - custom
networks:
  custom:
    driver: bridge
```

**Environment Variables:**
```yaml
services:
  app:
    image: nginx:alpine
    environment:
      - KEY=value
      - DEBUG=true
```

### 9. Error Handling Testing

#### Network Errors

```bash
# Disconnect network
sudo ip link set eth0 down

# Try operations
# Expected: Appropriate error messages
```

#### Permission Errors

```bash
# Remove docker group membership
sudo deluser $USER docker

# Try to install app
# Expected: Permission denied error
```

#### Invalid State Transitions

- Try to start already running app
- Try to stop already stopped app
- Try to install already installed app
- Try to uninstall non-installed app

Expected: Clear error messages.

### 10. Load Testing

#### Multiple Apps

```bash
# Upload 10 apps
for i in {1..10}; do
  # Upload via API or UI
done

# Verify all load correctly
curl http://localhost:3000/api/apps | jq length
```

#### Concurrent Operations

```bash
# Install multiple apps simultaneously
curl -X POST http://localhost:3000/api/apps/{id1}/install &
curl -X POST http://localhost:3000/api/apps/{id2}/install &
curl -X POST http://localhost:3000/api/apps/{id3}/install &
wait

# Verify all installed correctly
docker ps
```

### 11. Performance Testing

#### Page Load Time

```bash
# Measure load time
time curl http://localhost:3000

# Should be < 500ms
```

#### API Response Time

```bash
# Test API performance
time curl http://localhost:3000/api/apps
time curl http://localhost:3000/api/health

# Should be < 100ms each
```

#### Memory Usage

```bash
# Check memory usage
sudo systemctl status depin-app-store | grep Memory

# Should be < 500MB typically
```

### 12. Security Testing

#### Input Validation

- Try XSS in app name: `<script>alert('xss')</script>`
- Try SQL injection (not applicable, but test special chars)
- Try path traversal in compose file names: `../../etc/passwd`

Expected: All properly escaped/validated.

#### File Upload Limits

```bash
# Try uploading very large file (>10MB)
# Expected: Handled gracefully
```

### 13. Upgrade Testing

#### Version Update

```bash
# Backup current version
sudo cp -r /opt/depin-app-store /opt/depin-app-store.backup

# Simulate update (install new version)
# Verify data migrates correctly
# Verify apps still work
```

## Automated Testing Script

Create a test script:

```bash
#!/bin/bash
# test.sh - Automated testing script

set -e

echo "Starting DePIN App Store Tests..."

# Test 1: Service Health
echo "Test 1: Checking service health..."
curl -f http://localhost:3000/api/health || exit 1
echo "✓ Health check passed"

# Test 2: List Apps
echo "Test 2: Listing apps..."
curl -f http://localhost:3000/api/apps || exit 1
echo "✓ Apps API passed"

# Test 3: Docker Check
echo "Test 3: Checking Docker..."
docker ps > /dev/null || exit 1
echo "✓ Docker check passed"

echo "All tests passed! ✓"
```

Run:
```bash
chmod +x test.sh
./test.sh
```

## Continuous Testing

### Daily Checks

```bash
# Check service status
sudo systemctl status depin-app-store

# Check logs for errors
sudo journalctl -u depin-app-store -p err -n 50

# Check disk space
df -h /opt/depin-app-store

# Check Docker containers
docker ps
```

### Weekly Checks

- Review installed apps
- Check for updates
- Review logs
- Test backup/restore
- Monitor resource usage

## Troubleshooting Failed Tests

### Service Won't Start

```bash
sudo journalctl -u depin-app-store -n 100
npm run dev  # Run manually to see errors
```

### Docker Issues

```bash
sudo systemctl status docker
docker info
sudo docker run hello-world
```

### Port Conflicts

```bash
sudo lsof -i :3000
sudo netstat -tulpn | grep 3000
```

### Permission Issues

```bash
ls -la /opt/depin-app-store
groups $USER
sudo usermod -aG docker $USER
```

## Test Results Documentation

Create a test log:

```markdown
# Test Run: 2025-01-15

## Environment
- OS: Ubuntu 22.04
- Node: v20.10.0
- Docker: 24.0.7

## Results
- [✓] Installation
- [✓] Web Interface
- [✓] App Upload
- [✓] App Installation
- [✓] App Management
- [✓] API Tests
- [✗] Load Test (timeout on concurrent installs)

## Issues Found
1. Concurrent installations sometimes conflict
2. Large compose files (>5MB) timeout

## Actions
- Fix concurrent installation locking
- Add file size validation
```

## Success Criteria

A successful test run should show:
- ✅ All services running
- ✅ Web interface accessible
- ✅ Apps can be uploaded
- ✅ Apps can be installed/uninstalled
- ✅ Logs are viewable
- ✅ No errors in system logs
- ✅ Data persists across restarts
- ✅ Docker integration works
- ✅ API endpoints respond correctly
- ✅ Resource usage is reasonable

## Getting Help

If tests fail:
1. Check the troubleshooting section
2. Review logs: `sudo journalctl -u depin-app-store -f`
3. Check Docker: `docker ps` and `docker logs`
4. Verify permissions and ports
5. Open an issue with test results

