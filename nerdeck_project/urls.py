from django.contrib import admin
from django.urls import path
from cards.views import LandingPageView, HomeView, SignupView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("home/", HomeView.as_view(), name="home"),
    path("signup/", SignupView.as_view(), name="signup"),
    path("", LandingPageView.as_view(), name="landingpage"),
]