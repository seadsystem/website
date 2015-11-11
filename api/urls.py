from django.conf.urls import patterns, include, url
from rest_framework.urlpatterns import format_suffix_patterns
from api import views

urlpatterns = patterns('seadssite',
    url(r'^api/docs/', include('rest_framework_swagger.urls')),
    url(r'^api/device/(?P<device_id>[0-9]+)/raw_query$',
        views.RawQuery.as_view()),
    url(r'^api/device/(?P<device_id>[0-9]+)/(?P<power_type>consumed_power|generated_power)$',
        views.TotalPower.as_view()),
)


urlpatterns = format_suffix_patterns(urlpatterns)