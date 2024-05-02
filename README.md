# Getting Started with this project

This is a NodeJs TypseScript project.

## Available Scripts

Clone this project form the github repository (https://github.com/eyituoyoclinton/hux-assessment-backend.git)
In the project directory, you can run:

### `npm run setup`

### `npm run build`

### `npm start`

Runs the app in the development mode.\
Your base url will be [http://localhost:3000].

### API ROUTES BASEURL

### `http://localhost:3000/api`

## CREATE AN ACCOUNT {POST REQUEST}

## `http://localhost:3000/api/auth/create-account`

# The create account requires

```json
{ "firstname": "", "lastname": "", "email": "", "mobile": "", "password": "" }
```

## LOGIN AN ACCOUNT {POST REQUEST}

## `http://localhost:3000/api/auth/login`

```json
{ "username": "mobile/email", "password": "" }
```

## CREATE A CONTACT {POST REQUEST}

## `http://localhost:3000/api/users/contact`

# This is an authenticated route and requires Authorization header as {Bearer token}

```json
{ "firstname": "", "lastname": "", "mobile": "" }
```

## UPDATE A CONTACT {PATCH REQUEST}

## `http://localhost:3000/api/users/contact/:CONNTACTID`

# This is an authenticated route and requires Authorization header as {Bearer token}

```json
{ "firstname": "", "lastname": "", "mobile": "" }
```

## DELETE A CONTACT {DELETE REQUEST}

## `http://localhost:3000/api/users/contact/:CONNTACTID`

# This is an authenticated route and requires Authorization header as {Bearer token}

## GET A SINGLE CONTACT {GET REQUEST}

## `http://localhost:3000/api/users/contact/:CONNTACTID`

# This is an authenticated route and requires Authorization header as {Bearer token}

## GET ALL CONTACT {GET REQUEST}

## `http://localhost:3000/api/users/contact`

# This is an authenticated route and requires Authorization header as {Bearer token}
