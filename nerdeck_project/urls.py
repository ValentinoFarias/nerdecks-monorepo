from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views
from cards.views import LandingPageView, HomeView, SignupView, DecksView, logout_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("home/", HomeView.as_view(), name="home"),
    path("decks/", DecksView.as_view(), name="decks"),
    path("login/", auth_views.LoginView.as_view(template_name="login.html"), name="login"),
    path("logout/", logout_view, name="logout"),
    path("signup/", SignupView.as_view(), name="signup"),
    path("", LandingPageView.as_view(), name="landingpage"),
]