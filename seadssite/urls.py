from django.conf.urls import patterns, url

urlpatterns = patterns('seadssite.views',
    url(r'^list/$', 'list', name='list'),
)