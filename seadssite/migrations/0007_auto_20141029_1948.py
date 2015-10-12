# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('seadssite', '0006_auto_20141029_1841'),
    ]

    operations = [
        migrations.AddField(
            model_name='devices',
            name='device_connectionstatus',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='devices',
            name='device_name',
            field=models.CharField(default=b'DEFAULT VALUE', max_length=200),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='devices',
            name='device_powerstatus',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
