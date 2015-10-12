# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('seadssite', '0011_auto_20141031_0304'),
    ]

    operations = [
        migrations.RenameField(
            model_name='devices',
            old_name='device_connectionstatus',
            new_name='connection_status',
        ),
        migrations.RenameField(
            model_name='devices',
            old_name='device_name',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='devices',
            old_name='device_powerstatus',
            new_name='power_status',
        ),
    ]
