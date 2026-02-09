from django.contrib import admin
from .models import Card
from .models import Deck
from .models import Folder
from .models import CardSRS


# Register your models here.

admin.site.register(Card)
admin.site.register(Deck)
admin.site.register(Folder)
admin.site.register(CardSRS)

