Dojo API
===============

## Get data user
To get data from a previous sign up user, go to:
https://us-central1-devf-dojo-admin.cloudfunctions.net/api/v1/dojo/get_user

And send a JSON post request
```json
{
  	"uid": "YOUR_USER_UID"
}
```
If the user exists the API REST response is
```json
{
    "uid": "THE_USER_ID",
    "jwt": "JSON_WEB_TOKEN"
}
```