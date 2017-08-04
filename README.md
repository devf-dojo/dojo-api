Dojo API
===============
API: https://us-central1-devf-dojo-admin.cloudfunctions.net/

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