# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('seadssite', '0007_auto_20141029_1948'),
    ]

    operations = [
        migrations.AddField(
            model_name='devices',
            name='user_id',
            field=models.CharField(default=b'DEFAULT USERID', max_length=200),
            preserve_default=True,
        ),
    ]
