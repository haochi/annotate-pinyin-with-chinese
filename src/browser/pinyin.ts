(() => {
  const [CHINESE_CODE_POINT_START, CHINESE_CODE_POINT_END] = [0x4e00, 0x9fff];

  const sendBackgroundMessage = (payload: {
    [key: string]: unknown;
  }): Promise<unknown> => {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(
        (null as unknown) as string,
        payload,
        {},
        resolve
      );
    });
  };

  const isChinese = (char: string) => {
    const codePoint = char.codePointAt(0)!;
    return (
      CHINESE_CODE_POINT_START <= codePoint &&
      codePoint <= CHINESE_CODE_POINT_END
    );
  };

  const hasChinese = (str: string) => {
    for (let i = 0; i < str.length; i++) {
      const codePoint = str.codePointAt(i)!;
      if (
        CHINESE_CODE_POINT_START <= codePoint &&
        codePoint <= CHINESE_CODE_POINT_END
      ) {
        return true;
      }
    }
    return false;
  };

  const createRubyNode = (character: string, pinyin: string) => {
    const ruby = document.createElement('ruby');
    const leftRP = document.createElement('rp');
    const rightRP = document.createElement('rp');
    const rt = document.createElement('rt');
    const characterNode = document.createTextNode(character);
    leftRP.textContent = '(';
    rightRP.textContent = ')';
    rt.textContent = pinyin;
    rt.style.userSelect = 'none';
    ruby.appendChild(characterNode);
    ruby.appendChild(leftRP);
    ruby.appendChild(rt);
    ruby.appendChild(rightRP);
    return ruby;
  };

  const getTextNodesFromSelection = (selection: Selection) => {
    let commonAncestorContainer: Node = document.body;

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        commonAncestorContainer = range.commonAncestorContainer;
        while (commonAncestorContainer.nodeType === Node.TEXT_NODE) {
          commonAncestorContainer = commonAncestorContainer.parentElement!;
        }
      }
    }
    const textNodes: Node[] = [];
    const walker = document.createTreeWalker(
      commonAncestorContainer,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node = walker.nextNode();
    while (node) {
      if (node.parentNode!.nodeName !== 'RUBY') {
        if (hasChinese(node.nodeValue!)) {
          textNodes.push(node);
        }
      }
      node = walker.nextNode();
    }
    return textNodes;
  };

  const getCharactersFromTextNodes = (textNodes: Node[]): Set<string> => {
    const characters = new Set<string>();
    textNodes.forEach(node => {
      for (const character of node.textContent!) {
        if (isChinese(character)) {
          characters.add(character);
        }
      }
    });
    return characters;
  };

  const annotateTextNodesWithPinyin = (
    textNodes: Node[],
    characterToPinyinMap: {[key: string]: string}
  ) => {
    console.time('annotateTextNodesWithPinyin');
    for (const node of textNodes) {
      const fragment = document.createDocumentFragment();
      for (const character of node.nodeValue!) {
        if (character in characterToPinyinMap) {
          fragment.appendChild(
            createRubyNode(character, characterToPinyinMap[character])
          );
        } else {
          fragment.appendChild(document.createTextNode(character));
        }
      }
      node.parentElement?.replaceChild(fragment, node);
    }
    console.timeEnd('annotateTextNodesWithPinyin');
  };

  (async () => {
    const textNodes = getTextNodesFromSelection(window.getSelection()!);
    const characters = getCharactersFromTextNodes(textNodes);

    const characterToPinyinMap = (await sendBackgroundMessage({
      characters: Array.from(characters),
    })) as {
      [key: string]: string;
    };

    annotateTextNodesWithPinyin(textNodes, characterToPinyinMap);
  })();
})();
