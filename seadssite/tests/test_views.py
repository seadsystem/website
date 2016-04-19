import seadssite.views as v
from django.test import TestCase
from django.test import Client


class RegisterViewTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_get_register(self):
        response = self.client.get('/register')

        # Check that the response is 200 OK.
        self.assertEqual(response.status_code, 200)

        # Check that the rendered context contains 5 customers.
        self.assertEqual(len(response.context['customers']), 5)

