from . import *


class TestSmoke(MasterTest):
    def setUp(self):
        self.response = self.client.get(SMOKE_ULR)

    def test_200_ok(self):
        self.assert200(self.response)
