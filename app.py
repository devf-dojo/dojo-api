import falcon
from server.server import Server

app = falcon.API()

status = Server()

app.add_route('/status', status)