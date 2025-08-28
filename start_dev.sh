#!/bin/bash

# DexVault Campaign System Development Startup Script
# Backend is running remotely on ngrok

echo "🚀 Starting DexVault Campaign System Frontend"
echo "============================================="
echo "✅ Backend is already running remotely at: https://2ebb6db71568.ngrok-free.app"
echo ""

# Function to cleanup background processes
cleanup() {
    echo -e "\n🛑 Shutting down frontend server..."
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo "❌ Required directory 'frontend' not found"
    echo "   Make sure you're running this script from the project root"
    exit 1
fi

echo "📋 Prerequisites check passed"
echo ""

# Check backend connectivity
echo "🔍 Checking backend connectivity..."
if curl -s https://2ebb6db71568.ngrok-free.app/api/health > /dev/null; then
    echo "✅ Backend is accessible and responding"
else
    echo "⚠️  Warning: Backend may not be accessible"
    echo "   Check: https://2ebb6db71568.ngrok-free.app/api/health"
fi
echo ""

# Start Frontend
echo "🎨 Starting Frontend Server..."
cd frontend
python3 serve.py &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 2

echo "✅ Frontend is running at http://localhost:3000"
echo ""
echo "🌐 Your application is now available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: https://2ebb6db71568.ngrok-free.app"
echo "   API Docs: https://2ebb6db71568.ngrok-free.app/docs"
echo "   Health Check: https://2ebb6db71568.ngrok-free.app/api/health"
echo ""
echo "📱 To test a campaign, navigate to:"
echo "   http://localhost:3000/#/coin/5LKmh8SLt4FkbddUhLHWP1ufsvdcBAovkH1Gyaw5pump"
echo ""
echo "⏹️  Press Ctrl+C to stop the frontend server"
echo ""

# Wait for user interrupt
wait
