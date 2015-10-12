from seadssite.models import UserProfile 
from django.contrib.auth.models import User
from django import forms
from django.contrib.auth.views import password_reset
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
#we should use email validation: http://stackoverflow.com/questions/3217682/checking-validity-of-email-in-django-python
#http://stackoverflow.com/questions/20192144/creating-custom-user-registration-form-django

'''
What the user must contain to be valid
'''
#Required feilds for a user -- just used every field from the original SEADS site to maintain what Ali wanted
class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())
    first_name = forms.CharField(min_length=3, max_length=20, required = True, 
        validators=[
        RegexValidator(
            regex='^[a-zA-Z]*$',
            message='First name must not include numbers',
            code='invalid_username'
        ),
    ])
    last_name = forms.CharField(min_length=3, max_length=20, required = True, 
        validators=[
        RegexValidator(
            regex='^[a-zA-Z]*$',
            message='Last name must not include numbers',
            code='invalid_username'
        ),
    ])
    username = forms.CharField(min_length=4, max_length=20, required = True)
    email = forms.EmailField(min_length=4, max_length=20, required = True)
    phone = forms.CharField(min_length=7, required = True, 
        validators=[
        RegexValidator(
            regex='\(?([0-9][0-9][0-9])?\)?[0-9][0-9][0-9]\-?[0-9][0-9][0-9][0-9]$',
            message='Please enter a valid phone number.',
            code='invalid_username'
        ),
    ])
    cellProvider = forms.CharField(required = True)

    #there is an occasional bug where clickable ranges change when this changes ^. Here
    #is the original settings before in case this bug occurs. 
    #password = forms.CharField(widget=forms.PasswordInput())
    #first_name = forms.CharField(required = True)
    #last_name = forms.CharField(required = True)
    #username = forms.CharField(required = True)
    #email = forms.EmailField(required = True)
    #phone = forms.CharField(required = True)
    #cellProvider = forms.CharField(required = True)
    #allow fields to be checked by looking at "User"
    class Meta:
    	model = User
    	fields = ('username', 'first_name','last_name', 'email', 'password')

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ('phone', 'cellProvider')


#How the native password reset needs to work
class PasswordResetRequestForm(forms.Form):
    email = forms.CharField(label=("Enter Email"), max_length=254)


#handles image upload
class DocumentForm(forms.Form):
    docfile = forms.FileField(
        label='Select a file',
        help_text='max. 42 megabytes'
    )