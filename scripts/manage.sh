#!/bin/bash

COMMAND=$1

case "$COMMAND" in
    "setup")
        echo " Setting up Polyglot Sandbox..."
        mkdir -p temp && chmod 777 temp
        docker pull python:3.9-alpine
        docker pull node:18-alpine
        echo " Setup complete."
        ;;
    "build")
        echo " Building Sandbox images..."
        COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "latest")
        
        docker build -t sandbox-python:$COMMIT_HASH -t sandbox-python:latest ./containers/python
        docker build -t sandbox-nodejs:$COMMIT_HASH -t sandbox-nodejs:latest ./containers/nodejs
        echo " Build complete. Tagged with $COMMIT_HASH"
        ;;
    "test")
        echo " Running Integration Tests..."
        curl -X POST http://localhost:3000/execute \
             -H "Content-Type: application/json" \
             -d '{"language":"python", "code":"print(\"Hello from Python!\")"}'
        echo ""
        ;;
    "clean")
        echo " Cleaning up..."
        rm -rf temp/*
        docker system prune -f
        echo "Clean complete."
        ;;
    "logs")
        echo " Tailing logs (Highlighting Errors)..."
        
        docker-compose logs -f | grep --color=always -E 'ERROR|CRITICAL|$'
        ;;
    *)
        echo "Usage: ./scripts/manage.sh {setup|build|test|clean|logs}"
        exit 1
        ;;
esac