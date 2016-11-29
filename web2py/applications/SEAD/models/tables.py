# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

import datetime
import random
random.seed(1)

start = datetime.datetime(2015,1,1,0,0)
end = datetime.datetime(2016, 12, 31, 0, 0)

num_of_minutes = 2*365*24*60  # datetime.timedelta(minutes=365*24*60*2)

db.define_table('device_usage',
                Field('use_time', 'datetime'),
                Field('room', 'text'),
                Field('device', 'text'),
                Field('on_off', 'integer')
                )

rooms = {
    'bedroom': {'tv': [30, 4],  #possibility to be on, on for how long
                'light': [60, 5],
                'desktop': [60, 2],
                'ac': [20, 8],
                },
    'kitchen': {'freezer': [99, 1],
                'fridge': [99, 1],
                'toaster': [2, 1],
                'microwave': [5, 1],
                'light': [40, 4],
                },
    'office': {'desktop': [40, 3],
                'light': [40, 7],
                'ipad': [30, 2],
                'shredder': [3, 1],
               },
    'bathroom': {'light': [30, 1],
                 'hairdryer': [5, 1],
                 'shaver': [5, 1],
                 },
    'livingroom': { 'tv': [20, 4],
                    'xbox': [40, 4],
                    'soundsystem': [50, 5],
                    'light': [70,4],
                    },
}

# for r in rooms:
#     for d in r:
#
bedtv = rooms['bedroom']['tv']
kitlig = rooms['bedroom']['light']
two_dev = ['tv', 'light']
now = start

# # SUCCESS (a day, one device)
# for i in range(0, (24*60)/(bedtv[1]*60) ): #a day / time chunk
#     if random.random()*100 < bedtv[0]: # > is off, < is on
#         for j in range(0, bedtv[1]*60): #timechunk to minutes
#             db.device_usage.insert(use_time=now + datetime.timedelta(minutes=j),
#                            room='bedroom',
#                            device='tv',
#                            on_off=1)
#     now = now + datetime.timedelta(minutes=bedtv[1] * 60)

# # SUCCESS (a year, one device)
# for i in range(0, (365*24*60)/(bedtv[1]*60) ): #a day / time chunk
#     if random.random()*100 < bedtv[0]: # > is off, < is on
#         for j in range(0, bedtv[1]*60): #timechunk to minutes
#             db.device_usage.insert(use_time=now + datetime.timedelta(minutes=j),
#                            room='bedroom',
#                            device='tv',
#                            on_off=1)
#     now = now + datetime.timedelta(minutes=bedtv[1] * 60)

## (a day, two devices)
# room = rooms['bedroom']
# for dev in two_dev:
#     now = start
#     for i in range(0, (24*60)/(room[dev][1]*60) ): #a day / time chunk
#         if random.random()*100 < room[dev][0]: # > is off, < is on
#             for j in range(0, room[dev][1]*60): #timechunk to minutes
#                 db.device_usage.insert(use_time=now + datetime.timedelta(minutes=j),
#                                room='bedroom',
#                                device=dev,
#                                on_off=1)
#         now = now + datetime.timedelta(minutes=room[dev][1] * 60)

# # #SUCCESS (a day, all)
# now = start
# hour = 24
# for room in rooms:
#     for dev in rooms[room]:
#         now = start
#         for i in range(0, (hour * 60) / (rooms[room][dev][1] * 60)):  # a day / time chunk
#             if random.random()*100 < rooms[room][dev][0]: # > is off, < is on
#                 for j in range(0, rooms[room][dev][1]*60): #timechunk to minutes
#                     db.device_usage.insert(use_time=now + datetime.timedelta(minutes=j),
#                                    room=room,
#                                    device=dev,
#                                    on_off=1)
#             now = now + datetime.timedelta(minutes=rooms[room][dev][1] * 60)

# # #SUCCESS (a year, all)
# now = start
# hour = 2*24*365
# for room in rooms:
#     for dev in rooms[room]:
#         now = start
#         for i in range(0, (hour * 60) / (rooms[room][dev][1] * 60)):  # a day / time chunk
#             if random.random()*100 < rooms[room][dev][0]: # > is off, < is on
#                 for j in range(0, rooms[room][dev][1]*60): #timechunk to minutes
#                     db.device_usage.insert(use_time=now + datetime.timedelta(minutes=j),
#                                    room=room,
#                                    device=dev,
#                                    on_off=1)
#             now = now + datetime.timedelta(minutes=rooms[room][dev][1] * 60)



# db.define_table('device_usage',
#                 Field('use_time', 'datetime'),
#                 Field('tv_bedroom', default=False),
#                 Field('light_bedroom', default=False),
#                 Field('desktop_bedroom', default=False),
#                 Field('ac_bedroom', default=False),
#                 Field('freezer_kitchen', default=False),
#                 Field('fridge_kitchen', default=False),
#                 Field('toaster_kitchen', default=False),
#                 Field('microwave_kitchen', default=False),
#                 Field('desktop_office', default=False),
#                 Field('lights_office', default=False),
#                 Field('ipad_office', default=False),
#                 Field('shredder_office', default=False),
#                 Field('light_bathroom', default=False),
#                 Field('hairdryer_bathroom', default=False),
#                 Field('shaver_bathroom', default=False),
#                 Field('tv_livingroom', default=False),
#                 Field('xbox_livingroom', default=False),
#                 Field('soundsystem_livingroom', default=False),
#                 Field('light_livingroom', default=False)
#                 )

# I don't want to display the user email by default in all forms.

# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)



# db.device_usage.insert( 
#                         tv_bedroom=random.choice([True, False]),
#                         light_bedroom=random.choice([True, False]),
#                         desktop_bedroom=random.choice([True, False]),
#                         ac_bedroom=random.choice([True, False]),
#                         freezer_kitchen=random.choice([True, False]),
#                         fridge_kitchen=random.choice([True, False]),
#                         toaster_kitchen=random.choice([True, False]),
#                         microwave_kitchen=random.choice([True, False]),
#                         desktop_office=random.choice([True, False]),
#                         lights_office=random.choice([True, False]),
#                         ipad_office=random.choice([True, False]),
#                         shaver_bathroom = random.choice([True, False]),
#                         light_bathroom = random.choice([True, False]),
#                         hairdryer_bathroom = random.choice([True, False]),
#                         shaver_bathroom = random.choice([True, False]),
#                         tv_livingroom = random.choice([True, False]),
#                         xbox_livingroom = random.choice([True, False]),
#                         soundsystem_livingroom = random.choice([True, False]),
#                         light_livingroom = random.choice([True, False]),)
