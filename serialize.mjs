export default function serialize(blocks) {
  let markdown = '';
  for (const block of blocks) {
    switch (block.type) {
      case 'empty': {
        markdown += '\n';
        break;
      }

      case 'heading': {
        markdown += '#'.repeat(block.level);
        for (const inline of block.inlines) {
          switch (inline.type) {
            case 'span': {
              markdown += inline.text;
              break;
            }

            default: {
              throw new Error(`Unexpected inline type "${inline.type}"!`);
            }
          }
        }

        markdown += '\n';
        break;
      }

      case 'paragraph': {
        markdown += '\n';
        for (const inline of block.inlines) {
          switch (inline.type) {
            case 'span': {
              markdown += inline.text;
              break;
            }

            default: {
              throw new Error(`Unexpected inline type "${inline.type}"!`);
            }
          }
        }

        markdown += '\n';
        break;
      }

      default: {
        throw new Error(`Unexpected block type "${block.type}"!`);
      }
    }
  }

  return markdown;
}
