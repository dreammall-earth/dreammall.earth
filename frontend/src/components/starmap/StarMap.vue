<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col>
        <svg ref="svg" width="100%" height="100vh"></svg>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { range } from 'd3-array'
import { select } from 'd3-selection'
import { onMounted, ref } from 'vue'

const svg = ref<SVGSVGElement | null>(null)

interface Point {
  x: number
  y: number
}

const createCluster = (
  centerX: number,
  centerY: number,
  numPoints: number,
  radius: number,
  angleOffset: number,
): Point[] => {
  const points: Point[] = []
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2 + angleOffset
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius
    points.push({ x, y })
  }
  return points
}

const clusters: Point[][] = range(7).map(() => {
  const centerX = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)
  const centerY = Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)
  const numPoints = Math.floor(Math.random() * (15 - 7 + 1)) + 7 // Random number between 7 and 15
  const radius = Math.random() * 100 + 50 // Random radius between 50 and 150
  const angleOffset = Math.random() * Math.PI * 2 // Random angle offset
  return createCluster(centerX, centerY, numPoints, radius, angleOffset)
})

const backgroundStars: Point[] = range(100).map(() => ({
  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
}))

onMounted(() => {
  if (svg.value) {
    const svgElement = select(svg.value)

    svgElement
      .selectAll('circle')
      .data(backgroundStars)
      .enter()
      .append('circle')
      .attr('cx', (d: Point) => d.x)
      .attr('cy', (d: Point) => d.y)
      .attr('r', 2)
      .style('fill', 'white')

    clusters.forEach((cluster) => {
      const clusterGroup = svgElement.append('g')

      clusterGroup
        .selectAll('line')
        .data(cluster)
        .enter()
        .append('line')
        .attr('x1', cluster[0].x)
        .attr('y1', cluster[0].y)
        .attr('x2', (d: Point) => d.x)
        .attr('y2', (d: Point) => d.y)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)

      clusterGroup
        .selectAll('circle.cluster')
        .data(cluster)
        .enter()
        .append('circle')
        .attr('cx', (d: Point) => d.x)
        .attr('cy', (d: Point) => d.y)
        .attr('r', 5)
        .attr('class', 'cluster')
        .style('fill', 'white')
        .on('mouseover', function () {
          select(this).attr('r', 7)
        })
        .on('mouseout', function () {
          select(this).attr('r', 5)
        })
        .on('click', function () {
          select(this).attr('r', 8)
        })
    })
  }
})
</script>

<style scoped>
.fill-height {
  background-color: black;
}

.cluster:hover {
  cursor: pointer;
}
</style>
