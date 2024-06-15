<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col>
        <canvas ref="canvas"></canvas>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)

interface Point {
  x: number
  y: number
}

const createRandomClusters = (numClusters: number, width: number, height: number): Point[][] => {
  const clusters: Point[][] = []

  for (let i = 0; i < numClusters; i++) {
    const numPoints = Math.floor(Math.random() * 9) + 7
    const centerX = Math.random() * width
    const centerY = Math.random() * height
    const radius = Math.random() * 50 + 20
    const angleOffset = Math.random() * Math.PI * 2

    const points: Point[] = []
    for (let j = 0; j < numPoints; j++) {
      const angle = (j / numPoints) * Math.PI * 2 + angleOffset
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      points.push({ x, y })
    }
    clusters.push(points)
  }

  return clusters
}

const drawStars = (
  ctx: CanvasRenderingContext2D,
  stars: Point[],
  color: string,
  radius: number,
) => {
  ctx.fillStyle = color
  stars.forEach((star) => {
    ctx.beginPath()
    ctx.arc(star.x, star.y, radius, 0, Math.PI * 2)
    ctx.fill()
  })
}

const drawLines = (ctx: CanvasRenderingContext2D, clusters: Point[][]) => {
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 2
  clusters.forEach((cluster) => {
    ctx.beginPath()
    cluster.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.closePath()
    ctx.stroke()
  })
}

onMounted(() => {
  const width = window.innerWidth
  const height = window.innerHeight
  const clusters = createRandomClusters(14, width, height)

  if (canvas.value) {
    canvas.value.width = width
    canvas.value.height = height
    const ctx = canvas.value.getContext('2d')
    if (ctx) {
      const backgroundStars: Point[] = Array.from({ length: 100 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
      }))

      drawStars(ctx, backgroundStars, 'white', 2)
      drawLines(ctx, clusters)
      clusters.forEach((cluster) => drawStars(ctx, cluster, 'white', 5))

      canvas.value.addEventListener('mousemove', (event: MouseEvent) => {
        const rect = canvas.value!.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top

        ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height)
        drawStars(ctx, backgroundStars, 'white', 2)
        drawLines(ctx, clusters)

        clusters.forEach((cluster) => {
          cluster.forEach((point) => {
            const distance = Math.hypot(point.x - mouseX, point.y - mouseY)
            if (distance < 10) {
              drawStars(ctx, [point], 'orange', 10)
            } else {
              drawStars(ctx, [point], 'white', 5)
            }
          })
        })
      })
    }
  }
})
</script>

<style scoped>
.fill-height {
  background-color: black;
}
</style>
