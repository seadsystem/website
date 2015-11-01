# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('seadssite', '0017_auto_20151022_0319'),
    ]

    operations = [
        migrations.CreateModel(
            name='Device',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('device_id', models.IntegerField()),
                ('name', models.CharField(default='DEFAULT VALUE', max_length=200)),
                ('connection', models.BooleanField(default=True)),
                ('power', models.BooleanField(default=False)),
                ('apptype', models.CharField(default=0, max_length=200)),
            ],
        ),
        migrations.AlterField(
            model_name='map',
            name='device',
            field=models.ForeignKey(to='seadssite.Device'),
        ),
        migrations.DeleteModel(
            name='Devices',
        ),
    ]
