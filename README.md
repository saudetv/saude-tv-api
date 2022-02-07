# All features for management your enviroment.

## Mount docker container

### 1. Copy .env.local and rename to .env
```console
cp .env.local .env
```


### 2. Install packages with management packages
```console
yarn
```
ou
```console
npm install
```

### 3. Build with docker compose
```console
docker-compose build
```

### 4. Up your containers.
```console
docker-compose up
```

### 5. Check if is on.
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
