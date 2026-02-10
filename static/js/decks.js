function createNerDeck() {
  const name = prompt("Give your NerDeck a name:");
  if (!name) {
    return; // user cancelled or left empty
  }
  const input = document.getElementById("deck-title-input");
  const form = document.getElementById("create-deck-form");
  if (!input || !form) {
    console.error("Create deck form elements not found.");
    return;
  }
  input.value = name;
  form.submit();
}
