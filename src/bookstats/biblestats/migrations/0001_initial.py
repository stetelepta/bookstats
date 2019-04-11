# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('testament', models.CharField(choices=[('old_testament', 'Old Testament'), ('new_testament', 'New Testament')], max_length=255, blank=True)),
                ('author', models.CharField(blank=True, null=True, max_length=255, db_index=True)),
                ('order', models.IntegerField(blank=True, null=True, db_index=True)),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='Chapter',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('nr', models.IntegerField()),
                ('content', models.TextField()),
                ('book', models.ForeignKey(to='biblestats.Book')),
            ],
        ),
        migrations.CreateModel(
            name='WordIndex',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('word', models.CharField(max_length=255, db_index=True)),
                ('count', models.IntegerField(default=0, db_index=True)),
                ('chapter', models.ForeignKey(to='biblestats.Chapter', verbose_name='Chapter')),
            ],
        ),
    ]
