from django.contrib.auth.models import User
from django.db import models

'''
model for SEADS devices like the SEADS plug
'''

#Devices need an ID and a name
#additionaly, for information to be easily accessible to users, create "connetion" and "power"
#variable that will be shown. Connection will tell the user if something is connected and power will tell
#the surrent power usage.
class Devices(models.Model):
	device_id = models.IntegerField()
	name = models.CharField(max_length=200, default='DEFAULT VALUE')
	connection = models.BooleanField(default=True)
	power = models.BooleanField(default=False)
	apptype = models.CharField(max_length=200, default=0)

''' 
Relational map between a user and a device
'''
#This is the way we map between users and device, simply foreign keys, one from User and one from Devices
class Map(models.Model):
	user = models.ForeignKey(User)
	device = models.ForeignKey(Devices)


'''
Model for an extended user profile
'''
#A user needs all the fields specified in User (in forms)
#and a valid phone number and cellProvider. 
class UserProfile(models.Model):
    user = models.OneToOneField(User)
    phone = models.CharField(max_length=10)
    cellProvider = models.CharField(max_length=20)



#Images model
class Document(models.Model):
    docfile = models.FileField(upload_to='documents/%Y/%m/%d')