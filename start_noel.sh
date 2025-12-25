#!/bin/bash

echo "========================================"
echo "   Starting Noel Christmas 3D Server"
echo "========================================"
echo ""
echo "Server will start on: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo ""

# Start Python HTTP server in background
python3 -m http.server 8000 &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Open browser
echo "Opening browser..."
xdg-open http://localhost:8000/app.html 2>/dev/null || \
  sensible-browser http://localhost:8000/app.html 2>/dev/null || \
  echo "Please open http://localhost:8000/app.html in your browser"

# Wait for server process
wait $SERVER_PID
