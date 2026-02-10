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

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")

        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("The two password fields didn’t match.")

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        # Use the email as the username internally so username is not asked for.
        user.username = self.cleaned_data["email"]
        user.set_password(self.cleaned_data["password1"])

        if commit:
            user.save()

        return user
