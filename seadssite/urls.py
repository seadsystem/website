from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from seadssite import views as v

admin.autodiscover()

urlpatterns = [
               url(r'^login/$', 'django.contrib.auth.views.login'),
               url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}),
               url(r'^admin/', include(admin.site.urls)),
               url(r'^accounts/password/reset/$', 'django.contrib.auth.views.password_reset',
                   {'post_reset_redirect': '/accounts/password/reset/done/'}),
               url(r'^accounts/password/reset/done/$', 'django.contrib.auth.views.password_reset_done'),
               url(r'^accounts/password/reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>.+)/$',
                   'django.contrib.auth.views.password_reset_confirm',
                   {'post_reset_redirect': '/accounts/password/done/'}),
               url(r'^accounts/password/done/$', 'django.contrib.auth.views.password_reset_complete'),
               url(r'^$', v.IndexView.as_view()),
               url(r'^dashboard/$', v.DashboardView),
               url(r'^dashboard/[0-9]+/$', v.graph),
               url(r'^dashboard/[0-9]+/timer/$', v.TimerView),
               url(r'^dashboard/[0-9]+/appliances/$', v.DevicesView),
               url(r'^register', v.RegisterView.as_view()),
               url(r'^help/$', v.help),
]
