# QR Contact Docker Management

.PHONY: help build run up down logs clean test

# Default target
help: ## Show this help message
	@echo "QR Contact Docker Management"
	@echo "=========================="
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

build: ## Build Docker image
	docker build -t qrcontact .

run: ## Run container directly
	docker run -p 3000:3000 qrcontact

up: ## Start with docker-compose
	docker-compose up -d

down: ## Stop docker-compose services
	docker-compose down

logs: ## View container logs
	docker-compose logs -f

clean: ## Clean up Docker resources
	docker-compose down -v
	docker system prune -f
	docker image prune -f

test: ## Test the application
	@echo "Testing QR Contact application..."
	@curl -f http://localhost:3000 || echo "Application not running. Run 'make up' first."

dev: ## Start development server
	npm run dev

install: ## Install dependencies
	npm install

# Production targets
prod-build: ## Build for production
	docker build --target runner -t qrcontact:prod .

prod-up: ## Start production with nginx
	docker-compose --profile production up -d

prod-down: ## Stop production services
	docker-compose --profile production down

# Health checks
health: ## Check application health
	@echo "Checking application health..."
	@curl -f http://localhost:3000/health || echo "Health check failed"

# Quick setup
setup: install build ## Complete setup (install + build)
	@echo "Setup complete! Run 'make up' to start the application."
