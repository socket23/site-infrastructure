REG ?= ghcr.io/socket23
NAME ?= static-site
TAG ?= latest
IMG := $(REG)/$(NAME):$(TAG)
PLAT := linux/amd64,linux/arm64,linux/arm/v7

.PHONY: qemu build push release run up down swarm-deploy

qemu:
	docker run --privileged --rm tonistiigi/binfmt --install all
	docker buildx create --use --name multi || true
	docker buildx use multi

build:
	docker buildx build --platform $(PLAT) -t $(IMG) --provenance=false --sbom=false --load .

push:
	docker buildx build --platform $(PLAT) -t $(IMG) --provenance=false --sbom=false --push .

release: push
	@echo "Pushed: $(IMG)"

run:
	docker compose up --build -d

up: run
	docker compose ps
	docker compose logs -f

down:
	docker compose down -v --remove-orphans

swarm-deploy:
	IMAGE=$(IMG) docker stack deploy -c stack.yaml web
