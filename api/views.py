from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import exceptions
from .api_exceptions import ServiceUnavalibleException
import requests

import sys

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


class ConsumedPower(APIView):
    permission_classes = []
    allowed_parameters = ['start_time', 'end_time']
    devices = ['Panel1', 'Panel2', 'Panel3', 'shed ', 'PowerS', 'PowerG']

    def get(self, request, device_id):
        params = request.GET.dict()
        print(str(params))
        if len(params) > len(self.allowed_parameters):
            raise exceptions.ParseError(detail = "Too many request parameters.")
        else:
            for param in params:
                if param not in self.allowed_parameters:
                    raise exceptions.ParseError(detail = "Query param: <" + param +"> is not allowed.")

        url = "http://db.sead.systems:8080/" + device_id
        start_time = params['start_time']
        end_time = params['end_time']
        params = dict()
        params['type'] = 'P'

        try:
            params["start_time"] = start_time
            params["end_time"] = start_time
            params['device'] = 234
            responseStart = requests.get(url, params)
            print(responseStart.content)
            params["start_time"] = end_time
            params["end_time"] = end_time
            responseEnd = requests.get(url, params)
        except requests.exceptions.ConnectionError as connection:
            raise ServiceUnavalibleException(connection)
        except requests.exceptions.Timeout as timeout:
            raise ServiceUnavalibleException(timeout)
        except requests.exceptions.RequestException as request:
            raise BadRequest(request)
        '''
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
        '''
        return Response({"status": 200, "data": 'awesome'})
