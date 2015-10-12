# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('seadssite', '0012_auto_20141031_0650'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='firstName',
        ),
        migrations.RemoveField(
            model_name='userprofile',
            name='lastName',
        ),
    ]
