from django.contrib.auth.models import User
from django.core.exceptions import FieldError
from django.test import TestCase

from seadssite.models import Device


class DeviceTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.Client = TestCase()
        cls.user1 = User.objects.create_user('test_user1', email='test1@test.com', password='passwordtest1')
        cls.user2 = User.objects.create_user('test_user2', email='test2@test.com', password='passwordtest2')
        cls.device2 = Device.objects.create(device_id=2, name='test_device1', user=cls.user1)
        cls.device3 = Device.objects.create(device_id=3, name='test_device2', user=cls.user2)
        cls.device4 = Device.objects.create(device_id=4, name='test_device3', user=cls.user1, is_active=False)
        cls.device5 = Device.objects.create(device_id=5, name='test_device3', user=cls.user2)


    def test_register_device(self):
        """Devices registration saves to db"""
        Device.objects.register_device(1, 'test_device1', self.user1)
        device = Device.objects.get(device_id=1)
        self.assertEqual(device.device_id, 1)
        self.assertEqual(device.name, 'test_device1')
        self.assertEqual(device.user, self.user1)

    def test_register_device_raises_device_already_registered(self):
        try:
            Device.objects.register_device(1, 'test_device1', self.user1)
            self.assertRaisesMessage(FieldError, 'This device has already been registered to this user.')
        except FieldError as e:
            print(e)

    def test_register_device_raises_device_registered_by_different_user(self):
        try:
            Device.objects.register_device(1, 'test_device1', self.user2)
            self.assertRaisesMessage(FieldError, 'This device has already been registered to a different user.')
        except FieldError as e:
            print(e)

    '''raise FieldError('This device has already been disactivated.', self)'''
    def test_deactivate_device(self):
        self.device2.deactivate_device()
        device = Device.objects.get(device_id=self.device2.device_id)
        self.assertEqual(self.device2.is_active, False)
        self.assertIsNone(device.user)

    def test_deactivate_device_raises_already_disactivated(self):
        try:
            self.device3.deactivate_device()
            self.device3.deactivate_device()
            self.assertRaisesMessage(FieldError, 'This device has already been disactivated.')
        except FieldError as e:
            print(e)

    def test_reactivate_device(self):
        self.device4.reactivate_device(self.user1)
        device = Device.objects.get(device_id=self.device4.device_id)
        self.assertEqual(self.device4.is_active, True)
        self.assertEqual(self.user1, device.user)

    def test_reactivate_device_raises_already_active(self):
        try:
            self.device5.reactivate_device(self.user1)
            self.assertRaisesMessage(FieldError, 'This device is currently active.')
        except FieldError as e:
            print(e)









