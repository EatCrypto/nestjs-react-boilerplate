# How to start

## Run postgresql database and PgAdmin on docker.

```console
docker-compose up -d
```

### Access to PgAdmin:

- **URL:** `http://localhost:5050`
- **Username:** pgadmin4@pgadmin.org (as a default)
- **Password:** admin (as a default)

### Add a new server in PgAdmin:

- **Host name/address** `postgres`
- **Port** `5432`
- **Username** as `POSTGRES_USER`, by default: `postgres`
- **Password** as `POSTGRES_PASSWORD`, by default `postgres`

## Yarn install & Env files setup

Following command will run `yarn install` on both nestjs api and react client app and generate env files.

```console
yarn setup
```

## Run DB migration

```console
yarn migration:run
```

## Generate DB Seeds

To generate two default users - admin and regular user.

```console
yarn seed
```

# That's it!!!

NestJS api is running at http://localhost:3000 and React client app is running at http://localhost:3001

There are two test users.

```
Admin User
username: admin
password: admin
```

```
Regular User
username: thain
password: user
```
