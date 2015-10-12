import ast
import requests
from .models import Devices, Map
import time

def rreduce(data, dtype):
    #return data
    if len(data) < 5:
        return data

    ffilter = 40
    if dtype == 'I':
        ffilter = 100
    if dtype == 'V':
        ffilter = 1500

    answer = [["poo"]]
    #save some element
    start = 0
    for i, item in enumerate(data):
        #considering whether or not we should adopt them
        #compare start with item
        if should_adopt(data[start], item, ffilter):
            if data[i-1] is not answer[len(answer)-1]:
                answer.append(data[i-1])
            answer.append(item)
        #if fucker then append to the answer: the one right before and the fucker
        #make sure
        #update start = i
        start = i
    #print answer
    answer = answer[1:]
    if len(answer) == 0:
        return []
    if data[0] is not answer[0]:
        answer.insert(0,data[0])
    if data[len(data)-1] is not answer[len(answer)-1]:
        answer.append(data[len(data)-1])
    #print answer
    return answer

def should_adopt(start, current, ffilter):
    if abs(start[1] - current[1]) > ffilter:
        return True
    return False

def get_connected_devices(maps):
    if len(maps) == 0:
        return 0
    connected_devices = 0
    for dmap in maps:
        if dmap.device.connection:
            connected_devices += 1
    return connected_devices

def device_max_data(api_response):
    if len(api_response) < 2:
        return 0
    return max(api_response[1:], key=lambda x:x[1])[1]


#TODO WORK ON THIS PLEASE I NEED TO
def get_current_power_map(maps):
    if len(maps) == 0:
        return None
    solution = []
    for dmap in maps:
        api_response = get_plug_data(0,0,"W",dmap.device.device_id,limit=True)
        if len(api_response) > 1 and api_response[1]:
            temp = api_response[1]
            temp.append(dmap.device.device_id)
            solution.append(temp)
        #if time for this data is not within 5min return none
        #else return the data value
        #if length of api_response is not 2 return none (this means no data)
    #print api_response
    return solution


def device_avg_data(api_response):
    if len(api_response) < 2:
        return 0
    return sum(map(lambda x:x[1], api_response[1:]))/len(api_response[1:])

def get_max_power_usage(minutes, maps):
    if len(maps) == 0:
        return 0
    current_power_usage = 0
    now = int(time.time())
    then = now - (minutes * 60)
    for dmap in maps:
        usage = get_plug_data(then, now, "W", dmap.device.device_id)
        if len(usage) < 2:
            continue
        current_power_usage += max(usage[1:], key=lambda x:x[1])[1]
    return current_power_usage / len(maps)


def get_average_power_usage(minutes, maps, samples):
    if len(maps) == 0:
        return 0
    average_power_usage = 0
    now = int(time.time())
    then = now - (minutes * 60)
    hours = minutes / 60
    samp_hr = samples/hours

    for dmap in maps:
        usage = get_plug_data(then, now, "W", dmap.device.device_id, samples)
        if len(usage) < 2:
            continue
        average_power_usage += ((sum(map(lambda x:x[1], usage[1:]))/len(usage[1:])) * samp_hr)
    return int(average_power_usage / len(maps))


def get_plug_data(start_time, end_time, dtype, device_id, samples = 3000, limit=False):

    #the basic API call will have a base format that includes just a device ID, it builds from that
    if limit:
        api_string = "http://128.114.59.76:8080/{}".format(device_id)
        api_string += "?type={}".format(dtype)
        api_string += "&limit=1"

    elif dtype is None:#This is me doing a test for Winter 2015 team
        api_string = "http://api.sead.systems:8080/{}".format(device_id)
        api_string +="?json=true"
        api_string += "&start_time={}&end_time={}".format(start_time, end_time)
        api_string += "&subset={}".format(1000) #Hardcoded, change this later TODO

    else:

        api_string = "http://128.114.59.76:8080/{}".format(device_id)
        #the next optional appendage to the API call is dtype which can be I,V or W (current, volt or watt)
        api_string += "?type={}".format(dtype)
        #the next optional appendage to the API call is start and end time
        api_string += "&start_time={}&end_time={}".format(start_time, end_time)
        api_string += "&subset={}".format(samples)

    #the current strategy is to create subsets by dropping certain points -- to be worked on
    #api_string += "&subset={}".format(100)
    #following is for testing purposes -- seing how long API calls take etc

    #print "API CALL: {}".format(api_string)
    #start = time.time()

    api_response = requests.get(api_string).text
    #Here I return Seads Winter 2015 data as a test
    test3 = api_response.replace('\n', ' ').replace('\r', '')#Errors unless you remove all newlines
    if dtype is None:#This is me returning early for testing Winter 2015
        return test3

    #print "Raw API:" + api_response
    #end = time.time()
    #print "API Took: {}seconds".format(end-start)
    #start = time.time()

    api_response = ast.literal_eval(api_response)
    for row in api_response:
        for index, value in enumerate(row):
            if index > 0 and value not in [dtype]:
                row[index] = int(value)

    print len(api_response)
    api_head = api_response[:1]
    api_reverse = api_response[::-1]
    api_reduce = rreduce(api_reverse[:len(api_reverse)-1], dtype)
    api_response = api_head + api_reduce
    print len(api_response)
    #end = time.time()
    #print "Server Processing Took: {}seconds".format(end-start)
    return api_response

'''
actual function to delete a device from "user"
'''
#Get the device ID and "device" of the device requested to be deleted
def delete_device(device_id, current_user):
    D = Devices.objects.filter(device_id = device_id)
    M = Map.objects.filter(device=D)
    #if the user owns the device they are trying to delete
    if Map.objects.filter(user=current_user.id, device=D):
        Devices.objects.filter(device_id = device_id).delete()
    else:
        return "you don't own the device you're deleting, or it doesn't exist"
    return None

'''
actual function to register device to specific user
'''
def register_device(device_id, device_name, current_user):
    #check if device is already registered to this user
    D = Devices.objects.filter(device_id=device_id)
    if Map.objects.filter(user=current_user.id, device=D):
        return "The device you've attempted to register has already been registered."
    else:
    #try to create a new device and map it to the user
        try:
            D = Devices(device_id=device_id, name=device_name)
            D.save()
            Map(user = current_user, device = D).save()
        #catch errors
        #this is where the "alert" comes from in the views
        except ValueError:
            print "Invalid Device ID"
        except TypeError:
            print "Invalid Device ID"
    return None


def modify_device_name(device_id, name):
        '''
        a bit of a hack, this assumes every device has a unique ID, will have to be enforced in DB
        we must also enforce that the name field can't be blank
        '''
        #save info to device object
        D = Devices.objects.filter(device_id = device_id)[0]
        D.name = new_name
        D.save()
