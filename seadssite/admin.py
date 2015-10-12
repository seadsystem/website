from django.contrib import admin
from .models import Devices
from .models import Map
from seadssite.models import UserProfile
from seadssite.models import Document
# Register your models here.


admin.site.register(Devices)
admin.site.register(Map)
admin.site.register(UserProfile)

