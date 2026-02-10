from django.views.generic import TemplateView
from django.shortcuts import redirect, render, get_object_or_404
from django.contrib.auth import login, logout
from django.views import View
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

from .forms import EmailSignupForm
from .models import Deck, Card


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