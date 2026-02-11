const DEFAULT_LADDER_DAYS = [1, 3, 7, 14, 30, 60, 120, 240, 365];

export function reviewCardTwoButtons(card, isRight, now = new Date()) {
  const updated = { ...card };

  updated.step = Number.isFinite(updated.step) ? updated.step : 0;
  updated.dueAt = updated.dueAt ?? null;

  if (!isRight) {
    updated.step = 0;
    updated.dueAt = null;

    return {
      card: updated,
      message: "Wrong — this card will repeat until you get it right."
    };
  }

  const stepIndex = Math.min(updated.step, DEFAULT_LADDER_DAYS.length - 1);
  const intervalDays = DEFAULT_LADDER_DAYS[stepIndex];

  updated.dueAt = addDays(now, intervalDays).toISOString();
  updated.step = Math.min(updated.step + 1, DEFAULT_LADDER_DAYS.length - 1);

  return {
    card: updated,
    message: `Right ✅ — see you again in ${intervalDays} day(s).`
  };
}

export function getDueCards(cards, now = new Date()) {
  return cards.filter(card => {
    if (!card.dueAt) return true;
    return new Date(card.dueAt) <= now;
  });
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}