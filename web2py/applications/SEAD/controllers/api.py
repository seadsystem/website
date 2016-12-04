from datetime import datetime, timedelta
import json

# def test():
#     User1 = {
#         # 'id': 0,
#         # 'name': 'Ewing',
#         # 'email': 'ylin62@ucsc.edu',
#         'rooms': {
#             'bedroom':
#                 {
#                     'icon_path': '/bedroom.png',
#                     'device': 'tv,light,desktop,ac',
#                     'mod_header': 'activity,devices,graph,consumption,notification',
#                 },
#             'kitchen':
#                 {
#                     'icon_path': '/kitchen.png',
#                     'device': 'freezer,fridge,toaster,microwave,light',
#                     'mod_header': 'activity,devices,graph,consumption,notification',
#                 }
#         }
#     }
#     User1 = json.dumps(User1)
#
#     return response.json(dict(user=User1))


def get_data():
    today = datetime.utcnow()
    if request.get_vars.start is not None:
        start = request.vars.start
        start = start.split(',')
        start = datetime(int(start[0]),int(start[1]),int(start[2]))
        print(start)
    else:
        raise HTTP(400, "No room specified")
    if request.get_vars.end is not None:
        end = request.vars.end
        end = end.split(',')
        end = datetime(int(end[0]), int(end[1]), int(end[2]))
        print(end)
    else:
        end = None
    if request.get_vars.room is not None:
        room = request.vars.room
    else:
        raise HTTP(400,"No room specified")
    if request.get_vars.device is not None:
        device = request.vars.device
    else:
        raise HTTP(400, "No device specified")

    # text = 'connection success'
    data = []
    time = []
    if request.get_vars.end is None: #get one day from device usage
        rows = get_oneday(room, device, start)
        for i, r in enumerate(rows):
            data.append(r.use_time)
            time.append(r.on_off)
    else: # get a time period from daily usage
        rows = get_period(room, device, start, end)
        for i, r in enumerate(rows):
            data.append(r.total_usage)
            time.append(r.use_day)

    return response.json(dict(
        device=device,
        data=data,
        time=time,
    ))


def get_room():
    rows = db(db.user_info.user_id==request.vars.user_id).select()  #user_info
    rooms = ['Reserve For Home']
    row = rows[0]
    rowDict = json.loads(row['rooms'])
    roomsDict = rowDict['rooms']
    for r in roomsDict:
        rooms.append(
            dict(
                room=r,
                icon_path=roomsDict[r]['icon_path'],
                device=roomsDict[r]['device'],
                mod_header=roomsDict[r]['mod_header'],
            )
        )
    print(rooms)
    return response.json(dict(
        rooms=rooms,
    ))


# @auth.requires_signature()
def add_room():
    action_room = db(db.demo_rooms).select().first()
    action_room.room = ",".join(request.post_vars.rooms)
    action_room.update_record()
    print("Insert success")
    return get_room()


def get_oneday(room, dev, day):
    r = (db.device_usage.room == room)
    d = (db.device_usage.device == dev)
    s = (db.device_usage.use_time >= day)
    e = (db.device_usage.use_time < day+timedelta(days=1))
    rows = db(r & d & s & e).select(orderby=db.device_usage.use_time)
    return rows

def get_period(room, dev, start, end):
    r = (db.daily_usage.room == room)
    d = (db.daily_usage.device == dev)
    s = (db.daily_usage.use_day >= start)
    e = (db.daily_usage.use_day <= end)
    rows = db(r & d & s & e).select(orderby=db.daily_usage.use_day)
    return rows