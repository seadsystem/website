# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('seadssite', '0014_auto_20141104_1852'),
    ]

    operations = [
        migrations.RenameField(
            model_name='devices',
            old_name='connection_status',
            new_name='connection',
        ),
        migrations.RenameField(
            model_name='devices',
            old_name='power_status',
            new_name='power',
        ),
    ]
