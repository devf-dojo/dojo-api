import endpoints
from protorpc import message_types, messages, remote
import os

class StatusResponse(messages.Message):
    status = messages.StringField(1)

class Env(messages.Message):
    name = messages.StringField(1)
    value = messages.StringField(2)

class EnvResponse(messages.Message):
    env = messages.MessageField(Env, 1, repeated=True)

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

    @endpoints.method(
        message_types.VoidMessage,
        message_types.VoidMessage,
        path='echo',
        http_method='GET',
        name='echo')
    def echo(self, request):
        return message_types.VoidMessage()

    @endpoints.method(
        message_types.VoidMessage,
        EnvResponse,
        path='env',
        http_method='GET',
        name='get_env')
    def get_env(self, request):
        envs = os.environ
        env_list = []
        for name, value in envs.items():
            env_list.append(Env(name=str(name), value=str(value)))

        return EnvResponse(env=env_list)

api = endpoints.api_server([DojoApi])