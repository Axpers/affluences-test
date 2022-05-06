# Affluences test

## Installation : 
```
pnpm install
```

## Run : 
```
nest start --watch
```

## Listen the app :
http://localhost:4000/

## Routes :

### Availability
This route returns reservations for a given resource for a date
**URI** : /reservations
**Method** : GET
**Parameters**
| name | type | required |
| ------ | ------ | ------|
| date | date in format YYYY-MM-DD | yes |
| resourceId | int | yes |
| hour | int | yes |

**Example**
GET http://localhost:4000/reservations?date=2022-05-06&resourceId=1337&hour=17

Response
```json
{
    "available": true
}
```


## Build and run
You can run this service with docker, there is a Dockerfile available.

**BUT** note that you will have to change the reservation service ip inside the `.env` file in the root of the project, since the container will not be running on localhost.

### Build the image
```docker
docker build -t affluences-test .
```

### Run container
```docker
docker run --name affluences-test -p 4000:4000 -d affluences-test
```

