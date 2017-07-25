import falcon 
import json

class Server(object):
	def on_get(self, req, resp):
		resp.status = falcon.HTTP_200
		resp.content_type = "application/json"
		resp.body = json.dumps({"status":"ok"})

		