from user import get_primary_email, auth_user
import falcon
import json

class Login(object):
    def on_get(self, req, resp):
        code = req.get_param('code', required=True, default='')
        if code == '':
            resp.status = falcon.HTTP_400
            resp.body = json.dumps({"status": "bad request"})
            return
        token = ''
        try:
            token = auth_user(code)
            if type(token) is not str or token == "None" or token == '':
                raise KeyError("token empy")
        except KeyError as s:
            resp.status = falcon.HTTP_500
            resp.body = json.dumps({"status": "server error","error":str(s)})
            return

        email = ''

        try:
            email = get_primary_email(token)
            if type(email) is not str or email == "None" or token == '':
                raise KeyError("token empy")
        except KeyError as s:
            resp.status = falcon.HTTP_500
            resp.body = json.dumps({"status": "server error","error":str(s)})
            return

        resp.status = falcon.HTTP_200
        resp.body = json.dumps({"status":"ok", "token":token, "email": email})