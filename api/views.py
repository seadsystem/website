from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
import requests

'''
Acts as a router to the db.sead.systems:8080 api, nothing more.
you can pass in any of the supported query parameters
('type', 'start_time', 'end_time', 'device', 'diff', 'subset', 'limit', 'json')
ex.
localhost:8000/api/device/:device_id/raw_query?limit=50&type=F&diff=1
'''

class RawQuery(APIView):
    permission_classes = []
    allowed_parameters = ['type', 'start_time', 'end_time', 'device',
                      'diff', 'subset', 'limit', 'json']

    def get(self, request, device_id):
        params = request.GET.dict()

        for param in params:
            if param not in self.allowed_parameters:
                raise ValueError('Query parameter not allowed: ', param)

        response = requests.get("http://db.sead.systems:8080/" + device_id, params=params)
        response.raise_for_status()

        return Response({"status": response.status_code , "data": response.json()})


'''
Calculates the total power usage for a particular device over some time period
include start_time and end_time as query paramers in api call. Start and end times
must be utc unix timestamps

'''

class TotalDevicePower(APIView):
    permission_classes = []
    allowed_parameters = ['start_time', 'end_time']

    def get(self, request, device_id):
        params = request.GET.dict()

        for param in params:
            if param not in self.allowed_parameters:
                raise ValueError('Query parameter not allowed: ', param)

        params['type'] = 'P'
        response = requests.get("http://db.sead.systems:8080/" + device_id, params=params)

        return Response({"status":"helllo", "data": "cool dudee"})
