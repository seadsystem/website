# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('seadssite', '0010_remove_devices_user_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='map',
            old_name='device_id',
            new_name='device',
        ),
        migrations.RenameField(
            model_name='map',
            old_name='user_id',
            new_name='user',
        ),
    ]
