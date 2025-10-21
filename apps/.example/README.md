# .example - Template for Adding New Apps

This folder contains a complete template for adding new DePIN applications to the app store.

## How to Use This Template

1. **Copy this folder:**
   ```bash
   cp -r apps/.example apps/your-app-name
   ```

2. **Edit `info.ts`:**
   - Update all fields with your app's information
   - Choose appropriate category
   - Set realistic hardware requirements
   - Set the correct network status (mainnet/testnet/devnet)

3. **Edit `docker-compose.yaml`:**
   - Replace with your actual Docker Compose configuration
   - Use appropriate images
   - Configure ports, volumes, and environment variables
   - Add health checks if applicable

4. **Edit `docs.md`:**
   - Write comprehensive documentation for users
   - Include setup instructions
   - Add troubleshooting section
   - Provide support links

5. **Edit `install.sh` (optional):**
   - Add any pre-installation setup steps
   - Check for prerequisites
   - Download configuration files if needed
   - Make it executable: `chmod +x install.sh`

## Files Explained

### info.ts
Contains metadata about your app:
- Display name and description
- Company/project name
- Version and category
- Hardware requirements
- Network status
- Links to docs and icon

### docker-compose.yaml
Standard Docker Compose file that defines:
- Services (containers) to run
- Images to use
- Port mappings
- Volume mounts
- Environment variables
- Restart policies

### docs.md
User-facing documentation including:
- Overview and purpose
- Setup instructions
- Configuration guide
- Monitoring and maintenance
- Troubleshooting
- Support contacts

### install.sh
Optional pre-installation script for:
- Creating directories
- Downloading configs
- Checking prerequisites
- Setting permissions
- Validating environment

## Best Practices

1. **Use specific image tags** instead of `:latest`
2. **Document all environment variables** required
3. **Set appropriate resource limits** in Docker Compose
4. **Include health checks** for monitoring
5. **Use named volumes** for data persistence
6. **Write clear, comprehensive docs** for users
7. **Test thoroughly** before submitting

## Testing Your App

```bash
# Test Docker Compose syntax
cd apps/your-app-name
docker compose config

# Test installation manually
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs

# Clean up
docker compose down -v
```

Then test via the DePIN App Store interface at http://localhost:3000

## Submitting Your App

Once your app is ready:

1. Test it thoroughly
2. Commit your changes: `git add apps/your-app-name`
3. Create a PR with description and testing notes
4. Wait for review and approval

See [ADDING_APPS.md](../../docs/ADDING_APPS.md) for the complete guide.

## Questions?

- Check the main [README](../../README.md)
- Review existing apps: `apps/pipe-network/`, `apps/tapedrive/`
- Read the [ADDING_APPS guide](../../docs/ADDING_APPS.md)
- Open an issue on GitHub

