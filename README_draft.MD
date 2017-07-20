# TT MVP
## This is an MVP that works as an API and a WebApp in the same App Engine Project.

### Api Blueprint 
#### which has a route prefix: ```/api```. This is the Blueprint of the REST API where all clients are going to ask for data.  

### Web Blueprint
#### Covers all requests to other routes different than te API


0. [Install Google App Engine SDK for python.](https://cloud.google.com/appengine/downloads)

0. Install virtualenv
```sudo pip install virtualenv```

0. Create a new virtual env directory named venv.
```
virtualenv venv --python python2.7
```
0. Activate it
```
source venv/bin/activate
```
0. Install requirements:
```
pip install -r requirements.txt
```

0. Install dependencies for GAE:
```
pip install -r requirements.txt -t lib
```

0. Run this to start smoke tests, using GAE plugin for nose:
```
nosetests --with-gae [directory]
```

0. You should see something like this:
```
..
----------------------------------------------------------------------
Ran 2 tests in 0.388s
```

0. Run this to start the dev server:
```
dev_appserver.py .
```

Go to ```/_t/smoke``` and you should see something like this:
```
{
  "foo": "bar"
}
```



