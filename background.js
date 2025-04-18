chrome.runtime.onInstalled.addListener(() => {
  // Сохраняем настройки по умолчанию
  chrome.storage.sync.set({ selectedSearchEngine: "Google" });
});

chrome.action.onClicked.addListener((tab) => {
    chrome.storage.sync.get(['searchEngines', 'selectedSearchEngine'], (data) => {
      const engineURL = data.searchEngines?.[data.selectedSearchEngine];
  
      if (engineURL) {
        const query = prompt("Введите поисковый запрос:");
        if (query) {
          const url = engineURL.replace('%s', encodeURIComponent(query));
          chrome.tabs.create({ url });
        }
      } else {
        alert("Поисковик не выбран или не найден.");
      }
    });
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