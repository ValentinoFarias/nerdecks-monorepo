from django.views.generic import TemplateView
from django.shortcuts import redirect, render
from django.contrib.auth import login, logout
from django.views import View
from django.contrib import messages

from .forms import EmailSignupForm


class LandingPageView(TemplateView):
    template_name = "landingPage.html"


class HomeView(TemplateView):
    template_name = "home.html"


class DecksView(TemplateView):
	template_name = "decks.html"


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

        messages.error(
            request,
            "Something went wrong. Please check the form and try again."
        )

        return render(request, "signup.html", {"form": form})