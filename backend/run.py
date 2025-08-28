#!/usr/bin/env python3
"""
Simple script to run the DexVault Campaign System backend
"""
import uvicorn
import os
from pathlib import Path

if __name__ == "__main__":
    # Set default port if not specified
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    print(f"Starting DexVault Campaign System backend...")
    print(f"Server will be available at: http://{host}:{port}")
    print(f"API documentation: http://{host}:{port}/docs")
    print(f"Health check: http://{host}:{port}/api/health")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        uvicorn.run(
            "src.main:app",
            host=host,
            port=port,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\nShutting down server...")
    except Exception as e:
        print(f"Error starting server: {e}")
