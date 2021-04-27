function createImg(params) {
  const { width, height } = params
  var imgconfig = {}
  // 处理图片宽高不传的情况
  imgconfig.imageObj = new Image()
  imgconfig.imageObj.src = imgUrl
  imgconfig.width = width ? width : imageObj.width
  imgconfig.height = height ? height : imageObj.height
  return new Konva.Image(Object.assign(params, imgconfig))
}
export default createImg
