from django.contrib import admin

from .models import Card, CardSRS, Deck, Folder, ReviewSession


@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "sort_order", "created_at")
    list_filter = ("user",)
    search_fields = ("name", "user__username", "user__email")
    ordering = ("user", "sort_order", "name")


@admin.register(Deck)
class DeckAdmin(admin.ModelAdmin):
    list_display = ("user", "title",  "folder", "created_at")
    list_filter = ("user", "is_archived", "folder")
    search_fields = ("title", "description", "user__username", "user__email", "folder__name")
    ordering = ("user", "sort_order", "title")
    list_select_related = ("user", "folder")
    autocomplete_fields = ("user", "folder")


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ("get_user", "front_preview", "id", "deck",  "status",  "updated_at", "created_at")
    list_filter = ("status", "deck__user", "deck")
    search_fields = (
        "front_text",
        "back_text",
        "deck__title",
        "deck__user__username",
        "deck__user__email",
    )
    ordering = ("-updated_at",)
    list_select_related = ("deck", "deck__user")
    autocomplete_fields = ("deck",)

    @admin.display(ordering="deck__user", description="User")
    def get_user(self, obj):
        return obj.deck.user

    @admin.display(description="Front")
    def front_preview(self, obj):
        text = (obj.front_text or "").strip().replace("\n", " ")
        return text[:60] + ("…" if len(text) > 60 else "")


@admin.register(CardSRS)
class CardSRSAdmin(admin.ModelAdmin):
    list_display = (
       "get_user",
       "card",
        "interval_days",
        "ease_factor",
        "repetitions",
        "lapses",
        "due_at",
        "last_reviewed_at",
    )
    list_filter = ("card__deck__user",)
    search_fields = (
        "card__front_text",
        "card__back_text",
        "card__deck__title",
        "card__deck__user__username",
    )
    ordering = ("due_at",)
    list_select_related = ("card", "card__deck", "card__deck__user")
    autocomplete_fields = ("card",)

    @admin.display(ordering="card__deck__user", description="User")
    def get_user(self, obj):
        return obj.card.deck.user


@admin.register(ReviewSession)
class ReviewSessionAdmin(admin.ModelAdmin):
    list_display = ("user", "mode", "started_at", "ended_at")
    list_filter = ("user", "mode")
    search_fields = ("user__username", "user__email")
    ordering = ("-started_at",)
