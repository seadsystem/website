# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('seadssite', '0018_auto_20151101_2257'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='map',
            name='device',
        ),
        migrations.RemoveField(
            model_name='map',
            name='user',
        ),
        migrations.RenameField(
            model_name='userprofile',
            old_name='cellProvider',
            new_name='cell_provider',
        ),
        migrations.RemoveField(
            model_name='device',
            name='apptype',
        ),
        migrations.RemoveField(
            model_name='device',
            name='id',
        ),
        migrations.RemoveField(
            model_name='device',
            name='power',
        ),
        migrations.RemoveField(
            model_name='userprofile',
            name='id',
        ),
        migrations.AddField(
            model_name='device',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='device',
            name='user',
            field=models.ForeignKey(default=1, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='device',
            name='device_id',
            field=models.IntegerField(unique=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='device',
            name='name',
            field=models.CharField(default='Seads Device', max_length=200),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='user',
            field=models.OneToOneField(to=settings.AUTH_USER_MODEL, serialize=False, primary_key=True),
        ),
        migrations.DeleteModel(
            name='Map',
        ),
    ]
