from rest_framework import permissions
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import exceptions
from .api_exceptions import ServiceUnavalibleException
import requests
from datetime import datetime, timedelta
from tzlocal import get_localzone

class RawQuery(APIView):
    """
    Acts as a router to the db.sead.systems:8080 api, nothing more.
    you can pass in any of the supported query parameters
    ('type', 'start_time', 'end_time', 'device', 'diff', 'subset', 'limit', 'json')
    """
    permission_classes = []
    allowed_parameters = ['type', 'start_time', 'end_time', 'device', 'diff', 'subset', 'limit', 'json']

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

        return Response({"status": response.status_code, "data": response.json()})


class TotalPower(APIView):

    """ Calculates the total power usage or generation for a particular device over some time period.
    Start and end times must be utc unix timestamps. """

    permission_classes = []

    def get(self, request, device_id, power_type, start_time, end_time):

        """
        :summary: Get request for total power\n
        :param request: the object containing the query parameters\n
        :param device_id: the device_id of the device requesting information about\n
        :param power_type: must be consumed_power or generated_power \n
        :param start_time: beginning of range of time to calculate total power for (must be a valid utc timestamp) \n
        :param end_time: end of range of time to calculate total power for (must be a valid utc timestamp) \n
        :return Response object\n
        example: \n
        {"power": 5673 }
        """

        """using the same function to handle total power generated and total power consumed,
        this sets a boolean that will control whether or not generated power is calculated
        or consumed power is calculated"""
        type_of_power = True if power_type == 'consumed_power' else False

        print(type_of_power)
        url = "http://db.sead.systems:8080/" + device_id

        start_params = {
            "type": "P",
            "start_time": start_time,
            "end_time": start_time
        }

        try:
            response_start = requests.get(url, params=start_params).json()
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            raise ServiceUnavalibleException()
        except requests.exceptions.RequestException as request:
            raise Http404(request)

        end_params = {
            "type": "P",
            "start_time": end_time,
            "end_time": end_time
        }

        try:
            response_end = requests.get(url, params=end_params).json()
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            raise ServiceUnavalibleException()
        except requests.exceptions.RequestException as request:
            raise Http404(request)

        start_power_values = get_power_list_from_api_data(response_start, type_of_power)

        end_power_values = get_power_list_from_api_data(response_end, type_of_power)

        total_power = 0
        for index, end_power in enumerate(end_power_values):
            total_power += end_power-start_power_values[index]

        return Response({"power": abs(total_power)})


class PowerPerTimePeriod(APIView):

    """ Calculates the total power usage or generation for a particular device over some time period.
    Start and end times must be utc unix timestamps. """

    permission_classes = []

    def get(self, request, device_id, power_type, start_time, end_time):

        """
        :summary: Get request for daily total power\n
        :param request: the object containing the query parameters\n
        :param device_id: the device_id of the device requesting information about\n
        :param power_type: must be consumed_power or generated_power \n
        :param start_time: beginning of range of time to calculate total power for (must be a valid utc timestamp) \n
        :param end_time: end of range of time to calculate total power for (must be a valid utc timestamp) \n
        :params (optional) frequency: number of days to sum power over if 7, gives back a week at a time from start date
         to end date, if 1 daily, if 31,30, or 28, monthly etc, if no frequency given default 1 (daily) query like such
          /api/device/:(device_id)/:(consumed_power|generated_power)/:(start_time)/:(end_time)?frequency=7 \n
        :return Response object \n
          example \n
            "power": [ \n
                { \n
                    "power": 45517642, \n
                    "date": "2015-11-02 20:00:00" \n
                }, \n
                { \n
                    "power": 76611579, \n
                    "date": "2015-11-03 20:00:00" \n
                }, \n
                { \n
                    "power": 95669560, \n
                    "date": "2015-11-04 20:00:00" \n
                }, \n
                { \n
                    "power": 88306852, \n
                    "date": "2015-11-05 20:00:00" \n
                }, \n
                { \n
                    "power": 84121558, \n
                    "date": "2015-11-06 20:00:00" \n
                } \n
            ] \n
        """

        if request.GET.get('frequency'):
            freq = request.GET.get('frequency')
        else:
            freq = 1

        """using the same function to handle daily power generated and daily power consumed,
        this sets a boolean that will control whether or not generated power is calculated
        or consumed power is calculated"""
        type_of_power = True if power_type == 'consumed_power' else False


        url = "http://db.sead.systems:8080/" + device_id
        start_date_time = datetime.fromtimestamp(int(start_time))
        end_date_time = datetime.fromtimestamp(int(end_time))

        try:
            one_day_before = start_date_time - timedelta(freq)
            start_params = {
                "type": "P",
                "start_time": one_day_before.strftime('%s'),
                "end_time": one_day_before.strftime('%s'),
            }
            start = get_power_list_from_api_data(requests.get(url, params=start_params).json(), type_of_power)
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            raise ServiceUnavalibleException()
        except requests.exceptions.RequestException as request:
            raise Http404(request)

        i = start_date_time
        j = 0
        response = []

        while i <= end_date_time:
            epoch_time = i.strftime('%s')

            params = {
                "type": "P",
                "start_time": epoch_time,
                "end_time": epoch_time,
            }
            print("HERERERERE")
            try:
                end = get_power_list_from_api_data(requests.get(url, params=params).json(), type_of_power)
                power_delta = 0
                for index, power in enumerate(end):
                    power_delta += start[index] - end[index]
                response.append({'date': str(i), 'power': abs(power_delta)})
            except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
                raise ServiceUnavalibleException()
            except requests.exceptions.RequestException as request:
                raise Http404(request)
            i += timedelta(freq)
            start = end

        return Response({"power": response})


def get_power_list_from_api_data(api_response, consumption_or_generation):
    """
    internal helper function, makes an easy to work with
    list of power values out of messy api response data
    :param api_response: the response to feed into the function
    :param consumption_or_generation: boolean true to calculate
    consumption, false to calculate generation
    returns a list
    """
    return list(map(lambda power: int(power[1]), (
                filter(lambda power_value:
                    consumption_or_generation if int(power_value[1]) < 0 else not consumption_or_generation,
                    list(api_response[1:])))))
