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
	"cintas" : [
		{"cinta":"", "batch":14}
	],
	"skills": ["", ""],
	"bio": "",
	"telefono": "",
	"interests": ["", ""],
	"hoobies": ["", ""],
	"website": "",
	"social": {
			"facebook":"",
			"twitter":"",
			"linkedin":"",
			"github":"",
		},
	"lenguages": ["", ""]
}
```

## Get CV

GET: api/v1/dojo/users/{uid}/cv
Header: Bearer <JWT>