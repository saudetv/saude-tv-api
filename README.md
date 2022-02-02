# All features for management your enviroment.

## Mount docker container

### 1. Copy .env.example and rename to .env
```console
cp .env.example .env
```


### 2. Build with docker compose
```console
docker-compose build
```

### 3. Up your containers.
```console
docker-compose up
```

### 4. Check if is on.
[http://localhost:3000](http://localhost:3000)


## Extras

### 1. If you want to open sh in container folder execute:
```console
docker exec -it HERMOD_API /bin/sh
```

### 2. For test, execute this command in bash container:
```console
yarn test
```

### 3. For seed, execute this command in bash container (This command drop your database and seed):
```console
yarn seed
```

### 4. For down all containers):
```console
docker-compose down
```
