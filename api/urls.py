from django.conf.urls import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns
from api import views

urlpatterns = patterns('seadssite',
    url(r'^api/device/(?P<device_id>[0-9]+)/raw_query$',
        views.RawQuery.as_view()),
    url(r'^api/device/(?P<device_id>[0-9]+)/consumed_power$',
        views.ConsumedPower.as_view()),
)


urlpatterns = format_suffix_patterns(urlpatterns)