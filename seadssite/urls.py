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
    url(r'^authenticate', v.AuthenticateView),
    url(r'^dashboard_test/$', v.DashboardTest.as_view()),
]
