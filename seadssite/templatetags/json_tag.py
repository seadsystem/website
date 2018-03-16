import simplejson

from django import template

register = template.Library()

@register.filter
def dumpjson(data):
    return simplejson.dumps(data)

