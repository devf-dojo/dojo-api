from dojo_api_v1 import dojo_api
from flask_restplus import Resource

dojo_ns = dojo_api.namespace('dojo', description='dojo operations')


@dojo_ns.route('/get_author/<id>')
@dojo_ns.doc(params={'id': 'An ID'})
class SmokeTest(Resource):

    def get(self):
        return ({}, 200)