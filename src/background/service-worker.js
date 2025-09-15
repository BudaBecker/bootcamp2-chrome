// Evento disparado quando a extensão é instalada ou atualizada.
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extensão "Lembrete Rápido" foi instalada.');
  chrome.storage.local.set({
    quickNote: "Bem-vindo! Escreva seu primeiro lembrete aqui.",
  });

  // Adiciona item ao menu de contexto
  chrome.contextMenus.create({
    id: "saveSelectionAsNote",
    title: "Salvar seleção como lembrete rápido",
    contexts: ["selection"],
  });
});

// Alarme periódico
chrome.alarms.create("checkNote", {
  periodInMinutes: 0.5,
});

// Mostra notificação a cada 5 minutos
chrome.alarms.create("notifyNote", {
  periodInMinutes: 5,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkNote") {
    chrome.storage.local.get(["quickNote"], (result) => {
      console.log(
        "Verificação periódica (a cada 30 seg). Nota atual:",
        result.quickNote || "Nenhuma nota definida."
      );
    });
  }
  if (alarm.name === "notifyNote") {
    chrome.storage.local.get(["quickNote"], (result) => {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png", // Certifique-se de ter esse ícone no seu projeto
        title: "Lembrete Rápido",
        message: result.quickNote || "Nenhuma nota definida.",
      });
    });
  }
});

// Comando para limpar a nota (adicione "commands" no manifest.json)
chrome.commands.onCommand.addListener((command) => {
  if (command === "clear_note") {
    chrome.storage.local.set({ quickNote: "" }, () => {
      console.log("Nota limpa pelo comando.");
    });
  }
});

// Salva seleção como nota via menu de contexto
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveSelectionAsNote" && info.selectionText) {
    chrome.storage.local.set({ quickNote: info.selectionText }, () => {
      console.log("Nota atualizada com a seleção:", info.selectionText);
    });
  }
});
