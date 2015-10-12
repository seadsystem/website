# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('seadssite', '0003_devices_user_userdevice'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userdevice',
            name='DeviceId',
        ),
        migrations.DeleteModel(
            name='Devices',
        ),
        migrations.RemoveField(
            model_name='userdevice',
            name='UserId',
        ),
        migrations.DeleteModel(
            name='User',
        ),
        migrations.DeleteModel(
            name='UserDevice',
        ),
    ]
