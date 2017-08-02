Dojo API
===============

## Get data user
To get data from a previous sign up user, go to:
https://us-central1-devf-dojo-admin.cloudfunctions.net/createuser

And send a JSON post request
```json
{
  	"uid": "YOUR_USER_UID"
}
```
If the user exists the API REST response is
```json
{
	"uid": "",
	"email": "",
	"emailVerified": ,
	"displayName": "",
	"photoURL": "",
	"disabled": ,
	"metadata": {
		"lastSignInTime": "",
		"creationTime": ""
	},
	"providerData": [
		{
			"uid": "",
			"displayName": "",
			"email": "",
			"photoURL": "",
			"providerId": "github.com"
		}
	]
}
```