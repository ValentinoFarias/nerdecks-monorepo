from django import forms
from django.contrib.auth.models import User


class EmailSignupForm(forms.ModelForm):
    password1 = forms.CharField(
        label="Password",
        widget=forms.PasswordInput,
        strip=False,
    )
    password2 = forms.CharField(
        label="Confirm password",
        widget=forms.PasswordInput,
        strip=False,
    )

    class Meta:
        model = User
        fields = ["email"]

    def clean_email(self):
        email = self.cleaned_data.get("email", "").strip().lower()
        if not email:
            return email

        # Since we use email as the username, ensure it is unique.
        if User.objects.filter(username=email).exists():
            raise forms.ValidationError(
                "An account with this email already exists. Please log in instead."
            )

        return email

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")

        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("The two password fields didn’t match.")

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        # Use normalized email as the username internally so username is not asked for.
        email = self.cleaned_data["email"].strip().lower()
        user.username = email
        user.email = email
        user.set_password(self.cleaned_data["password1"])

        if commit:
            user.save()

        return user
