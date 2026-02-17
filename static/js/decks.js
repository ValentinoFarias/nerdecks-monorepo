// Page behavior for:
// - deck row actions (study/add buttons)
// - inline deck renaming
// - folder expand/collapse
// - drag/drop deck and folder organization
document.addEventListener("DOMContentLoaded", () => {
  const createDeckModal = document.getElementById("createDeckModal");
  const newDeckNameInput = document.getElementById("newDeckNameInput");
  const confirmCreateDeckBtn = document.getElementById("confirmCreateDeckBtn");
  const deckTitleInput = document.getElementById("deck-title-input");
  const createDeckForm = document.getElementById("create-deck-form");

  const radios = document.querySelectorAll(".deck-radio");
  const studyButtons = document.querySelectorAll(".study-button");
  const addButtons = document.querySelectorAll(".add-flashcard-button");
  const renameForms = document.querySelectorAll(".deck-rename-form");
  const folderRenameForms = document.querySelectorAll(".folder-rename-form");
  const deckRows = document.querySelectorAll(".deck-row");
  const folderRows = document.querySelectorAll(".folder-row");
  const folderToggles = document.querySelectorAll(".folder-toggle");
  const dragState = { type: null, deckId: null, folderId: null };

  function submitCreateDeck() {
    if (!newDeckNameInput || !deckTitleInput || !createDeckForm) return;

    const name = newDeckNameInput.value.trim();
    if (!name) {
      newDeckNameInput.focus();
      return;
    }

    deckTitleInput.value = name;
    createDeckForm.submit();
  }

  if (createDeckModal && newDeckNameInput && confirmCreateDeckBtn) {
    confirmCreateDeckBtn.addEventListener("click", submitCreateDeck);

    newDeckNameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submitCreateDeck();
      }
    });

    createDeckModal.addEventListener("shown.bs.modal", () => {
      newDeckNameInput.focus();
      newDeckNameInput.select();
    });

    createDeckModal.addEventListener("hidden.bs.modal", () => {
      newDeckNameInput.value = "";
    });
  }

  function clearButtons() {
    // Hide all action buttons, then selectively show only for the selected deck.
    studyButtons.forEach((btn) => btn.classList.add("d-none"));
    addButtons.forEach((btn) => btn.classList.add("d-none"));
  }

  function showButtonsForDeck(deckId) {
    const studyBtn = document.querySelector(
      `.study-button[data-deck-id="${deckId}"]`
    );
    const addBtn = document.querySelector(
      `.add-flashcard-button[data-deck-id="${deckId}"]`
    );
    if (studyBtn) {
      studyBtn.classList.remove("d-none");
    }
    if (addBtn) {
      addBtn.classList.remove("d-none");
    }
  }

  if (radios.length) {
    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (!radio.checked) return;
        clearButtons();
        showButtonsForDeck(radio.value);
      });
    });
  }

  function startRename(form) {
    const label = form.querySelector(".deck-name-display");
    const input = form.querySelector(".deck-name-input");
    if (!label || !input) return;

    // Keep layout stable: hide label visually and overlay the input in the same spot.
    form.dataset.editing = "1";
    label.classList.add("deck-name-editing");
    input.classList.remove("d-none");
    input.focus();
    input.select();
  }

  function cancelRename(form) {
    const label = form.querySelector(".deck-name-display");
    const input = form.querySelector(".deck-name-input");
    if (!label || !input) return;

    // Revert input back to current label text and close editor.
    input.value = label.textContent.trim();
    form.dataset.editing = "0";
    input.classList.add("d-none");
    label.classList.remove("deck-name-editing");
  }

  function saveRename(form) {
    if (form.dataset.submitting === "1") return;

    const label = form.querySelector(".deck-name-display");
    const input = form.querySelector(".deck-name-input");
    if (!label || !input) return;

    const current = label.textContent.trim();
    const next = input.value.trim();

    // Do not submit empty or unchanged values.
    if (!next || next === current) {
      cancelRename(form);
      return;
    }

    input.value = next;
    form.dataset.submitting = "1";
    form.submit();
  }

  renameForms.forEach((form) => {
    const label = form.querySelector(".deck-name-display");
    const input = form.querySelector(".deck-name-input");
    if (!label || !input) return;

    label.addEventListener("click", () => {
      startRename(form);
    });

    label.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        startRename(form);
      }
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        saveRename(form);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        cancelRename(form);
      }
    });

    input.addEventListener("blur", () => {
      saveRename(form);
    });
  });

  function startFolderRename(form) {
    const label = form.querySelector(".folder-name-display");
    const input = form.querySelector(".folder-name-input");
    if (!label || !input) return;

    form.dataset.editing = "1";
    label.classList.add("folder-name-editing");
    input.classList.remove("d-none");
    input.focus();
    input.select();
  }

  function cancelFolderRename(form) {
    const label = form.querySelector(".folder-name-display");
    const input = form.querySelector(".folder-name-input");
    if (!label || !input) return;

    input.value = label.textContent.trim();
    form.dataset.editing = "0";
    input.classList.add("d-none");
    label.classList.remove("folder-name-editing");
  }

  function saveFolderRename(form) {
    if (form.dataset.submitting === "1") return Promise.resolve();

    const label = form.querySelector(".folder-name-display");
    const input = form.querySelector(".folder-name-input");
    const folderIdInput = form.querySelector('input[name="folder_id"]');
    if (!label || !input || !folderIdInput) return Promise.resolve();

    const current = label.textContent.trim();
    const next = input.value.trim();

    if (!next || next === current) {
      cancelFolderRename(form);
      return Promise.resolve();
    }

    const folderId = folderIdInput.value;
    const formData = new FormData(form);
    formData.set("name", next);
    input.value = next;
    form.dataset.submitting = "1";

    return fetch(form.action, {
      method: "POST",
      headers: {
        "X-CSRFToken": getCsrfToken(),
        "X-Requested-With": "XMLHttpRequest",
      },
      body: formData,
    })
      .then((response) => response.json().then((payload) => ({ response, payload })))
      .then(({ response, payload }) => {
        if (!response.ok || !payload.ok) {
          const error = payload.error || "Could not rename folder.";
          throw new Error(error);
        }

        const finalName = payload.folder?.name || next;
        const finalFolderId = String(payload.folder?.id || folderId);
        label.textContent = finalName;
        cancelFolderRename(form);

        const allFolderLabels = document.querySelectorAll(
          `.folder-row[data-folder-id="${finalFolderId}"] .folder-name-display`
        );
        allFolderLabels.forEach((node) => {
          node.textContent = finalName;
        });

        const allFolderBadges = document.querySelectorAll(
          `.deck-row[data-folder-id="${finalFolderId}"] .deck-folder-badge`
        );
        allFolderBadges.forEach((node) => {
          node.textContent = finalName;
        });
      })
      .catch((error) => {
        window.alert(error.message || "Could not rename folder.");
        cancelFolderRename(form);
      })
      .finally(() => {
        form.dataset.submitting = "0";
      });
  }

  folderRenameForms.forEach((form) => {
    const label = form.querySelector(".folder-name-display");
    const input = form.querySelector(".folder-name-input");
    if (!label || !input) return;

    label.addEventListener("click", () => {
      startFolderRename(form);
    });

    label.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        startFolderRename(form);
      }
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        saveFolderRename(form);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        cancelFolderRename(form);
      }
    });

    input.addEventListener("blur", () => {
      saveFolderRename(form);
    });
  });

  function toggleFolder(folderId) {
    // Folder rows are parent rows; deck rows under that folder are hidden/shown.
    const deckRowsInFolder = document.querySelectorAll(
      `.deck-row[data-folder-id="${folderId}"]`
    );
    const toggle = document.querySelector(`.folder-toggle[data-folder-id="${folderId}"]`);
    if (!deckRowsInFolder.length || !toggle) return;

    const willExpand = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", willExpand ? "true" : "false");

    const arrow = toggle.querySelector(".folder-arrow");
    if (arrow) {
      arrow.textContent = willExpand ? "▼" : "▶";
    }

    deckRowsInFolder.forEach((row) => {
      row.classList.toggle("d-none", !willExpand);
    });
  }

  folderToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const folderId = toggle.dataset.folderId;
      if (!folderId) return;
      toggleFolder(folderId);
    });
  });

  function getCsrfToken() {
    // Read Django CSRF token from cookies for fetch POST requests.
    const cookie = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("csrftoken="));

    if (!cookie) return "";
    return decodeURIComponent(cookie.split("=")[1]);
  }

  async function organizeDecks(sourceDeckId, targetDeckId, targetFolderId) {
    // Generic move endpoint:
    // - deck -> deck
    // - deck -> folder
    const payload = { source_deck_id: sourceDeckId };
    if (targetDeckId) payload.target_deck_id = targetDeckId;
    if (targetFolderId) payload.target_folder_id = targetFolderId;

    const response = await fetch("/decks/organize/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      body: JSON.stringify(payload),
    });

    const responsePayload = await response.json().catch(() => ({}));
    if (!response.ok || !responsePayload.ok) {
      const error = responsePayload.error || "Could not organize NerDecks.";
      throw new Error(error);
    }
  }

  async function mergeFolders(sourceFolderId, targetFolderId, name) {
    // Merge two folders into a brand-new folder with a user-provided name.
    const response = await fetch("/decks/folders/merge/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      body: JSON.stringify({
        source_folder_id: sourceFolderId,
        target_folder_id: targetFolderId,
        name,
      }),
    });

    const responsePayload = await response.json().catch(() => ({}));
    if (!response.ok || !responsePayload.ok) {
      const error = responsePayload.error || "Could not merge folders.";
      throw new Error(error);
    }
  }

  function clearDropStyles() {
    // Visual cleanup for highlighted drop targets.
    deckRows.forEach((row) => row.classList.remove("deck-row-drop-target"));
    folderRows.forEach((row) => row.classList.remove("folder-row-drop-target"));
  }

  function resetDragState() {
    dragState.type = null;
    dragState.deckId = null;
    dragState.folderId = null;
    clearDropStyles();
    deckRows.forEach((row) => row.classList.remove("deck-row-dragging"));
    folderRows.forEach((row) => row.classList.remove("folder-row-dragging"));
  }

  function getDropSource(event) {
    // Prefer drag source encoded in dataTransfer (reliable across events/browsers).
    // Fallback to in-memory dragState if needed.
    const raw = event.dataTransfer?.getData("text/plain") || "";
    if (raw.startsWith("folder:")) {
      return { type: "folder", id: raw.slice("folder:".length) };
    }
    if (raw.startsWith("deck:")) {
      return { type: "deck", id: raw.slice("deck:".length) };
    }

    if (dragState.type === "folder") {
      return { type: "folder", id: dragState.folderId };
    }
    if (dragState.type === "deck") {
      return { type: "deck", id: dragState.deckId };
    }
    return { type: null, id: null };
  }

  function startFolderDrag(folderId, row, event) {
    if (!folderId) return;
    dragState.type = "folder";
    dragState.folderId = folderId;
    dragState.deckId = null;
    row.classList.add("folder-row-dragging");
    event.dataTransfer.effectAllowed = "move";
    // Encoding drag type/id lets drop handlers decide between deck-vs-folder flows.
    event.dataTransfer.setData("text/plain", `folder:${folderId}`);
  }

  deckRows.forEach((row) => {
    row.addEventListener("dragstart", (event) => {
      const interactiveTarget = event.target.closest(
        "a, button, input, textarea, .deck-name-input, .deck-name-display"
      );
      if (interactiveTarget) {
        event.preventDefault();
        return;
      }

      dragState.type = "deck";
      dragState.deckId = row.dataset.deckId;
      dragState.folderId = row.dataset.folderId || null;
      row.classList.add("deck-row-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", `deck:${dragState.deckId || ""}`);
    });

    row.addEventListener("dragend", () => {
      resetDragState();
    });

    row.addEventListener("dragover", (event) => {
      if (dragState.type !== "deck") return;
      if (!dragState.deckId || dragState.deckId === row.dataset.deckId) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      row.classList.add("deck-row-drop-target");
    });

    row.addEventListener("dragleave", () => {
      row.classList.remove("deck-row-drop-target");
    });

    row.addEventListener("drop", async (event) => {
      event.preventDefault();
      row.classList.remove("deck-row-drop-target");
      const source = getDropSource(event);

      // Folder dropped on a deck row inside a folder: treat as folder merge.
      if (source.type === "folder") {
        const targetFolderId = row.dataset.folderId;
        if (!source.id || !targetFolderId || source.id === targetFolderId) {
          return;
        }
        try {
          const name = window.prompt("Name for the new folder:");
          if (!name) return;
          await mergeFolders(source.id, targetFolderId, name.trim());
          window.location.reload();
        } catch (error) {
          window.alert(error.message);
        }
        return;
      }

      // Otherwise only deck->deck is valid on deck rows.
      if (source.type !== "deck") return;

      const targetDeckId = row.dataset.deckId;
      if (!source.id || !targetDeckId || source.id === targetDeckId) {
        return;
      }

      try {
        await organizeDecks(source.id, targetDeckId, null);
        window.location.reload();
      } catch (error) {
        window.alert(error.message);
      }
    });
  });

  folderRows.forEach((row) => {
    row.addEventListener("dragstart", (event) => {
      startFolderDrag(row.dataset.folderId, row, event);
    });

    row.addEventListener("dragend", () => {
      resetDragState();
    });

    row.addEventListener("dragover", (event) => {
      const targetFolderId = row.dataset.folderId;
      if (!targetFolderId) return;
      if (dragState.type === "folder" && dragState.folderId === targetFolderId) return;
      if (dragState.type !== "folder" && dragState.type !== "deck") return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      row.classList.add("folder-row-drop-target");
    });

    row.addEventListener("dragleave", () => {
      row.classList.remove("folder-row-drop-target");
    });

    row.addEventListener("drop", async (event) => {
      event.preventDefault();
      row.classList.remove("folder-row-drop-target");
      const source = getDropSource(event);

      const targetFolderId = row.dataset.folderId;
      if (!targetFolderId) return;

      try {
        // Deck dropped on folder row: move deck into this folder.
        if (source.type === "deck") {
          if (!source.id) return;
          await organizeDecks(source.id, null, targetFolderId);
          window.location.reload();
          return;
        }

        // Folder dropped on folder row: prompt user and merge into a new folder.
        if (source.type === "folder") {
          if (!source.id || source.id === targetFolderId) return;
          const name = window.prompt("Name for the new folder:");
          if (!name) return;
          await mergeFolders(source.id, targetFolderId, name.trim());
          window.location.reload();
        }
      } catch (error) {
        window.alert(error.message);
      }
    });
  });

  folderToggles.forEach((toggle) => {
    toggle.setAttribute("draggable", "true");
    toggle.addEventListener("dragstart", (event) => {
      const row = toggle.closest(".folder-row");
      if (!row) return;
      startFolderDrag(row.dataset.folderId, row, event);
      event.stopPropagation();
    });
    toggle.addEventListener("dragend", () => {
      resetDragState();
    });
  });
});
