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
