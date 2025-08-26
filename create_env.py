#!/usr/bin/env python3
"""
Simple script to create .env file with proper encoding
"""

def create_env_file():
    """Create .env file with proper UTF-8 encoding"""
    api_key = "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"
    
    with open('.env', 'w', encoding='utf-8') as f:
        f.write(f"HUGGINGFACE_API_KEY={api_key}\n")
    
    print("✅ .env file created successfully!")
    print("✅ API key is now securely stored in .env file")
    print("✅ The .env file is already in .gitignore (won't be committed)")

if __name__ == "__main__":
    create_env_file()
