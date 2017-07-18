import endpoints
from protorpc import message_types, messages, remote

class StatusResponse(messages.Message):
	status = messages.StringField(1)

@endpoints.api(name="dojo", version="v1")
class DojoApi(remote.Service):

	@endpoints.method(
		message_types.VoidMessage,

		StatusResponse,

		path='status',
		http_method='GET',
		name='status')
	def status(self, request):
		return StatusResponse(status='OK')

api = endpoints.api_server([DojoApi])