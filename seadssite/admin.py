from django.contrib import admin
from .models import Device
from seadssite.models import UserProfile
from seadssite.models import Document

admin.site.register(Device)
admin.site.register(UserProfile)
admin.site.register(Document)