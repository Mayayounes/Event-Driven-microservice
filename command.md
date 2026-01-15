# start everything
docker-compose down
docker-compose up --build
# check all services are running
docker ps

# backend logs
docker-compose logs -f backend

# create channel
docker exec -it event-activity-service-kafka-1 kafka-topics --create --topic user-activity --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

# see consumed msgs into mongodb
docker exec -it event-activity-service-mongodb mongosh
use events
show collections
db.events.find().pretty()