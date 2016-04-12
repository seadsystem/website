from django.contrib import admin
from .models.models import Device
from seadssite.models.models import UserProfile
from seadssite.models.models import Document

admin.site.register(Device)
admin.site.register(UserProfile)
admin.site.register(Document)