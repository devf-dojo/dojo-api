from flask_testing import TestCase

from main import app


class MasterTest(TestCase):
    """
    This is the Master Class for all test suites.
    """
    def create_app(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.app.config['DEBUG'] = True

        return self.app

    def setUp(self):
        self.client = self.app.test_client()

    def tearDown(self):
        pass