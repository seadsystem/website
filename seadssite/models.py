from django.contrib.auth.models import User
from django.db import models
from django.core.exceptions import ValidationError

'''
model for SEADS devices like the SEADS plug, eGuage etc
'''
# Required fields
# 	- device_id  (primary_key) corresponds to a device id in the data_raw table
#	- name       (string) 	   name of devices, defaults to 'Seads Device'
# Foreign keys
# 	- user_id    (ForeignKey) corresponds to the user who 'owns' this device

class Device(models.Model):
	device_id = models.IntegerField(primary_key=True, unique=True)
	name = models.CharField(max_length=200, default='Seads Device')
	connection = models.BooleanField(default=True)
	user = models.ForeignKey(User)

	'''
	Summary: This registers a device to a user
	param device_id: (primary key)
	param device_name: (a name for the device)
	param current_user: (forgeign key, user device is related to)
	'''
	def save(self, *args, **kwargs):
	    #check if device is already registered to this user
	    if: Device.objects.all().filter(user=self.user, device_id=self.device_id)
	        raise ValidationError('This device has already been registered to this user.', self.device_id, self.user)
	    elif: Device.objects.all().filter(device_id=device_id)
			raise ValidationError('This device has already been registered to a different user', self.device_id)
		else:
	    	super(Device, self).save(*args, **kwargs)

	def get_device_data(self)
'''
Model for an extended user profile
'''
# Required Fields
# 	- user (OneToOneField) corresponds to a django user, used for authentication
#						   documentation at
#						   https://docs.djangoproject.com/en/1.8/ref/contrib/auth/
# 	- phone (string)       corresponds to the users phone number
# 	- cell_provider 	   corresponds to the cell service provider of the users
#						   cell phone number
class UserProfile(models.Model):
    user = models.OneToOneField(User, primary_key=True)
    phone = models.CharField(max_length=10)
    cell_provider = models.CharField(max_length=20)



'''
model for Images displayed on the site
'''
# Required Fields
#	- docfile (file)       corrensponds to a file upload path
class Document(models.Model):
    docfile = models.FileField(upload_to='documents/%Y/%m/%d')
