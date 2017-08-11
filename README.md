Dojo API
===============
API: https://us-central1-devf-dojo-admin.cloudfunctions.net/

## To config the env run:
```
firebase functions:config:set github.public "YOUR GITHUB CLIENT ID"
firebase functions:config:set github.secret "YOUR GITHUB PRIVATE KEY"
```

## To Get the env localy run:
```
firebase functions:config:get > .runtimeconfig.json
```

## Login with Github
GET: v1/dojo/auth/github/login?code=<your code>

#### HTTP Codes
- 403 Code not valid or was expired


## Create CV

POST: api/v1/dojo/users/{uid}/cv
Header: Bearer <JWT>

```json
{
	"name":"",
	"email":"",
	"photo" : "",
	"belts" : [
		{"belt":"", "batch":14}
	],
	"skills": ["", ""],
	"biography": "",
	"phone": "",
	"interests": ["", ""],
	"hobbies": ["", ""],
	"website": "",

	"facebook":"",
	"twitter":"",
	"linkedin":"",
	"github":"",

	"languages": ["", ""]
}
```
#### HTTP Codes
- 201 Created

- 404 The cv info was not found in the database

## Get CV

GET: api/v1/dojo/users/{uid}/cv
Header: Bearer <JWT>


## Update CV
PUT: api/v1/dojo/users/{uid}/cv
Header: Bearer <JWT>

#### HTTP Codes
- 400 Bad Request

- 403 Unauthorized | Invalid cv the changes not have effects
- 404 The cv info was not found in the database
- 201 Updated



