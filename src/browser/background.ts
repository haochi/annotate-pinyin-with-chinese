let characterPinyinCache: {[key: string]: string} = {};

const setupContextMenu = async () => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      title: 'Annotate with Pinyin %s',
      contexts: ['selection'],
      async onclick(info, tab) {
        executePinyinScript(tab.id!);
      },
    });
  });

  fetch(chrome.extension.getURL('src/browser/unihan.json')).then(
    async response => {
      characterPinyinCache = await response.json();
    }
  );
};

const executePinyinScript = (tabId: number) => {
  chrome.tabs.executeScript(tabId, {
    file: 'src/browser/pinyin.js',
  });
};

const fetchCharactersMapping = (
  characters: string[]
): {[key: string]: string} => {
  const out: {[key: string]: string} = {};
  for (const char of characters) {
    out[char] = characterPinyinCache[char];
  }
  return out;
};

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();

  chrome.browserAction.onClicked.addListener(tab => {
    executePinyinScript(tab.id!);
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const {characters} = message as {characters: string[]};
  console.log(characters.length);
  sendResponse(fetchCharactersMapping(characters));
});
