/**
 *
 * @param {*} id
 * @param {*} x
 * @param {*} y
 * @param {*} text
 * @param {*} fontSize
 * @param {*} fontFamily
 * @param {*} fill
 * @returns
 */
// https://konvajs.org/api/Konva.Text.html
// https://konvajs.org/docs/shapes/Text.html
function createText(params) {
  var simpleText = new Konva.Text(params)
  return simpleText
}
export default createText
