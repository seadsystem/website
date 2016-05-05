from django.contrib import admin

from seadssite.models import Device
from seadssite.models import Document

admin.site.register(Device)
admin.site.register(Document)