from django.contrib import admin

from seadssite.models import Device
from seadssite.models import Document
from seadssite.models import UserProfile

admin.site.register(Device)
admin.site.register(UserProfile)
admin.site.register(Document)