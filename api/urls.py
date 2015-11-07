from django.conf.urls import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns
from api import views

urlpatterns = patterns('seadssite',
    url(r'^api/device/([0-9]+)', views.DeviceDataAPI.as_view()))

urlpatterns = format_suffix_patterns(urlpatterns)