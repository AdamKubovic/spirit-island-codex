export async function run(page) {
  for (const name of ['fast', 'slow']) {
    const result = await page.evaluate(async (n) => {
      const img = new Image()
      img.src = `/elements/${n}.png`
      await img.decode()
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
      // histogram of opaque pixels, quantized to nearest 16 per channel
      const counts = new Map()
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 200) continue
        const key = [data[i], data[i + 1], data[i + 2]].map((v) => Math.round(v / 16) * 16).join(',')
        counts.set(key, (counts.get(key) ?? 0) + 1)
      }
      // mean color over opaque pixels, plus the single most common exact color
      let rSum = 0, gSum = 0, bSum = 0, n3 = 0
      const exact = new Map()
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 200) continue
        rSum += data[i]; gSum += data[i + 1]; bSum += data[i + 2]; n3++
        const key = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2]
        exact.set(key, (exact.get(key) ?? 0) + 1)
      }
      const mean = [rSum / n3, gSum / n3, bSum / n3].map(Math.round)
      const hex = (v) => '#' + v.map((x) => x.toString(16).padStart(2, '0')).join('')
      const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
      const mode = [...exact.entries()].sort((a, b) => b[1] - a[1])[0]
      console.log(`${n} mean ${hex(mean)} mode #${mode[0].toString(16).padStart(6, '0')} x${mode[1]}`)
      return top.map(([rgb, n2]) => {
        const [r, g, b] = rgb.split(',').map(Number)
        const h = '#' + [r, g, b].map((v) => Math.min(255, v).toString(16).padStart(2, '0')).join('')
        return `${h} x${n2}`
      })
    }, name)
    console.log(name, '=>', result.join('  '))
  }
}
