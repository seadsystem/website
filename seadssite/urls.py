from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from seadssite import views as v

admin.autodiscover()

urlpatterns = [
    url(r'^logout/', v.LogoutView),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', v.IndexView.as_view()),
    url(r'^dashboard/$', v.DashboardView),
    url(r'^dashboard/(?P<device_id>[0-9]+)/$', v.graph),
    url(r'^dashboard/[0-9]+/timer/$', v.TimerView),
    url(r'^dashboard/[0-9]+/appliances/$', v.DevicesView),
    url(r'^authenticate', v.AuthenticateView)
]
