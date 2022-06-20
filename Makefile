all:
	@docker-compose up

down:
	@docker-compose down

re:
	@docker-compose up --build

test:
	@docker-compose --profile test up --build --abort-on-container-exit

clean:
	@docker stop $$(docker ps -qa);\
	docker rm $$(docker ps -qa);\
	docker rmi -f $$(docker images -qa);\

.PHONY: all re down clean test
