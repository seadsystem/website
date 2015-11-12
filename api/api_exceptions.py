from rest_framework.exceptions import APIException

class ServiceUnavalibleException(APIException):
    status_code = 503
    default_detail = "db.sead.systems temporarily unavailable"
