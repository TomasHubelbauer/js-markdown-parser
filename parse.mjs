// https://github.github.com/gfm/
export default function parse(/** @type {String} */ markdown) {
  const blocks = [];
  let lineNumber = 0;
  let characterNumber = 0;
  let state;

  function throwError(/** @type {String} */ character, /** @type {String} */ message = 'Not implemented') {
    const error = new Error(`${message} on character ${JSON.stringify(character)} (${character.charCodeAt(0)} DEC, ${character.charCodeAt(0).toString(16)} HEX) in state "${state}" at line ${lineNumber}, character ${characterNumber}.`);
    const stack = error.stack.split('\n');

    // Remove the stack frame of this helper function
    stack.splice(1, 1);

    // Remove the stack frames not in user code
    stack.splice(-8, 8);

    error.stack = stack.join('\n');
    throw error;
  }


  function breakLine() {
    lineNumber++;
    characterNumber = 0;
  }

  function addEmpty() {
    blocks.push({ type: 'empty' });
    state = 'after-block';
  }

  function addHeading() {
    blocks.push({ type: 'heading', level: 1, inlines: [] });
    state = 'in-heading';
  }

  function extendSpan(character) {
    const block = blocks[blocks.length - 1];
    if (block.type === 'empty') {
      block.type = 'paragraph';
      block.inlines = [];
    }

    let inline = block.inlines[block.inlines.length - 1];
    if (!inline) {
      inline = { type: 'span', text: '' };
      block.inlines.push(inline);
    }

    inline.text += character;
  }

  // Order the state `case` statements alphabetically (with `undefined` top) and
  // the character `case` statements ordinally
  for (let character of markdown) {
    switch (state) {
      case undefined: {
        switch (character) {
          case '\n': {
            addEmpty();
            breakLine();
            break;
          }

          default: {
            throwError(character);
            break;
          }
        }

        break;
      }

      case 'after-block': {
        switch (character) {
          case '\n': {
            addEmpty();
            break;
          }

          case '#': {
            addHeading();
            break;
          }

          default: {
            extendSpan(character);
            state = 'in-paragraph';
            break;
          }
        }

        break;
      }

      case 'in-heading': {
        switch (character) {
          case '\n': {
            breakLine();
            state = 'after-block';
            break;
          }

          case '#': {
            throwError(character);
            break;
          }

          default: {
            extendSpan(character);
            break;
          }
        }

        break;
      }

      case 'in-paragraph': {
        switch (character) {
          case '\n': {
            breakLine();
            state = 'after-block';
            break;
          }

          default: {
            extendSpan(character);
            break;
          }
        }
        break;
      }

      default: {
        throwError(character, 'Unexpected state');
        break;
      }
    }

    characterNumber++;
  }

  return blocks;
}
