#!/bin/bash

echo "Checking for Node.js installation..."

if command -v node &> /dev/null; then
    echo "✅ Node.js found: $(node --version)"
    echo "✅ npm found: $(npm --version)"
    echo ""
    echo "You're ready to proceed! Run:"
    echo "  ./setup.sh"
    exit 0
else
    echo "❌ Node.js is not installed or not in PATH"
    echo ""
    echo "Please install Node.js 18+ first:"
    echo "  1. Visit https://nodejs.org/ and download the LTS version"
    echo "  2. Or use Homebrew: brew install node"
    echo "  3. Restart your terminal after installation"
    echo ""
    echo "See INSTALL_NODE.md for detailed instructions"
    exit 1
fi


