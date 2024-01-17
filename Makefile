BRANCH := $(shell git rev-parse --abbrev-ref HEAD)

ifeq ($(BRANCH),main)
up:
	cd backend && docker build -t backend:latest . && cd .. && docker-compose -p teya_prod -f docker-compose.prod.yml up --build  -d

down:
	docker-compose -p teya_prod -f docker-compose.prod.yml down

else ifeq ($(BRANCH),dev)
up:
	cd backend && docker build -t backend:latest . && cd .. && docker-compose -p teya_dev -f docker-compose.dev.yml up --renew-anon-volumes --build  -d

down:
	docker-compose -p teya_dev -f docker-compose.dev.yml down -v

else
$(error Unkonwn branch: $(BRANCH))
endif

.PHONY: front back db pbn

front:
	cd frontend && set PORT=80 && npm run start

back:
	cd backend && nest start --watch

db:
	docker-compose -p teya_dev -f docker-compose.dev.yml up --build db

pbn:
	cd pbn && node server.js

# migrations
#migration-new:
#	cd backend && npm run build && typeorm migration:create ./src/migrations/$(filter-out $@,$(MAKECMDGOALS))

migration-generate:
	cd backend && npm run typeorm migration:generate ./src/migrations/$(filter-out $@,$(MAKECMDGOALS))  && npm run build

migration-up:
	cd backend && npm run build && npm run typeorm migration:run

migration-down:
	cd backend && npm run build && npm run typeorm migration:revert

