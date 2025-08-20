export const getAspectWidthAndHeight = (width: number, height: number, aspectRatio: string) => {
  const [aspectWidth, aspectHeight] = aspectRatio.split(":").map(Number)
  const targetAspectRatio = Number((aspectWidth / aspectHeight).toFixed(2))
  const currentAspectRatio = Number((width / height).toFixed(2))

  // Adjust the width or height to maintain the aspect ratio
  if (currentAspectRatio > targetAspectRatio) {
    // Current width is too wide, adjust width
    width = Number((height * targetAspectRatio).toFixed(2))
  } else {
    // Current height is too tall, adjust height
    height = Number((width / targetAspectRatio).toFixed(2))
  }
  return [width, height]
}

const renderImageOnCanvas = (imageElement: any, preferedWidth: number, preferedHeight: number, maintainAspectRatio: boolean) => {
  const [canvasWidth, canvasHeight] = maintainAspectRatio ?
    getAspectWidthAndHeight(preferedWidth, preferedHeight, `${imageElement.width}:${imageElement.height}`) :
    [preferedWidth, preferedHeight]

  const canvas = document.createElement("canvas")
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height)
  return canvas
}

function generateImageThumbnail(file: File, { width = 200, height = 200, maintainAspectRatio = true, type = "image/jpeg", quality = 0.75 }): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = async () => {
      const canvas = renderImageOnCanvas(image, width, height, maintainAspectRatio)
      URL.revokeObjectURL(image.src)
      image.remove()

      canvas.toBlob((blob) => {
        canvas.width = 0
        canvas.height = 0
        resolve(blob as Blob)
      }, type, quality)
    }
    image.onerror = (e) => reject(e)
  })
}

export default generateImageThumbnail