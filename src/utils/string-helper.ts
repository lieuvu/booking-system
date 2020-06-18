/**
 * Capitalize a string.
 *
 * @param str The string to capitalize
 * @returns The capitalized string.
 */
function capitalize(str: string) {
  const words = str.split(' ');

  for (let i = words.length - 1; i >= 0; i--) {
    const word = words[i];
    words[i] = word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
  }

  const capWords = words.join(' ');

  return capWords;
}

// Export
export { capitalize };
