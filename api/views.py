from rest_framework import permissions
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import exceptions
from .api_exceptions import ServiceUnavalibleException
import requests


class RawQuery(APIView):
    """
    Acts as a router to the db.sead.systems:8080 api, nothing more.
    you can pass in any of the supported query parameters
    ('type', 'start_time', 'end_time', 'device', 'diff', 'subset', 'limit', 'json')
    """
    permission_classes = []
    allowed_parameters = ['type', 'start_time', 'end_time', 'device',
                      'diff', 'subset', 'limit', 'json']

    def get(self, request, device_id):
        """
        :summary: This is the get request for the raw_query \n
        :param: request: the object containing the query parameters \n
        :param: device_id: the device_id of the device requesting information about\n
        :return: \n
        """
        params = request.GET.dict()

        for param in params:
            if param not in self.allowed_parameters:
                raise ValueError('Query parameter not allowed: ', param)

        response = requests.get("http://db.sead.systems:8080/" + device_id, params=params)
        response.raise_for_status()

        return Response({"status": response.status_code , "data": response.json()})


class TotalPower(APIView):

    """ Calculates the total power usage or generation for a particular device over some time period.
    Start and end times must be utc unix timestamps. """

    permission_classes = []

    def get(self, request, device_id, power_type, start_time, end_time):

        """
        :summary: Get request for total power\n
        :param: request: the object conainting the query parameters\n
        :param: device_id: the device_id of the device requesting information about\n
        :param: type: must be consumed_power or generated_power \n
        :param: start_time: beginning of range of time to calculate total power for (must be a valid utc timestamp)
        :param: end_time: end of range of time to calculate total power for (must be a valid utc timestamp)
        :return: Response object\n
        """

        """using the same function to handle total power generated and total power consumed,
        this sets a boolean that will control whether or not generated power is calculated
        or consumed power is calculated"""
        type_of_power = True if power_type == 'consumed_power' else False

        url = "http://db.sead.systems:8080/" + device_id

        start_params = {
            "type": "p",
            "start_time": start_time,
            "end_time": start_time
        }

        try:
            response_start = requests.get(url, start_params).json()
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            raise ServiceUnavalibleException()
        except requests.exceptions.RequestException as request:
            raise Http404(request)

        end_params = {
            "type": "p",
            "start_time": end_time,
            "end_time": end_time
        }

        try:
            end_params["start_time"] = end_time
            end_params["end_time"] = end_time
            response_end = requests.get(url, end_params).json()
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            raise ServiceUnavalibleException()
        except requests.exceptions.RequestException as request:
            raise Http404(request)

        """
        internal helper function, makes an easy to work with
        list of power values out of messy api response data
        # param api_response: the response to feed into the function
        # param consumption_or_generation: boolean true to calculate
            consumption, false to calculate generation
        # returns a list
        """

        def get_power_list_from_api_data(api_response, consumption_or_generation):
            return list(map(lambda power: int(power[1]), (
                        filter(lambda power_value:
                            consumption_or_generation if int(power_value[1]) < 0 else not consumption_or_generation,
                            list(api_response[1:])))))

        start_power_values = get_power_list_from_api_data(response_start, type_of_power)

        end_power_values = get_power_list_from_api_data(response_end, type_of_power)

        total_power = 0
        for index, end_power in enumerate(end_power_values):
            total_power += end_power-start_power_values[index]

        return Response({"status": 200, "data": abs(total_power)})
