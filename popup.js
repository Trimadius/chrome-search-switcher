document.getElementById('saveButton').addEventListener('click', () => {
  const selectedEngine = document.getElementById('searchEngineSelect').value;

  // Отправляем сообщение в background для изменения поисковика
  chrome.runtime.sendMessage({ action: "setSearchEngine", engine: selectedEngine }, (response) => {
    alert("Поисковик изменен на: " + selectedEngine);
  });
});

// Загружаем текущий поисковик
chrome.storage.sync.get("selectedSearchEngine", (data) => {
  const engine = data.selectedSearchEngine || "Google";
  document.getElementById('searchEngineSelect').value = engine;
});