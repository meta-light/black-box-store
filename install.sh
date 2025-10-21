#!/bin/bash

set -e

echo "========================================"
echo "  Dawn Black Box Store Installer"
echo "========================================"
echo ""

# Detect OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

if [ "$MACHINE" = "UNKNOWN:${OS}" ]; then
    echo "Error: Unsupported operating system: ${OS}"
    exit 1
fi

echo "Detected OS: $MACHINE"
echo ""

# Check if running with sudo on Linux
if [ "$MACHINE" = "Linux" ] && [ "$EUID" -ne 0 ]; then 
    echo "This script requires sudo privileges on Linux to install system dependencies."
    echo "Please run with: sudo bash install.sh"
    exit 1
fi

# Store the actual user (in case running with sudo)
if [ -n "$SUDO_USER" ]; then
    ACTUAL_USER="$SUDO_USER"
    ACTUAL_HOME=$(eval echo ~$SUDO_USER)
else
    ACTUAL_USER="$USER"
    ACTUAL_HOME="$HOME"
fi

echo "Installing for user: $ACTUAL_USER"
echo ""

# Function to install Homebrew on macOS
install_homebrew() {
    if ! command -v brew &> /dev/null; then
        echo "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # Add Homebrew to PATH for Apple Silicon Macs
        if [[ $(uname -m) == 'arm64' ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> "$ACTUAL_HOME/.zprofile"
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
    else
        echo "✓ Homebrew already installed"
    fi
}

# Install Git
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Installing Git..."
    if [ "$MACHINE" = "Mac" ]; then
        install_homebrew
        brew install git
    else
        # Ubuntu/Linux
        apt-get update
        apt-get install -y git
    fi
    echo "✓ Git installed successfully"
else
    echo "✓ Git $(git --version | cut -d' ' -f3) found"
fi

# Install Node.js
if ! command -v node &> /dev/null; then
    echo ""
    echo "Node.js is not installed. Installing Node.js 20..."
    if [ "$MACHINE" = "Mac" ]; then
        install_homebrew
        brew install node@20
        brew link node@20
    else
        # Ubuntu/Linux
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
    fi
    echo "✓ Node.js installed successfully"
else
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo ""
        echo "Node.js version $NODE_VERSION is too old. Upgrading to Node.js 20..."
        if [ "$MACHINE" = "Mac" ]; then
            install_homebrew
            brew install node@20
            brew link --overwrite node@20
        else
            curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
            apt-get install -y nodejs
        fi
        echo "✓ Node.js upgraded successfully"
    else
        echo "✓ Node.js $(node -v) found"
    fi
fi

# Install Docker
if ! command -v docker &> /dev/null; then
    echo ""
    echo "Docker is not installed. Installing Docker..."
    if [ "$MACHINE" = "Mac" ]; then
        echo ""
        echo "Installing Docker Desktop for macOS..."
        echo "This will download and install Docker Desktop."
        echo ""
        
        # Detect architecture
        ARCH=$(uname -m)
        if [ "$ARCH" = "arm64" ]; then
            DOCKER_URL="https://desktop.docker.com/mac/main/arm64/Docker.dmg"
        else
            DOCKER_URL="https://desktop.docker.com/mac/main/amd64/Docker.dmg"
        fi
        
        # Download Docker Desktop
        echo "Downloading Docker Desktop..."
        curl -L -o /tmp/Docker.dmg "$DOCKER_URL"
        
        # Mount and install
        echo "Installing Docker Desktop..."
        hdiutil attach /tmp/Docker.dmg
        cp -R /Volumes/Docker/Docker.app /Applications/
        hdiutil detach /Volumes/Docker
        rm /tmp/Docker.dmg
        
        echo "✓ Docker Desktop installed"
        echo ""
        echo "========================================" 
        echo "IMPORTANT: Please start Docker Desktop"
        echo "========================================"
        echo ""
        echo "1. Open Docker Desktop from Applications"
        echo "2. Wait for Docker to start (whale icon in menu bar)"
        echo "3. Then run this script again:"
        echo "   bash install.sh"
        echo ""
        exit 0
    else
        # Ubuntu/Linux
        echo "Installing Docker Engine..."
        apt-get update
        apt-get install -y ca-certificates curl gnupg
        
        install -m 0755 -d /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        chmod a+r /etc/apt/keyrings/docker.gpg
        
        echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
          $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
          tee /etc/apt/sources.list.d/docker.list > /dev/null
        
        apt-get update
        apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
        
        # Start Docker
        systemctl start docker
        systemctl enable docker
        
        # Add user to docker group
        usermod -aG docker $ACTUAL_USER
        
        echo "✓ Docker installed successfully"
    fi
else
    echo "✓ Docker $(docker --version | cut -d' ' -f3 | cut -d',' -f1) found"
fi

# Check if Docker is running
echo ""
echo "Checking Docker status..."
if ! docker info &> /dev/null; then
    if [ "$MACHINE" = "Mac" ]; then
        echo ""
        echo "========================================"
        echo "Docker Desktop is not running"
        echo "========================================"
        echo ""
        echo "Please start Docker Desktop:"
        echo "1. Open Docker Desktop from Applications"
        echo "2. Wait for the whale icon to appear in menu bar"
        echo "3. Then run this script again:"
        echo "   bash install.sh"
        echo ""
        exit 1
    else
        echo "Starting Docker..."
        systemctl start docker
        sleep 3
        if ! docker info &> /dev/null; then
            echo "Error: Docker failed to start"
            echo "Please check: sudo systemctl status docker"
            exit 1
        fi
    fi
fi

echo "✓ Docker is running"
echo ""

# Set installation directory
INSTALL_DIR="$ACTUAL_HOME/.black-box-store"
REPO_URL="https://github.com/meta-light/black-box-store.git"

# Clone or update repository
if [ -d "$INSTALL_DIR" ]; then
    echo "Installation directory already exists: $INSTALL_DIR"
    echo "Updating repository..."
    cd "$INSTALL_DIR"
    sudo -u "$ACTUAL_USER" git pull || git pull
else
    echo "Cloning repository to $INSTALL_DIR..."
    if [ "$MACHINE" = "Linux" ]; then
        sudo -u "$ACTUAL_USER" git clone "$REPO_URL" "$INSTALL_DIR"
    else
        git clone "$REPO_URL" "$INSTALL_DIR"
    fi
fi

# Set proper ownership
if [ "$MACHINE" = "Linux" ]; then
    chown -R "$ACTUAL_USER:$ACTUAL_USER" "$INSTALL_DIR"
fi

cd "$INSTALL_DIR"

# Install dependencies
echo ""
echo "Installing Node.js dependencies..."
if [ "$MACHINE" = "Linux" ]; then
    sudo -u "$ACTUAL_USER" npm install
else
    npm install
fi

# Build the application
echo ""
echo "Building application..."
if [ "$MACHINE" = "Linux" ]; then
    sudo -u "$ACTUAL_USER" npm run build
else
    npm run build
fi

# Create CLI executable
echo ""
echo "Installing CLI command..."

CLI_SCRIPT="$INSTALL_DIR/bin/dbb-store"
mkdir -p "$INSTALL_DIR/bin"

cat > "$CLI_SCRIPT" << 'EOF'
#!/bin/bash

# Dawn Black Box Store CLI
INSTALL_DIR="$HOME/.black-box-store"
PORT=3456

if [ ! -d "$INSTALL_DIR" ]; then
    echo "Error: Black Box Store not installed. Please run install.sh first."
    exit 1
fi

echo "========================================"
echo "  Dawn Black Box Store"
echo "========================================"
echo ""
echo "Starting server on http://localhost:$PORT"
echo "Press Ctrl+C to stop"
echo ""

cd "$INSTALL_DIR"

# Start the Next.js server in the background
PORT=$PORT npm start &
SERVER_PID=$!

# Wait for server to be ready
sleep 3

# Open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "http://localhost:$PORT"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:$PORT"
    elif command -v gnome-open &> /dev/null; then
        gnome-open "http://localhost:$PORT"
    fi
fi

echo "Server running with PID $SERVER_PID"
echo ""
echo "Open your browser to: http://localhost:$PORT"
echo ""

# Wait for the server process
wait $SERVER_PID
EOF

chmod +x "$CLI_SCRIPT"

# Set proper ownership
if [ "$MACHINE" = "Linux" ]; then
    chown "$ACTUAL_USER:$ACTUAL_USER" "$CLI_SCRIPT"
fi

# Add to PATH
if [ "$MACHINE" = "Mac" ]; then
    SHELL_RC="$ACTUAL_HOME/.zshrc"
    if [ ! -f "$SHELL_RC" ]; then
        SHELL_RC="$ACTUAL_HOME/.bash_profile"
    fi
else
    SHELL_RC="$ACTUAL_HOME/.bashrc"
fi

# Check if already in PATH
if ! grep -q "black-box-store/bin" "$SHELL_RC" 2>/dev/null; then
    echo "" >> "$SHELL_RC"
    echo "# Dawn Black Box Store CLI" >> "$SHELL_RC"
    echo "export PATH=\"\$HOME/.black-box-store/bin:\$PATH\"" >> "$SHELL_RC"
    
    if [ "$MACHINE" = "Linux" ]; then
        chown "$ACTUAL_USER:$ACTUAL_USER" "$SHELL_RC"
    fi
    
    echo "✓ Added to PATH in $SHELL_RC"
else
    echo "✓ Already in PATH"
fi

echo ""
echo "========================================"
echo "  Installation Complete!"
echo "========================================"
echo ""

if [ "$MACHINE" = "Linux" ] && [ -n "$SUDO_USER" ]; then
    echo "IMPORTANT: You ran this script with sudo."
    echo "The docker group was updated. Please:"
    echo "  1. Log out and log back in"
    echo "  2. Or run: newgrp docker"
    echo ""
fi

echo "To start using the Dawn Black Box Store:"
echo ""
echo "  1. Reload your shell:"
echo "     source $SHELL_RC"
echo ""
echo "  2. Run the CLI:"
echo "     dbb-store"
echo ""
echo "Or run it directly:"
echo "  $CLI_SCRIPT"
echo ""
echo "The app will start on http://localhost:3456 and open in your browser."
echo ""
