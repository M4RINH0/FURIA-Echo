# Generated by Django 5.2 on 2025-04-29 14:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('echo', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Result',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hltv_id', models.PositiveIntegerField(unique=True)),
                ('event', models.CharField(max_length=120)),
                ('datetime_utc', models.DateTimeField()),
                ('opponent', models.CharField(max_length=60)),
                ('score_cta', models.CharField(max_length=10)),
                ('win', models.BooleanField()),
            ],
        ),
    ]
