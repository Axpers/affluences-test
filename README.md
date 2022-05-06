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
