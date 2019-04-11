from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
                       url(r'^$', 'biblestats.views.biblestats'),
                       url(r'^data/bible.csv$', 'biblestats.views.bible_csv'),
                       url(r'^data/chapters.csv$', 'biblestats.views.chapters_csv'),
                       url(r'^admin/', include(admin.site.urls)),
                       )
