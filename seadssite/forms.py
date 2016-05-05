from django import forms
from django.contrib.auth.models import User
from django.core.validators import RegexValidator

# we should use email validation: http://stackoverflow.com/questions/3217682/checking-validity-of-email-in-django-python
# http://stackoverflow.com/questions/20192144/creating-custom-user-registration-form-django

'''
What the user must contain to be valid
'''

class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control overrideit'}))
    first_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control overrideit'}), min_length=1, max_length=20, required=True,
        validators=[
            # what if someones legal name has numbers? this seems weird and unnecessary
            RegexValidator(
                regex='^[a-zA-Z]*$',
                message='First name must not include numbers',
                code='invalid_username'
            ),
        ]
    )
    last_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control overrideit'}), min_length=1, max_length=20, required=True,
        validators=[
            # what if someones legal name has numbers? this seems weird and unnecessary
            RegexValidator(
                regex='^[a-zA-Z]*$',
                message='Last name must not include numbers',
                code='invalid_username'
            ),
        ]
    )
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control overrideit'}), min_length=4, max_length=50, required=True)
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control overrideit'}), min_length=4, max_length=220, required=True)

    # there is an occasional bug where clickable ranges change when this changes ^. Here
    # is the original settings before in case this bug occurs.
    # password = forms.CharField(widget=forms.PasswordInput())
    # first_name = forms.CharField(required = True)
    # last_name = forms.CharField(required = True)
    # username = forms.CharField(required = True)
    # email = forms.EmailField(required = True)
    # allow fields to be checked by looking at "User"
    class Meta:
        model = User
        fields = ('username', 'first_name','last_name', 'email', 'password')


# How the native password reset needs to work
class PasswordResetRequestForm(forms.Form):
    email = forms.CharField(label="Enter Email", max_length=254)


# handles image upload
class DocumentForm(forms.Form):
    docfile = forms.FileField(
        label='Select a file',
        help_text='max. 42 megabytes'
    )
