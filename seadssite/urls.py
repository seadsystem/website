from django.conf.urls import patterns, url
from seadssite import views as v

urlpatterns = patterns('seadssite',
                       url(r'^$', v.IndexView.as_view()),
                       url(r'^dashboard/$', v.DashboardView),
                       url(r'^dashboard/(?P<device_id>[0-9]+)/$', v.VisualizationView),
                       url(r'^dashboard/[0-9]+/appliances/$', v.DevicesView),
                       url(r'^help/$', v.help),
                       url(r'^list/$', 'views.list', name='list'),
                       url(r'^graph/$', 'views.graph', name='graph'))
