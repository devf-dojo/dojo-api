Dojo-Api
========

## Installation
In the root directory
```
pip install -r requirements.txt
```

## Run app

Run the next command
```
gunicorn app:app
```
Go to http://127.0.0.1:8000/status

You will get the next response
```
{"status": "ok"}
```

## Testing
Run the next command
```
python -m unittest -v test
```