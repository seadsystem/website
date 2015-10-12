# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('seadssite', '0005_devices_userdevice'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='UserDevice',
            new_name='Map',
        ),
        migrations.RenameField(
            model_name='devices',
            old_name='DeviceId',
            new_name='device_id',
        ),
        migrations.RenameField(
            model_name='map',
            old_name='DeviceId',
            new_name='device_id',
        ),
        migrations.RenameField(
            model_name='map',
            old_name='UserId',
            new_name='user_id',
        ),
    ]
