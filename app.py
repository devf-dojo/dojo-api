import falcon
from server.server import Server
from login.login import Login

app = falcon.API()


status = Server()
login = Login()

app.add_route('/status', status)
app.add_route('/', login)
