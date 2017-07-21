from dojo_api_v1 import dojo_api
from api import app as dojo_app

from flask import request
from flask_restplus import Resource

#import google.auth.transport.requests

test_ns = dojo_api.namespace('test', description='test operations')

@test_ns.route('/status')
class Status(Resource):
    def get(self):
        return {'status': 'OK'}

@test_ns.route('/echo')
class Echo(Resource):
    def get(self):
        return ('', 204)

@test_ns.route('/with-query/', endpoint='with-query')
class WithParserResource(Resource):
    parser = dojo_api.parser()
    parser.add_argument('name', type=int, help='Some name', location='query')

    @dojo_api.doc(parser=parser)
    def get(self):
        return {'hello': request.args.get("name")}
