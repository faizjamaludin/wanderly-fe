#!/bin/bash

# Configuration
DEV_PROFILE="dev"
PROD_PROFILE="prod"
DEV_SERVICE="dev"

case "$1" in
  dev)
    echo "🚀 Starting Development Environment..."
    docker compose --profile $DEV_PROFILE up --build
    ;;
  prod)
    echo "📦 Starting Production Environment..."
    docker compose --profile $PROD_PROFILE up --build
    ;;
  i|install)
    shift
    echo "📥 Installing packages: $@"
    docker compose exec $DEV_SERVICE npm install "$@"
    ;;
  down)
    echo "🛑 Stopping all containers..."
    docker compose down
    ;;
  logs)
    docker compose logs -f
    ;;
  *)
    echo "Usage: ./d [command]"
    echo ""
    echo "Commands:"
    echo "  dev       - Start development server"
    echo "  prod      - Start production server (simulated)"
    echo "  i [pkg]   - Install npm packages inside Docker"
    echo "  down      - Stop and remove containers"
    echo "  logs      - View container logs"
    ;;
esac
