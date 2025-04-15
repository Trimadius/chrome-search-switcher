chrome.runtime.onInstalled.addListener(() => {
  // Сохраняем настройки по умолчанию
  chrome.storage.sync.set({ selectedSearchEngine: "Google" });
});

chrome.action.onClicked.addListener((tab) => {
  // Открываем popup при клике на иконку
  chrome.action.openPopup();
});

// Функция для изменения поисковика
function setSearchEngine(engine) {
  chrome.storage.sync.set({ selectedSearchEngine: engine });
}

// Слушаем запросы от popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "setSearchEngine") {
    setSearchEngine(message.engine);
  }
});