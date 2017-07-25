import simplejson as json_build
import logging

try:
    from google.appengine.api import urlfetch
except:
    import urlfetch

from keys import CLIENT_ID, CLIENT_SECRET

# https://github.com/login/oauth/authorize?scope=user:email&client_id={}
URL_AUTH = "https://github.com/login/oauth/access_token?client_id={}&client_secret={}&code={}&accept=json"
URL_EMAIL = "https://api.github.com/user/emails?access_token={}"

headers_auth = {
    'Accept': 'application/json',
    'X-OAuth-Scopes': 'user:email',
}
headers = {
    'Accept': 'application/json',
}

def raise_in_error(val, r, json):
    if val is False or (r.status_code < 200 or r.status_code >= 300):
        raise KeyError("{}: {}".format(str(json.get('error_description')), str(json.get('error_uri'))))

#class User:
def auth_user(code):
    url = URL_AUTH.format(
        CLIENT_ID,
        CLIENT_SECRET,
        code
    )
    try:
        result = urlfetch.fetch(
            url=url,
            method=urlfetch.POST,
            headers=headers_auth
        )
        r = result

    except urlfetch.Error:
        logging.exception('Caught exception fetching url')
        r = {
           status_code: 500,
           content: '{}'
        }

    print (r.status_code)
    print (r.content)

    json = json_build.loads(r.content)

    token = str(json.get('access_token', ''))

    raise_in_error(type(token) is str, r, json)
    return token

def get_primary_email(token):
    """
    get the primary key for the current user
    """

    url = URL_EMAIL.format(token)

    try:
        result = urlfetch.fetch(
            url=url,
            headers=headers
        )
        r = result

    except urlfetch.Error:
        logging.exception('Caught exception fetching url')
        r = {
           status_code: 500,
           content: '{}'
        }

    print (r.status_code)
    print (r.content)

    json = json_build.loads(r.content)
    emails = json

    raise_in_error(type(emails) is list, r, json)

    for email in emails:
        if email['primary'] is True:
            return str(email['email'])

    for email in emails:
        if email['verified'] is True:
            return str(email['email'])

    return ""
