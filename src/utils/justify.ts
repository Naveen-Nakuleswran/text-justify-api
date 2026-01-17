const max_length = 80;

export function justifyText(text: string): string {
  const output: string[] = [];
  const segments = text.split(/\n/);

  for (const segment of segments) {
    const trimmed = segment.trim();

    if (trimmed === "") {
      output.push("");
      continue;
    }

    const words = trimmed.split(/\s+/);
    const lines: string[] = [];
    let currentWords: string[] = [];
    let currentLength = 0;

    for (const word of words) {
      if (word.length > max_length) {
        if (currentWords.length) {
          lines.push(justifyLine(currentWords));
          currentWords = [];
          currentLength = 0;
        }
        lines.push(word);
        continue;
      }

      const additionalLength =
        currentWords.length === 0 ? word.length : 1 + word.length;
      if (currentLength + additionalLength <= max_length) {
        currentWords.push(word);
        currentLength += additionalLength;
      } else {
        lines.push(justifyLine(currentWords));
        currentWords = [word];
        currentLength = word.length;
      }
    }

    if (currentWords.length) {
      lines.push(currentWords.join(" "));
    }

    output.push(lines.join("\n"));
  }

  return output.join("\n");
}

function justifyLine(words: string[]): string {
  if (words.length === 1) {
    return words[0];
  }

  const totalWordsLength = words.reduce((sum, w) => sum + w.length, 0);
  const totalSpaces = max_length - totalWordsLength;
  const gaps = words.length - 1;

  const baseSpaces = Math.floor(totalSpaces / gaps);
  const extraSpaces = totalSpaces % gaps;

  let line = "";
  for (let i = 0; i < words.length; i++) {
    line += words[i];
    if (i < gaps) {
      line += " ".repeat(baseSpaces + (i < extraSpaces ? 1 : 0));
    }
  }
  return line;
}

export function countWords(text: string): number {
  const matches = text.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}
