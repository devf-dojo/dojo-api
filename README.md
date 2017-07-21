Dojo-Api
========

## Installation
In the root directory
```
mkdir lib
pip install -t lib -r requirements.txt
```

## Run app

Open **app.yaml** and config the **ENDPOINTS_SERVICE_NAME** to set your hostname.

If you want to deploy on local use the next command:
```
dev_appserver.py --port=8080 .
```

## Test

Go to your **localhost:8080**
```
/dojo/api/v1/status
```
And the response will be
```json
{
    "status": "OK"
}
```