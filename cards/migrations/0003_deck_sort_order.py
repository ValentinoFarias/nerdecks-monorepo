from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cards", "0002_remove_card_hint_text"),
    ]

    operations = [
        migrations.AddField(
            model_name="deck",
            name="sort_order",
            field=models.IntegerField(default=0),
        ),
    ]
