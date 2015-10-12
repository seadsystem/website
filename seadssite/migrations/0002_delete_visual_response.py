# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('seadssite', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='visual_response',
        ),
    ]
