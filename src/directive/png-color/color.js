import { calculateBestTextColor, traverseDomTagName } from '@/utils'

const dropShadow = (img, bg) => {
  const pngColor = calculateBestTextColor(bg)

  img.parentElement.style.overflow = 'hidden'

  img.style.position = 'relative'
  img.style.filter =
    'drop-shadow(' + (img.offsetWidth + 1) + 'px 0 ' + pngColor + ')'

  img.style.left = '-' + (img.offsetWidth + 1) + 'px'
}

export default {
  componentUpdated(el, binding) {
    const bgColor = binding.value || '#000'

    const img = traverseDomTagName(el, 'IMG')

    if (img) {
      const image = new Image()
      image.crossOrigin = ''
      image.src = img.src
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0)
        const imageData = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight)

        let hasAlpha = false
        for (let i = 3; i < imageData.data.length - 1; i += 4) {
          if (imageData.data[i] !== 255) {
            hasAlpha = true
            break
          }
        }

        if (hasAlpha) {
          setTimeout(() => {
            const dealImg = traverseDomTagName(el, 'IMG')

            dealImg && dropShadow(dealImg, bgColor)
          }, 50)
        } else {
          let hasWhite = false

          for (let i = 0; i < imageData.data.length; i += 4) {
            const R = imageData.data[i]
            const G = imageData.data[i + 1]
            const B = imageData.data[i + 2]

            if (Math.sqrt(Math.pow(R - 255, 2) + Math.pow(G - 255, 2) + Math.pow(B - 255, 2)) <= 20) {
              hasWhite = true
              imageData.data[i] = 0
              imageData.data[i + 1] = 0
              imageData.data[i + 2] = 0
              imageData.data[i + 3] = 0
            }
          }

          if (hasWhite) {
            const replaceCanvas = document.createElement('canvas')
            replaceCanvas.width = img.naturalWidth
            replaceCanvas.height = img.naturalHeight
            const replaceCtx = replaceCanvas.getContext('2d')
            replaceCtx.putImageData(imageData, 0, 0)

            img.src = replaceCanvas.toDataURL('image/png', 1)

            setTimeout(() => {
              const dealImg = traverseDomTagName(el, 'IMG')

              dealImg && dropShadow(dealImg, bgColor)
            }, 50)
          }
        }
      }
    }
  }
}
