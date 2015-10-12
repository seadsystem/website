# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('seadssite', '0015_auto_20141104_1855'),
    ]

    operations = [
        migrations.AddField(
            model_name='devices',
            name='apptype',
            field=models.CharField(default=0, max_length=200),
            preserve_default=True,
        ),
    ]
