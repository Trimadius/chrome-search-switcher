const select = document.getElementById('searchEngineSelect');
const searchInput = document.getElementById('searchQuery');
const searchButton = document.getElementById('searchButton');
const toggleAddBtn = document.getElementById('toggleAddEngine');
const customEngineSection = document.getElementById('customEngineSection');

const addButton = document.getElementById('addButton');
const engineNameInput = document.getElementById('engineName');
const engineUrlInput = document.getElementById('engineUrl');

// Загружаем список поисковиков
chrome.storage.sync.get(['searchEngines', 'selectedSearchEngine'], (data) => {
  const defaultEngines = {
    Google: 'https://www.google.com/search?q=%s',
    Bing: 'https://www.bing.com/search?q=%s',
    DuckDuckGo: 'https://duckduckgo.com/?q=%s'
  };

  const engines = data.searchEngines || defaultEngines;
  const selected = data.selectedSearchEngine || 'Google';

  for (const [name, url] of Object.entries(engines)) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  }

  select.value = selected;

  // Сохраняем, если список был пуст
  if (!data.searchEngines) {
    chrome.storage.sync.set({ searchEngines: engines });
  }
});

// Выполнить поиск
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  const selected = select.value;

  if (!query) {
    alert("Введите поисковый запрос");
    return;
  }

  chrome.storage.sync.get('searchEngines', (data) => {
    const engineURL = data.searchEngines?.[selected];
    if (engineURL) {
      const searchURL = engineURL.replace('%s', encodeURIComponent(query));
      chrome.tabs.create({ url: searchURL });
    } else {
      alert("Не удалось найти выбранный поисковик.");
    }
  });
});

// Показываем/скрываем раздел добавления поисковика
toggleAddBtn.addEventListener('click', () => {
  customEngineSection.style.display =
    customEngineSection.style.display === 'none' ? 'block' : 'none';
});

// Добавляем новый поисковик
addButton.addEventListener('click', () => {
  const name = engineNameInput.value.trim();
  let url = engineUrlInput.value.trim();

  if (!name) {
    alert("Введите название поисковика.");
    return;
  }

  // Популярные шаблоны
  const knownTemplates = {
    'google': 'https://www.google.com/search?q=%s',
    'yandex': 'https://yandex.kz/search/?text=%s',
    'duckduckgo': 'https://duckduckgo.com/?q=%s',
    'bing': 'https://www.bing.com/search?q=%s',
    'brave': 'https://search.brave.com/search?q=%s',
    'startpage': 'https://www.startpage.com/do/search?q=%s'
  };

  // Попробуем подставить шаблон, если URL не указан
  if (!url && knownTemplates[name.toLowerCase()]) {
    url = knownTemplates[name.toLowerCase()];
  }

  // Если URL не содержит %s — ошибка
  if (!url || !url.includes('%s')) {
    alert("Введите корректный URL. Он должен содержать %s — это место, куда будет подставляться запрос.");
    return;
  }

  // Сохраняем
  chrome.storage.sync.get('searchEngines', (data) => {
    const engines = data.searchEngines || {};
    engines[name] = url;

    chrome.storage.sync.set({ searchEngines: engines }, () => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
      select.value = name;

      engineNameInput.value = '';
      engineUrlInput.value = '';
      customEngineSection.style.display = 'none';
      alert(`Поисковик "${name}" добавлен!`);
    });
  });
});