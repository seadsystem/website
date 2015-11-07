from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from statsd.defaults.django import statsd
from rest_framework.response import Response
from django.http import JsonResponse


class DeviceDataAPI(APIView):
    permission_classes = []


    def get(self, request, *args, **kwargs):
        print(str(request))
        return Response({"success": True, "content": "Hello World"})

