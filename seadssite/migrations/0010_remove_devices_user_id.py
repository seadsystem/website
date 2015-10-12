# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('seadssite', '0009_merge'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='devices',
            name='user_id',
        ),
    ]
