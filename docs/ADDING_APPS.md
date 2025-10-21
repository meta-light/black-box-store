# Adding New Apps to the DePIN App Store

This guide explains how to add new DePIN applications to the app store.

## Overview

Apps in the DePIN App Store are pre-defined in the `apps/` directory and version-controlled in the Git repository. Each app is a self-contained directory with metadata, Docker Compose configuration, and documentation.

## Directory Structure

```
apps/
├── interface.ts              # TypeScript interface definition
├── your-app-name/           # Your app directory (lowercase, hyphenated)
│   ├── info.ts              # App metadata
│   ├── docker-compose.yaml  # Docker Compose configuration
│   ├── docs.md              # Documentation
│   └── install.sh           # Installation script (optional)
```

## Step-by-Step Guide

### 1. Create App Directory

Create a new directory in `apps/` with your app name in lowercase with hyphens:

```bash
cd apps
mkdir your-app-name
cd your-app-name
```

**Naming Convention:**
- Use lowercase letters
- Replace spaces with hyphens
- Use descriptive names
- Examples: `pipe-network`, `filecoin-node`, `helium-hotspot`

### 2. Create info.ts

This file contains all metadata about your app:

```typescript
import { Info } from "../interface";

export const info: Info = {
    name: "Your App Display Name",
    description: "A clear description of what your DePIN node does and its purpose.",
    company: "Your Company or Project Name",
    version: "1.0.0",
    category: "Storage",  // Storage, Network, Compute, IoT, or Other
    dockerComposeFile: "docker-compose.yaml",
    docs: "https://your-project.com/docs",
    icon: "https://your-project.com/icon.png",
    requirements: {
        minMemoryGb: "2",    // Minimum RAM in GB
        minCpu: "1",         // Minimum CPU cores
        minDiskGb: "10"      // Minimum disk space in GB
    },
    status: "mainnet"  // mainnet, testnet, or devnet
}
```

**Field Descriptions:**

- **name**: Display name shown in the UI
- **description**: Clear explanation of the node (2-3 sentences)
- **company**: Organization or project name
- **version**: Semantic version (e.g., "1.0.0")
- **category**: One of: Storage, Network, Compute, IoT, Other
- **dockerComposeFile**: Should be "docker-compose.yaml"
- **docs**: URL to official documentation
- **icon**: URL to app icon/logo (PNG, 512x512px recommended)
- **requirements.minMemoryGb**: Minimum RAM needed
- **requirements.minCpu**: Minimum CPU cores needed
- **requirements.minDiskGb**: Minimum disk space needed
- **status**: Network status - mainnet (production), testnet, or devnet

### 3. Create docker-compose.yaml

Standard Docker Compose v3+ configuration:

```yaml
version: '3.8'

services:
  your-app-node:
    image: your-project/node:latest
    container_name: your-app-node
    ports:
      - "8080:8080"      # Adjust ports as needed
    volumes:
      - node-data:/data  # Persistent data
    environment:
      - NODE_ENV=production
      - NETWORK=mainnet
      - API_KEY=${API_KEY}  # Use env vars for secrets
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  node-data:
    driver: local
```

**Best Practices:**

1. **Port Management**: Choose unique ports to avoid conflicts
2. **Volumes**: Use named volumes for data persistence
3. **Environment Variables**: Allow configuration via env vars
4. **Restart Policy**: Use `unless-stopped` for reliability
5. **Logging**: Configure log rotation
6. **Resource Limits**: Consider adding resource constraints
7. **Health Checks**: Add health check if applicable

**Example with Resource Limits:**

```yaml
services:
  your-app:
    # ... other config ...
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

### 4. Create docs.md

Documentation for users:

```markdown
# Your App Name

## Overview

Brief description of what this DePIN node does.

## Requirements

- Hardware: List specific requirements
- Network: Bandwidth/connectivity needs
- Other: Any other prerequisites

## Configuration

Explain any environment variables or configuration options:

- `API_KEY`: Your API key from the dashboard
- `NETWORK`: Network to connect to (mainnet/testnet)

## Setup Steps

