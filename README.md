# NestJS Skeleton

## Installation : 
```
pnpm install
```

## Run : 
```
nest start --watch
```

## Manipulate docker :


### Create the database and the user
```docker
docker run --name skeleton-db -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root  -e MYSQL_DATABASE=skeleton -e MYSQL_USER=skeleton -e MYSQL_PASSWORD=skeleton -d mysql:8.0.29-oracle
```

### Use mysql command line
```docker
docker container exec -it skeleton-db bash
mysql -u root -p
```

### Build api image
```docker
docker build -t skeleton-api .
```

### Run api container
```docker
docker run --name skeleton-api -p 4000:4000 -d skeleton-api
```