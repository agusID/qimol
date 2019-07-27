/**
 * @param {object} a 
 * @param {object} b 
 */
function sortForHighScore(a, b) {
  return (a.date > b.date) ? 1 : -1
}

/**
 * @param {array} data 
 */
export function sorted(data) {
  return data.sort(sortForHighScore)
}