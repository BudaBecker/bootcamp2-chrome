const noteArea = document.getElementById("note-area");
const saveButton = document.getElementById("save-button");
const statusMessage = document.getElementById("status-message");
const clearButton = document.getElementById("clear-button");
const charCount = document.getElementById("char-count");

let lastSavedNote = "";
let autoSaveTimeout = null;

// Função para mostrar mensagens de status animadas
function showStatus(message, type = "success") {
  statusMessage.textContent = message;
  statusMessage.className = `show ${type}`;
  clearTimeout(statusMessage._timeout);
  statusMessage._timeout = setTimeout(() => {
    statusMessage.classList.remove("show");
  }, 1800);
}

// Carrega a nota salva e mostra a contagem de caracteres
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["quickNote"], (result) => {
    noteArea.value = result.quickNote || "";
    lastSavedNote = noteArea.value;
    updateCharCount();
    updateSaveButton();
  });
});

// Debounced auto-save ao digitar
noteArea.addEventListener("input", () => {
  updateCharCount();
  updateSaveButton();
  if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(() => {
    saveNote("Salvo automaticamente!");
  }, 400);
});

// Botão de salvar manual
saveButton.addEventListener("click", () => {
  saveNote("Lembrete salvo manualmente!");
});

// Botão para limpar a nota
clearButton.addEventListener("click", () => {
  if (!noteArea.value) {
    showStatus("Nada para limpar.", "error");
    return;
  }
  noteArea.value = "";
  chrome.storage.local.set({ quickNote: "" }, () => {
    lastSavedNote = "";
    updateCharCount();
    updateSaveButton();
    showStatus("Lembrete limpo!", "success");
  });
});

// Mostra a contagem de caracteres
function updateCharCount() {
  charCount.textContent = `${noteArea.value.length} caracteres`;
}

// Habilita/desabilita o botão de salvar
function updateSaveButton() {
  saveButton.disabled =
    noteArea.value === lastSavedNote || !noteArea.value.trim();
}

// Salva a nota e atualiza o estado
function saveNote(statusMsg) {
  const value = noteArea.value;
  chrome.storage.local.set({ quickNote: value }, () => {
    lastSavedNote = value;
    updateSaveButton();
    showStatus(statusMsg, "success");
  });
}
