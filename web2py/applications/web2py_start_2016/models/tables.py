# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

import datetime

db.define_table('device_usage',
                Field('use_time', 'datetime'),
                Field('tv_bedroom', default=False),
                Field('light_bedroom', default=False),
                Field('desktop_bedroom', default=False),
                Field('ac_bedroom', default=False),
                Field('freezer_kitchen', default=False),
                Field('fridge_kitchen', default=False),
                Field('toaster_kitchen', default=False),
                Field('microwave_kitchen', default=False),
                Field('desktop_office', default=False),
                Field('lights_office', default=False),
                Field('ipad_office', default=False),
                Field('shredder_office', default=False),
                Field('light_bathroom', default=False),
                Field('hairdryer_bathroom', default=False),
                Field('shaver_bathroom', default=False),
                Field('tv_livingroom', default=False),
                Field('xbox_livingroom', default=False),
                Field('soundsystem_livingroom', default=False),
                Field('light_livingroom', default=False)
                )

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
