from django.views.generic import TemplateView
from django.shortcuts import redirect, render
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.views import View
from django.contrib import messages


class LandingPageView(TemplateView):
    template_name = "landingPage.html"


class HomeView(TemplateView):
    template_name = "home.html"


class SignupView(View):
    def get(self, request):
        form = UserCreationForm()
        return render(request, "signup.html", {"form": form})

    def post(self, request):
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)

            messages.success(
                request,
                f"Account created successfully. Welcome, {user.username}!"
            )

            return redirect("home")

        messages.error(
            request,
            "Something went wrong. Please check the form and try again."
        )

        return render(request, "signup.html", {"form": form})