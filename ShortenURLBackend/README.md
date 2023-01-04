## Running the app

```bash
# Run
$ npm run start

# Run in watch mode
$ npm run start:dev

# change your database
In the file app.module.ts replace your Mysql
```

## Test API

```bash
# api register
API: http://localhost:3000/users/register
Method: POST
Data: {
    username:"username",
    password:"password"
}

# api login
http://localhost:3000/auth/login
Method: POST
Body: {
    username:"username",
    password:"password"
}
Headers: {
    'Authorization': 'Bearer ' + access_token
}

# api logout
http://localhost:3000/auth/logout/:username
Method: GET

# api refresh token
http://localhost:3000/auth/refresh-token/:username
Method: GET
Headers: {
    'Authorization': 'Bearer ' + refresh_token
}

# api get URL from shorten link
http://localhost:3000/shortenlink/:shortentlink
Method: GET

# api enable shorten link
http://localhost:3000/shortenlink/:shortentlink/enable
Method: GET
Headers: {
    'Authorization': 'Bearer ' + access_token
}

# api disable shorten link
http://localhost:3000/shortenlink/:shortentlink/disable
Method: GET
Headers: {
    'Authorization': 'Bearer ' + access_token
}

# api create shorten link
http://localhost:3000/shorten-link/create
Method: POST
Headers: {
    'Authorization': 'Bearer ' + access_token
}

# api get shorten-link history
http://localhost:3000/shorten-link/create/history
Method: GET
Headers: {
    'Authorization': 'Bearer ' + access_token
}

# api get package shorten-link plan
http://localhost:3000/shorten-link/package
Method: GET

# api get a package in shotern-link plan
http://localhost:3000/shorten-link/package/:packagename
Method: GET

# api create a package shorten-link
http://localhost:3000/shorten-link/package/create
Method: POST

# api register a package
http://localhost:3000/shorten-link/registration/add
Method: POST
Headers: {
    'Authorization': 'Bearer ' + access_token
}
Body: {
    "packagename":"packagename"
    "packagetime": 3
}
# api get payment
http://localhost:3000/shorten-link/registration/payment
Method: POST
Headers: {
    'Authorization': 'Bearer ' + access_token
}
Body: {
    "packagename":"packagename"
    "packagetime": 3
}

# api get history of registration
http://localhost:3000/shorten-link/registration/history
Method: GET
Headers: {
    'Authorization': 'Bearer ' + access_token
}

# api cancel registration a package
http://localhost:3000/shorten-link/registration/:packagename
Method: DELETE
Headers: {
    'Authorization': 'Bearer ' + access_token
}

# api extend a package
http://localhost:3000/shorten-link/registration/extend
Method: POST
Headers: {
    'Authorization': 'Bearer ' + access_token
}
Body: {
    "packagename":"packagename"
    "packagetime": 3
}

# api get status packages of user
http://localhost:3000/shorten-link/registration/information
Method: GET
Headers: {
    'Authorization': 'Bearer ' + access_token
}

# api get max number link of user
http://localhost:3000/shorten-link/registration/max-number-link
Method: GET
Headers: {
    'Authorization': 'Bearer ' + access_token
}

```
