import seadssite.views as v
from django.test import TestCase
from django.test import Client
from django.contrib.auth.models import User


class RegisterViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create_user(username='testuser', password='password')


    def test_get_register(self):
        """Test that the registration page can be accessed while not being logged in"""
        response = self.client.get('/register')
        # Check that the response is 200 OK.
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/register.html')

    def test_get_register_while_logged_in(self):
        """Test that navigating to the registration page while logged in redirects you to the dashboard"""
        self.client.login(username=self.user1.username, password='password')
        response = self.client.get('/register')
        self.assertEqual(response.status_code, 302)
        self.assertTemplateNotUsed(response, 'registration/register.html')

    def test_register_valid_form(self):
        """Test that registering with valid information works and redirects you appropriately"""
        response = self.client.post('/register', data={
            'username': 'tester',
            'email': 'test@seads.com',
            'first_name': 'testy',
            'last_name': 'testerson',
            'password': 'password'
        })
        self.assertEqual(response.status_code, 302)
        user = User.objects.get(username='tester')
        self.assertEqual(user.username, 'tester')
        self.assertEqual(user.email, 'test@seads.com')
        self.assertEqual(user.first_name, 'testy')
        self.assertEqual(user.last_name, 'testerson')

    def test_register_with_invalid_email(self):
        response = self.client.post('/register', data={
            'username': 'tester',
            'email': 'test@seadscom',
            'first_name': 'testy',
            'last_name': 'testerson',
            'password': 'password'
        })

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Enter a valid email address.')

    def test_register_without_password(self):
        response = self.client.post('/register', data={
            'username': 'tester',
            'email': 'test@seadscom',
            'first_name': 'testy',
            'last_name': 'testerson'
        })

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'This field is required.')

    def test_register_with_invalid_username(self):
        response = self.client.post('/register', data={
            'username': 'testuser',
            'email': 'test@seadscom',
            'first_name': 'testy',
            'last_name': 'testerson',
            'password': 'password'
        })

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'A user with that username already exists.')


class DashboardViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create_user(username='testuser', password='password')

    def test_get_dashboard(self):
        self.client.login(username=self.user1.username, password='password')
        response = self.client.get('/dashboard/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Registered Device')

    def test_get_dashboard_while_not_logged_in(self):
        response = self.client.get('/dashboard/')
        self.assertEqual(response.status_code, 302)
        self.assertContains(response.url, '/login/?next=/dashboard/')

    def test_post_new_device(self):
        self.client.login(username=self.user1.username, password='password')
        response = self.client.post('/dashboard/', data={
            'device_id': '12345678',
            'device_name': 'test_device'
        })
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.context['devices']), 0)
