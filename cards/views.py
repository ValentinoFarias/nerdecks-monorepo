from django.views.generic import TemplateView
from django.shortcuts import redirect, render, get_object_or_404
from django.contrib.auth import login, logout
from django.views import View
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Q
import json

from .forms import EmailSignupForm, CardForm
from .models import Deck, Card, ReviewSession, CardSRS


DEFAULT_LADDER_DAYS = [1, 3, 7, 14, 30, 60, 120, 240, 365]


def _step_from_interval(interval_days: int) -> int:
    """Approximate the next step based on the last scheduled interval."""
    interval = max(interval_days or 0, 0)

    for idx, days in enumerate(DEFAULT_LADDER_DAYS):
        if interval == days:
            # After scheduling interval "days" we advance to the next rung.
            return min(idx + 1, len(DEFAULT_LADDER_DAYS) - 1)

    # Unknown interval: treat as brand new.
    return 0


class LandingPageView(TemplateView):
    template_name = "landingPage.html"


class HomeView(TemplateView):
    template_name = "home.html"


@method_decorator(login_required, name="dispatch")
class DecksView(TemplateView):
    template_name = "decks.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["decks"] = Deck.objects.filter(user=self.request.user, is_archived=False).order_by("created_at")
        return context


@login_required
def deck_flashcards(request, deck_id):
    deck = get_object_or_404(Deck, id=deck_id, user=request.user, is_archived=False)
    cards = Card.objects.filter(deck=deck, status="active").order_by("created_at")
    return render(request, "flashcards.html", {"deck": deck, "cards": cards})


@login_required
def new_flashcard(request, deck_id):
    deck = get_object_or_404(Deck, id=deck_id, user=request.user, is_archived=False)

    if request.method == "POST":
        form = CardForm(request.POST)
        if form.is_valid():
            card = form.save(commit=False)
            card.deck = deck
            card.save()
            messages.success(request, "Flashcard created.")
            return redirect("deck_flashcards", deck_id=deck.id)
    else:
        form = CardForm()

    return render(request, "new_flashcard.html", {"deck": deck, "form": form})


@login_required
def study_deck(request, deck_id):
    deck = get_object_or_404(Deck, id=deck_id, user=request.user, is_archived=False)
    now = timezone.now()

    due_cards = (
        Card.objects.filter(deck=deck, status="active")
        .filter(Q(cardsrs__due_at__lte=now) | Q(cardsrs__isnull=True))
        .select_related("cardsrs")
        .order_by("created_at")
    )

    current_card = due_cards.first() if due_cards.exists() else None

    current_card_state = {
        "step": 0,
        "due_at": "",
    }

    if current_card and hasattr(current_card, "cardsrs") and current_card.cardsrs:
        current_card_state = {
            "step": _step_from_interval(current_card.cardsrs.interval_days),
            "due_at": current_card.cardsrs.due_at.isoformat(),
        }

    # Create a new review session for this user
    session = ReviewSession.objects.create(
        user=request.user,
        mode="review",  # or "cram" later if you add that mode in the UI
    )

    return render(request, "study.html", {
        "deck": deck,
        "cards": due_cards,
        "current_card": current_card,
        "current_card_state": current_card_state,
        "session": session,
    })


@login_required
@require_POST
def review_answer(request, deck_id):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    card_id = payload.get("card_id")
    is_right = payload.get("is_right")
    step = payload.get("step")
    due_at_str = payload.get("due_at")

    if card_id is None or is_right is None:
        return JsonResponse({"error": "Missing fields"}, status=400)

    card = get_object_or_404(
        Card,
        id=card_id,
        deck_id=deck_id,
        deck__user=request.user,
    )

    # Parse due_at from ISO string; if missing, fall back to now
    if due_at_str:
        try:
            due_at = timezone.datetime.fromisoformat(due_at_str.replace("Z", "+00:00"))
            if timezone.is_naive(due_at):
                due_at = timezone.make_aware(due_at, timezone.utc)
        except Exception:
            due_at = timezone.now()
    else:
        due_at = timezone.now()

    srs, _ = CardSRS.objects.get_or_create(
        card=card,
        defaults={"due_at": due_at},
    )

    srs.due_at = due_at
    # Interval in days from today to due_at
    srs.interval_days = (due_at.date() - timezone.now().date()).days
    srs.last_reviewed_at = timezone.now()

    if is_right:
        srs.repetitions += 1
    else:
        srs.lapses += 1

    srs.save()

    due_filter = Q(cardsrs__due_at__lte=timezone.now()) | Q(cardsrs__isnull=True)

    next_card = (
        Card.objects.filter(
            deck_id=deck_id,
            status="active",
        )
        .filter(due_filter)
        .exclude(id=card.id)
        .select_related("cardsrs")
        .order_by("created_at")
        .first()
    )

    response = {"ok": True}

    if next_card is not None:
        response["next_card"] = {
            "id": next_card.id,
            "front_text": next_card.front_text,
            "back_text": next_card.back_text,
            "due_at": next_card.cardsrs.due_at.isoformat() if hasattr(next_card, "cardsrs") and next_card.cardsrs else "",
            "step": _step_from_interval(next_card.cardsrs.interval_days) if hasattr(next_card, "cardsrs") and next_card.cardsrs else 0,
        }
    else:
        response["next_card"] = None

    return JsonResponse(response)


@login_required
def create_deck(request):
    if request.method != "POST":
        return redirect("decks")

    title = request.POST.get("title", "").strip()
    if not title:
        messages.error(request, "Please provide a name for your NerDeck.")
        return redirect("decks")

    Deck.objects.create(user=request.user, title=title)
    messages.success(request, f"NerDeck '{title}' created.")
    return redirect("decks")


@login_required
def delete_deck(request):
    if request.method != "POST":
        return redirect("decks")

    deck_id = request.POST.get("deck_id")
    if not deck_id:
        messages.error(request, "Could not determine which NerDeck to delete.")
        return redirect("decks")

    deck = Deck.objects.filter(user=request.user, id=deck_id).first()
    if not deck:
        messages.error(request, "NerDeck not found.")
        return redirect("decks")

    title = deck.title
    deck.delete()
    messages.success(request, f"NerDeck '{title}' deleted.")
    return redirect("decks")


def logout_view(request):
    logout(request)
    return redirect("home")


class SignupView(View):
    def get(self, request):
        form = EmailSignupForm()
        return render(request, "signup.html", {"form": form})

    def post(self, request):
        form = EmailSignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)

            messages.success(
                request,
                f"Account created successfully. Welcome, {user.email}!"
            )

            return redirect("home")

        # If the form is not valid, re-render the page with field errors only.
        return render(request, "signup.html", {"form": form})