import unittest
import main
import endpoints
from hamcrest import *
from protorpc import message_types


class EstatusTest(unittest.TestCase):
	def test_status(self):
		api = main.DojoApi()
		response = api.status(message_types.VoidMessage())
		assert_that(response.status, equal_to("OK"))

if __name__ == '__main__':
    unittest.main()