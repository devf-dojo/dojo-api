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
	"bio": "",
	"phone": "",
	"interests": ["", ""],
	"hobbies": ["", ""],
	"website": "",
	"facebook":"",
	"twitter":"",
	"linkedin":"",
	"github":"",
	"lenguages": ["", ""]
}
```

## Get CV

GET: api/v1/dojo/users/{uid}/cv
Header: Bearer <JWT>