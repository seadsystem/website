from __future__ import print_function
import sys
from functools import partial
from django.contrib.auth.models import User
from django.db import models
from django.core.exceptions import FieldError

'''
error function for adding errors to stdrr
'''
error = partial(print, sys.stderr)

'''
Model Manager for doing table actions on devices. Extends base model manager class to include method
for registering (creating) devices
'''
class DeviceManager(models.Manager):
    def register_device(self, device_id, device_name, current_user):

        if Device.objects.all().filter(user=current_user, device_id=device_id):
            raise FieldError('This device has already been registered to this user.', device_id, current_user)
        elif Device.objects.all().filter(device_id=device_id, is_active=True):
            raise FieldError('This device has already been registered to a different user.', device_id)
        try:
            newDevice = Device(device_id=device_id, name=device_name, user=current_user)
            newDevice.save()

        except FieldError as fieldError:
            errString = str(type(fieldError)) + ": " + str(fieldError.message)
            error(errString)

        except (ValueError, TypeError):
            error("Invalid Device ID")

'''
model for SEADS devices like the SEADS plug, eGuage etc
# Required fields
# 	- device_id  (primary_key) corresponds to a device id in the data_raw table
#	- name       (string) 	   name of devices, defaults to 'Seads Device'
# Foreign keys
# 	- user_id    (ForeignKey) corresponds to the user who 'owns' this device, allows null (device has not been registered)
'''

class Device(models.Model):
    device_id = models.IntegerField(primary_key=True, unique=True)
    name = models.CharField(max_length=200, default='Seads Device')
    connection = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    user = models.ForeignKey(User, null=True)
    objects = DeviceManager()

    '''
    # deativate_device()
    # Summary: This will deactivate the device which removes it from view,
    # doesn't do a full delete, as this would cause problems with foreign keys
    '''
    def deactivate_device(self):
        if Device.objects.filter(device_id = self.device_id, is_active=False):
            raise FieldError('This device has already been disactivated.', self)
        self.user = None
        self.is_active = False
        self.save()

    '''
    # reactivate_device()
    # Summary: This will reactivate the device which removes has already been deactivated,
    '''
    def reactivate_device(self, user):
        if Device.objects.filter(device_id = self.device_id, is_active=True):
            raise FieldError('This device is currently active.', self)
        self.user = user
        self.is_active = True
        self.save()




'''
model for Images displayed on the site
'''
# Required Fields
#	- docfile (file)       corrensponds to a file upload path
class Document(models.Model):
    docfile = models.FileField(upload_to='documents/%Y/%m/%d')
