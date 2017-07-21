from flask import Flask, Blueprint
from flask_restplus import Api
from api import app, app_name

dojo_blueprint = Blueprint('api', app_name, url_prefix='/dojo/api/v1')
dojo_api = Api(
    dojo_blueprint,
    doc='/doc/',
    version='1',
    title='Dojo API',
    description='The API of the Dojo',
    default='Dojo',
    default_label='Dojo namespace',
)

app.register_blueprint(dojo_blueprint)
