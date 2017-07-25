from falcon import testing
import app
import json

class StatusCase(testing.TestCase):
	def setUp(self):
		super(StatusCase, self).setUp()
		self.app = app.app

class TestApp(StatusCase):
	def test_get_status(self):
		doc = {u"status": u"ok"}
		result = self.simulate_get("/status")

		self.assertEqual(result.json, doc)

if __name__ == 'main':
	unittest.main()