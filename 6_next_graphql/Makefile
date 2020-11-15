build: 
	@echo "start building containers"
	docker-compose build

dev: 
	@echo "start dev mode"
	docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d

prod: 
	@echo "start prod mode"
	docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d

stop: 
	@echo "stop containers"
	@docker stop $$(docker ps -a -q)

logs: 
	@docker-compose logs -f
