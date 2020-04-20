import * as fs from 'fs';
import * as readline from 'readline';

type stringMap = {[key: string]: string};

const characterToPinyin: stringMap = {};

const readInterface = readline.createInterface(
  fs.createReadStream('./cache/Unihan_Readings.txt')
);

readInterface.on('line', line => {
  if (line.startsWith('U+')) {
    const [unicode, field, pinyin] = line.split('\t');
    if (field === 'kMandarin') {
      const charCode = parseInt(unicode.slice(2), 16);
      const character = String.fromCodePoint(charCode);
      characterToPinyin[character] = pinyin;
    }
  }
});

readInterface.on('close', () => {
  console.log(`loaded ${Object.keys(characterToPinyin).length} character.`);
  fs.writeFileSync(
    './build/src/browser/unihan.json',
    JSON.stringify(characterToPinyin),
    {
      encoding: 'utf-8',
    }
  );
});