1. Get your API key from [your dashboard](https://your-project.com/dashboard)
2. Set environment variables (if needed)
3. Click Install in the DePIN App Store
4. Monitor logs for successful connection

## Monitoring

Explain how users can verify the node is working:
- Check logs via the app store
- Visit your dashboard at https://your-project.com/dashboard
- Look for specific log messages

## Rewards

Explain how rewards/earnings work (if applicable).

## Troubleshooting

Common issues and solutions:

### Connection Issues
- Check your internet connection
- Verify API key is correct
- Check firewall settings

### Performance Issues
- Ensure minimum requirements are met
- Check disk space
- Monitor resource usage

## Support

- Documentation: https://your-project.com/docs
- Discord: https://discord.gg/your-server
- Support: support@your-project.com
```

### 5. Create install.sh (Optional)

If your app needs special setup steps:

```bash
#!/bin/bash

# Installation script for Your App Name
# This runs once during initial setup

set -e

echo "Setting up Your App Name..."

# Example: Create necessary directories
mkdir -p /data/your-app

# Example: Download configuration
# curl -o config.json https://your-project.com/config.json

# Example: Set permissions
# chmod 600 config.json

echo "Setup complete!"
```

Make it executable:
```bash
chmod +x install.sh
```

## Testing Your App

### 1. Local Testing

```bash
# Test the Docker Compose file
cd apps/your-app-name
docker compose config  # Validate syntax
docker compose up -d   # Test deployment
docker compose ps      # Check status
docker compose logs    # View logs
docker compose down    # Clean up
```

### 2. Test in App Store

```bash
# From project root
npm run dev

# Open http://localhost:3000
# Your app should appear in the list
```

Verify:
- ✅ App appears in the list
- ✅ All metadata displays correctly
- ✅ Icon loads
- ✅ Status badge shows correct network
- ✅ Requirements are visible
- ✅ Install button works
- ✅ Containers start successfully
- ✅ Logs are accessible
- ✅ Stop/Start works
- ✅ Uninstall cleans up properly
- ✅ Documentation link works

## Examples

### Storage Node Example

```typescript
// apps/filecoin-node/info.ts
export const info: Info = {
    name: "Filecoin Storage Node",
    description: "Contribute storage capacity to the Filecoin network and earn FIL tokens.",
    company: "Protocol Labs",
    version: "1.0.0",
    category: "Storage",
    dockerComposeFile: "docker-compose.yaml",
    docs: "https://docs.filecoin.io",
    icon: "https://filecoin.io/icon.png",
    requirements: {
        minMemoryGb: "8",
        minCpu: "4",
        minDiskGb: "100"
    },
    status: "mainnet"
}
```

### Network Node Example

```typescript
// apps/helium-hotspot/info.ts
export const info: Info = {
    name: "Helium Hotspot",
    description: "Run a Helium network hotspot and provide LoRaWAN coverage.",
    company: "Helium Foundation",
    version: "2.0.0",
    category: "Network",
    dockerComposeFile: "docker-compose.yaml",
    docs: "https://docs.helium.com",
    icon: "https://helium.com/icon.png",
    requirements: {
        minMemoryGb: "2",
        minCpu: "2",
        minDiskGb: "50"
    },
    status: "mainnet"
}
```

## Submission Process

### 1. Create a Branch

```bash
git checkout -b add-your-app-name
```

### 2. Add Your Files

```bash
git add apps/your-app-name/
git commit -m "Add Your App Name to DePIN App Store"
```

### 3. Push and Create PR

```bash
git push origin add-your-app-name
```

Create a pull request with:
- Clear title: "Add [Your App Name]"
- Description explaining what the app does
- Link to official documentation
- Any special setup requirements

### 4. PR Requirements

Your PR should include:
- ✅ All required files (info.ts, docker-compose.yaml, docs.md)
- ✅ Valid TypeScript and YAML syntax
- ✅ Working Docker Compose configuration
- ✅ Clear documentation
- ✅ Appropriate resource requirements
- ✅ Valid URLs for docs and icon
- ✅ Tested locally

## Common Issues

### TypeScript Parsing Errors

Ensure info.ts follows the exact format:
- All strings in double quotes
- No trailing commas in objects
- Proper indentation

### Docker Compose Issues

- Validate with `docker compose config`
- Test manually before submitting
- Use standard Docker Compose v3+ syntax
- Avoid deprecated features

### Port Conflicts

Check existing apps to avoid port conflicts:
```bash
grep -r "ports:" apps/*/docker-compose.yaml
```

## Best Practices

1. **Security**
   - Don't hardcode secrets
   - Use environment variables
   - Document required credentials

2. **Performance**
   - Set appropriate resource limits
   - Use efficient base images
   - Implement health checks

3. **Reliability**
   - Use `restart: unless-stopped`
   - Implement proper logging
   - Handle errors gracefully

4. **User Experience**
   - Write clear documentation
   - Explain setup steps
   - Provide troubleshooting guide
   - Include support links

5. **Maintenance**
   - Keep versions updated
   - Test after updates
   - Document breaking changes
   - Maintain backwards compatibility

## Support

Need help adding your app?

- Check existing apps for examples: `apps/pipe-network/`, `apps/tapedrive/`
- Review the interface: `apps/interface.ts`
- Open an issue on GitHub
- Join our Discord community

## Review Criteria

PRs are reviewed for:

1. **Functionality**: Does it work as described?
2. **Security**: Are there any security concerns?
3. **Documentation**: Is it well documented?
4. **Code Quality**: Follows best practices?
5. **User Experience**: Easy to install and use?
6. **Performance**: Reasonable resource usage?

Once approved, your app will be merged and available in the next release!

