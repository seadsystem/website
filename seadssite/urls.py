from django.conf.urls import patterns, url
from seadssite import views as v

urlpatterns = patterns('seadssite',
                       url(r'^$', v.IndexView.as_view()),
                       url(r'^devices/', v.DevicesView),
                       url(r'^dashboard/', v.DashboardView),
                       url(r'^register/$', v.register),
                       url(r'^help/$', v.help),
                       url(r'^visualization/([0-9]*)/$', v.VisualizationView),
                       url(r'^list/$', 'views.list', name='list'))
