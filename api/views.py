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
    devices = ['Panel1', 'Panel2', 'Panel3']

    def get(self, request, device_id):
        params = request.GET.dict()
        for param in params:
            if param not in self.allowed_parameters:
                raise ValueError('Query parameter not allowed: ', param)

        start_time = request.GET.get('start_time')
        end_time = request.GET.get('end_time')
        url = "http://db.sead.systems:8080/" + device_id

        params = dict()
        params['type'] = 'P'
        responseStart = []
        responseEnd = []

        for device in self.devices:
            params['device'] = device
            params['start_time'] = start_time
            params['end_time'] = start_time
            responseStart.append(requests.get(url, params).json())
            params['start_time'] = end_time
            params['end_time'] = end_time
            responseEnd.append(requests.get(url, params).json())

        def filter_out_irrelavant_values(time_item):
            time_item.pop(0)
            return time_item[0][1]

        start_arr = list(map(filter_out_irrelavant_values, responseStart))
        end_arr = list(map(filter_out_irrelavant_values, responseEnd))

        total_power = 0

        for i, power in enumerate(start_arr):
            total_power += -int(end_arr[i]) + int(power)

        print(total_power)


        # for power in total_power_arr:
         #   total_power += power

        print("power1: ", start_arr)
        print("power2: ", end_arr)
        print("total_power: ", total_power)

        return Response({"status": 200, "data": total_power})
