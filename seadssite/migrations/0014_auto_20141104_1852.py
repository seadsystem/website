# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('seadssite', '0013_auto_20141101_0103'),
    ]

    operations = [
        migrations.AlterField(
            model_name='devices',
            name='connection_status',
            field=models.BooleanField(default=True),
        ),
    ]
