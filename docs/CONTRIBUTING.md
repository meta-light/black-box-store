# Contributing to DePIN App Store

Thank you for your interest in contributing to the DePIN App Store! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Node.js 20.x or later
- Docker and Docker Compose
- Git
- A code editor (VS Code recommended)

### Development Setup

1. **Fork and clone the repository**

```bash
git clone https://github.com/your-username/depin-app-store.git
cd depin-app-store
```

2. **Install dependencies**

```bash
npm install
```

3. **Run in development mode**

```bash
npm run dev
```

4. **Access the application**

Open http://localhost:3000 in your browser.

## Project Structure

```
depin-app-store/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── apps/          # App management endpoints
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── AppCard.tsx        # App display card
│   └── UploadModal.tsx    # Upload form
├── lib/                   # Utility libraries
│   ├── docker.ts          # Docker integration
│   └── storage.ts         # Data persistence
├── types/                 # TypeScript definitions
│   └── index.ts           # Type definitions
└── examples/              # Example compose files
```

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/your-repo/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (OS, Node version, Docker version)
   - Relevant logs or screenshots

### Suggesting Enhancements

1. Check existing issues and discussions
2. Create an issue describing:
   - The problem you're trying to solve
   - Your proposed solution
   - Alternative solutions you've considered
   - Any mockups or examples

### Pull Requests

1. **Create a branch**

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

2. **Make your changes**

- Follow the coding standards (see below)
- Write clear commit messages
- Add tests if applicable
- Update documentation

3. **Test your changes**

```bash
# Run the app
npm run dev

# Test functionality manually

# Check for TypeScript errors
npm run build
```

4. **Commit your changes**

```bash
git add .
git commit -m "feat: add awesome feature"
# or
git commit -m "fix: resolve issue with app installation"
```

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

5. **Push and create PR**

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` when possible
- Use async/await instead of promises

### React/Next.js

- Use functional components with hooks
- Follow React best practices
- Use 'use client' directive when needed
- Keep components focused and reusable

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Use meaningful variable names
- Comment complex logic

### File Naming

- Components: `PascalCase.tsx` (e.g., `AppCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `docker.ts`)
- API routes: `route.ts` in appropriate folder

## Testing

### Manual Testing

Before submitting a PR, test:

1. **App Upload**
   - Upload a valid compose file
   - Upload an invalid file (should show error)
   - Upload with missing fields

2. **App Installation**
   - Install an app
   - Check Docker containers created
   - Verify status updates

3. **App Management**
   - Start/stop apps
   - View logs
   - Uninstall apps

4. **Error Handling**
   - Test with Docker stopped
   - Test with invalid app IDs
   - Test with network issues

### Testing Checklist

- [ ] Changes work in development mode
- [ ] Changes work in production build
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] UI is responsive
- [ ] Error messages are clear
- [ ] Documentation updated

## Areas for Contribution

We welcome contributions in these areas:

### Features
- [ ] Authentication/authorization
- [ ] Multi-user support
- [ ] App categories and filtering
- [ ] Search functionality
- [ ] App ratings and reviews
- [ ] Auto-updates for installed apps
- [ ] Resource monitoring and limits
- [ ] Backup/restore functionality
- [ ] App dependencies management
- [ ] Custom app registries

### Improvements
- [ ] Better error handling
- [ ] Loading states and animations
- [ ] Mobile responsiveness
- [ ] Accessibility (a11y)
- [ ] Performance optimizations
- [ ] Database integration (replace JSON files)
- [ ] WebSocket for real-time updates
- [ ] Better logging system

### Documentation
- [ ] API documentation
- [ ] Video tutorials
- [ ] More examples
- [ ] Deployment guides for different platforms
- [ ] Troubleshooting guide
- [ ] Security best practices

### DevOps
- [ ] CI/CD pipeline
- [ ] Automated testing
- [ ] Docker image for the app store itself
- [ ] Kubernetes deployment
- [ ] Monitoring and alerting

## Code Review Process

1. A maintainer will review your PR
2. They may request changes or ask questions
3. Address feedback and update your PR
4. Once approved, your PR will be merged

## Community

- Be respectful and inclusive
- Help others in issues and discussions
- Share your use cases and feedback
- Spread the word about the project

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to:
- Open an issue with your question
- Start a discussion
- Reach out to maintainers

Thank you for contributing! 🎉

