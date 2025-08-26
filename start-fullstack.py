#!/usr/bin/env python3
"""
Full-Stack Startup Script
Starts both backend (Flask) and frontend (Next.js) servers
"""

import subprocess
import sys
import time
import os
import threading
from pathlib import Path

def print_banner():
    print("🚀" + "="*70 + "🚀")
    print("🎯  STARTING FULL-STACK COVERAGE TESTING FRAMEWORK  🎯")
    print("🚀" + "="*70 + "🚀")
    print()

def start_backend():
    """Start the Flask backend server"""
    print("📊 Starting Backend (Flask + ML Models)...")
    
    backend_dir = Path(__file__).parent / "backend"
    os.chdir(backend_dir)
    
    try:
        # Start Flask server
        result = subprocess.run([
            sys.executable, "run.py"
        ], check=False)
        
        if result.returncode != 0:
            print("❌ Backend failed to start")
        
    except KeyboardInterrupt:
        print("\n🛑 Backend server stopped")
    except Exception as e:
        print(f"❌ Backend error: {e}")

def start_frontend():
    """Start the Next.js frontend server"""
    print("🎨 Starting Frontend (Next.js)...")
    
    frontend_dir = Path(__file__).parent / "frontend" / "coverage-testinglol-main"
    
    if not frontend_dir.exists():
        print("❌ Frontend directory not found!")
        return
    
    os.chdir(frontend_dir)
    
    try:
        # Check if node_modules exists
        if not (frontend_dir / "node_modules").exists():
            print("📦 Installing frontend dependencies...")
            subprocess.run(["npm", "install"], check=True)
        
        # Start Next.js dev server
        print("🚀 Starting Next.js development server...")
        result = subprocess.run([
            "npm", "run", "dev"
        ], check=False)
        
        if result.returncode != 0:
            print("❌ Frontend failed to start")
            
    except KeyboardInterrupt:
        print("\n🛑 Frontend server stopped")
    except Exception as e:
        print(f"❌ Frontend error: {e}")

def check_dependencies():
    """Check if required dependencies are available"""
    print("🔍 Checking dependencies...")
    
    # Check Python
    print(f"✅ Python: {sys.version}")
    
    # Check Node.js
    try:
        result = subprocess.run(["node", "--version"], 
                              capture_output=True, text=True, check=True)
        print(f"✅ Node.js: {result.stdout.strip()}")
    except:
        print("❌ Node.js not found! Please install Node.js")
        return False
    
    # Check npm
    try:
        result = subprocess.run(["npm", "--version"], 
                              capture_output=True, text=True, check=True)
        print(f"✅ npm: {result.stdout.strip()}")
    except:
        print("❌ npm not found!")
        return False
    
    return True

def main():
    print_banner()
    
    if not check_dependencies():
        print("❌ Missing dependencies. Please install them first.")
        return
    
    print("\n🎯 STARTING SERVERS...")
    print("📊 Backend will run on: http://localhost:5000")
    print("🎨 Frontend will run on: http://localhost:3000")
    print("\n⚡ Both servers will start simultaneously")
    print("🛑 Press Ctrl+C to stop both servers")
    print("="*70)
    
    # Wait a moment
    time.sleep(2)
    
    # Start both servers in separate threads
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    frontend_thread = threading.Thread(target=start_frontend, daemon=True)
    
    try:
        # Start backend first
        backend_thread.start()
        time.sleep(3)  # Give backend time to start
        
        # Then start frontend
        frontend_thread.start()
        
        # Wait for both
        backend_thread.join()
        frontend_thread.join()
        
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down servers...")
        print("✅ Full-stack application stopped")

if __name__ == "__main__":
    main()
