from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^login/$', 'django.contrib.auth.views.login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}),
    url(r'^api/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/password/reset/$', 'django.contrib.auth.views.password_reset', 
        {'post_reset_redirect' : '/accounts/password/reset/done/'}),
    url(r'^accounts/password/reset/done/$', 'django.contrib.auth.views.password_reset_done'),
    url(r'^accounts/password/reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>.+)/$',
        'django.contrib.auth.views.password_reset_confirm',
        {'post_reset_redirect' : '/accounts/password/done/'}),
    url(r'^accounts/password/done/$', 'django.contrib.auth.views.password_reset_complete'),
    url(r'^', include('seadssite.urls')),
    url(r'^', include('api.urls')),
        ) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
