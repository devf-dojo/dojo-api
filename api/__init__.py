from Flask import Flask
from flask_swagger import swagger
import flask_cors

app_name = __name__
app = Flask(app_name)
app.config['SWAGGER_UI_JSONEDITOR'] = True
app.config['RESTPLUS_VALIDATE'] = True

swagger(app)

flask_cors.CORS(app)
