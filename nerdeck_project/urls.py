from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views
from cards.views import (
    LandingPageView,
    HomeView,
    SignupView,
    DecksView,
    logout_view,
    create_deck,
    delete_deck,
    rename_deck,
    rename_folder,
    organize_decks,
    merge_folders,
    new_flashcard,
    study_deck,
    review_answer,
    delete_flashcard,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("home/", HomeView.as_view(), name="home"),
    path("decks/", DecksView.as_view(), name="decks"),
    path("decks/create/", create_deck, name="create_deck"),
    path("decks/delete/", delete_deck, name="delete_deck"),
    path("decks/rename/", rename_deck, name="rename_deck"),
    path("decks/folders/rename/", rename_folder, name="rename_folder"),
    path("decks/organize/", organize_decks, name="organize_decks"),
    path("decks/folders/merge/", merge_folders, name="merge_folders"),
    path("decks/<int:deck_id>/new/", new_flashcard, name="new_flashcard"),
    path("decks/<int:deck_id>/study/", study_deck, name="study"),
    path("decks/<int:deck_id>/review/answer/", review_answer, name="review_answer"),
    path("decks/<int:deck_id>/cards/<int:card_id>/delete/", delete_flashcard, name="delete_flashcard"),
    path("login/", auth_views.LoginView.as_view(template_name="login.html"), name="login"),
    path("logout/", logout_view, name="logout"),
    path("signup/", SignupView.as_view(), name="signup"),
    path("", LandingPageView.as_view(), name="landingpage"),
]
