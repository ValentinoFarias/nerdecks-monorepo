import { reviewCardTwoButtons } from "./cards.js";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const cardTextEl = document.getElementById("card-text");
const showButtonEl = document.getElementById("show-button");
const rightButtonEl = document.getElementById("right-button");
const wrongButtonEl = document.getElementById("wrong-button");
const messageEl = document.getElementById("review-message");

if (cardTextEl && showButtonEl && rightButtonEl && wrongButtonEl) {
  const cardState = {
    id: Number(cardTextEl.dataset.cardId),
    step: Number(cardTextEl.dataset.step || "0"),
    dueAt: cardTextEl.dataset.dueAt || null,
  };

  let frontText = cardTextEl.dataset.front || "";
  let backText = cardTextEl.dataset.back || "";

  function showFront() {
    cardTextEl.textContent = frontText;
    showButtonEl.classList.remove("d-none");
    rightButtonEl.classList.add("d-none");
    wrongButtonEl.classList.add("d-none");
  }

  function showBack() {
    cardTextEl.textContent = backText;
    showButtonEl.classList.add("d-none");
    rightButtonEl.classList.remove("d-none");
    wrongButtonEl.classList.remove("d-none");
  }

  async function handleAnswer(isRight) {
    const { card: updatedCard, message } = reviewCardTwoButtons(cardState, isRight);

    cardState.step = updatedCard.step;
    cardState.dueAt = updatedCard.dueAt;

    if (messageEl && message) {
      messageEl.textContent = message;
    }

    const deckId = Number(document.body.dataset.deckId);
    const csrftoken = getCookie("csrftoken");

    try {
      const resp = await fetch(`/decks/${deckId}/review/answer/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken || "",
        },
        body: JSON.stringify({
          card_id: cardState.id,
          is_right: isRight,
          step: updatedCard.step,
          due_at: updatedCard.dueAt,
        }),
      });

      if (resp.ok && isRight) {
        const data = await resp.json();
        const next = data.next_card;

        if (next) {
          // Move to next due card, preserving its SRS state.
          cardState.id = next.id;
          cardState.step = Number.isFinite(next.step) ? next.step : 0;
          cardState.dueAt = next.due_at || null;

          frontText = next.front_text;
          backText = next.back_text;

          cardTextEl.dataset.cardId = String(next.id);
          cardTextEl.dataset.front = frontText;
          cardTextEl.dataset.back = backText;
          cardTextEl.dataset.step = String(cardState.step);
          cardTextEl.dataset.dueAt = cardState.dueAt || "";

          if (messageEl) {
            messageEl.textContent = "";
          }

          showFront();
          return;
        }

        // No more cards in this deck
        showButtonEl.classList.add("d-none");
        rightButtonEl.classList.add("d-none");
        wrongButtonEl.classList.add("d-none");
        cardTextEl.textContent = " Well done you have completed all the cards! See you tomorrow!";
        if (messageEl) {
          messageEl.textContent = "";
        }
        return;
      }
    } catch (e) {
      console.error("Failed to save review result", e);
    }
    // On failure or for wrong answers, stay on the same card.
    showFront();
  }

  showButtonEl.addEventListener("click", () => {
    showBack();
  });

  rightButtonEl.addEventListener("click", () => {
    handleAnswer(true);
  });

  wrongButtonEl.addEventListener("click", () => {
    handleAnswer(false);
  });

  showFront();
}
