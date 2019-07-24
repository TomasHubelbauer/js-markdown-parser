import names from 'all-the-package-names';
import fetch from 'node-fetch';
import parse from './parse.mjs';
import serialize from './serialize.mjs';
import util from 'util';

void async function () {
  for (const name of names) {
    console.log(name);
    try {
      const response = await fetch('https://skimdb.npmjs.com/registry/' + name);
      const data = await response.json();
      try {
        console.log(data.readme);
        const blocks = parse(data.readme);
        console.log(util.inspect(blocks, false, null, true));
        if (serialize(blocks) !== markdown) {
          console.log(JSON.stringify(markdown));
          console.log(JSON.stringify(serialize(blocks)));
          throw new Error('Serialized blocks did not match the original MarkDown.');
        }
      } catch (error) {
        console.log(error);
        break;
      }
    } catch (error) {
      console.log(error);
    }
  }
}()
