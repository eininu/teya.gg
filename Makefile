BRANCH := $(shell git rev-parse --abbrev-ref HEAD)

ifeq ($(BRANCH),main)
up:
	docker-compose -p teya_prod -f docker-compose.prod.yml up --build -d

down:
	docker-compose -p teya_prod -f docker-compose.prod.yml down

else ifeq ($(BRANCH),dev)
up:
	docker-compose -p teya_dev -f docker-compose.dev.yml up --build -d

down:
	docker-compose -p teya_dev -f docker-compose.dev.yml down

else
$(error Unkonwn branch: $(BRANCH))
endif

.PHONY: front back

front:
	cd frontend && ng serve --proxy-config proxy.conf.json --hmr --port 80

back:
	cd backend && nest start --watch

db:
	docker-compose -p teya_prod -f docker-compose.dev.yml up --build db