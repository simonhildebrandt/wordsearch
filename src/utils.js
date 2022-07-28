export function linkToPuzzle(puzzle) {
  return '?puzzle=' + window.btoa(JSON.stringify(puzzle));
}
