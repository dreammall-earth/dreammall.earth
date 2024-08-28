<template>
  <div class="canvas-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { update as tweenUpdate } from '@tweenjs/tween.js'
import { useQuery } from '@vue/apollo-composable'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  SphereGeometry,
  MeshBasicMaterial,
  LineBasicMaterial,
  BufferGeometry,
  Line,
  Vector3,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { onMounted, ref, watch } from 'vue'

import { starmapQuery, StarmapQueryResult, StarLine, Star } from '#queries/starmapQuery'

const starData = ref<Star[]>([])

const canvas = ref<HTMLCanvasElement | null>(null)

const { result: starmapQueryResult } = useQuery(
  starmapQuery,
  {},
  {
    prefetch: false,
    fetchPolicy: 'no-cache',
  },
)

watch(starmapQueryResult, (data: { starmap: StarmapQueryResult }) => {
  addStars(data.starmap.stars)
  starData.value = data.starmap.stars

  data.starmap.starLines.forEach((l: StarLine) => addLine(l.from, l.to))
})

const stars: Mesh[] = []

const SPHERE_RADIUS = 2000
const STAR_RADIUS = 10

let renderer: WebGLRenderer
let camera: PerspectiveCamera
let scene: Scene

const initScene = () => {
  const { width, height } = getDimensions()

  scene = new Scene()
  camera = new PerspectiveCamera(90, width / height, 0.1, 5000)
  renderer = new WebGLRenderer({ canvas: canvas.value!, antialias: true })

  camera.position.set(0, 0, 500)
  camera.lookAt(5000, 0, 0)

  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true

  const controls = new OrbitControls(camera, renderer.domElement)

  controls.enableZoom = false
  controls.enablePan = false
  controls.enableDamping = true
  controls.dampingFactor = 0.1
  controls.minPolarAngle = 0
  controls.maxPolarAngle = Math.PI

  /* this line helps to no get lost in space
      const equatorMaterial = new LineBasicMaterial({ color: 0xff0000, linewidth: 3 })
      const equatorGeometry = new BufferGeometry()
      const points = []
      for (let i = 0; i <= 64; i++) {
      const phi = (i / 64) * Math.PI * 2
      points.push(new Vector3(3000 * Math.cos(phi), 0, 3000 * Math.sin(phi)))
      }
      equatorGeometry.setFromPoints(points)
      const equatorLine = new Line(equatorGeometry, equatorMaterial)
      scene.add(equatorLine)
    */

  const animate = () => {
    requestAnimationFrame(animate)
    tweenUpdate()
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  window.addEventListener('resize', onWindowResize)
}

const addStars = (data: Star[]) => {
  data.forEach((data) => {
    const starGeometry = new SphereGeometry(STAR_RADIUS * data.magnitude, 16, 16)
    const starMaterial = new MeshBasicMaterial({ color: 0xffffff })

    const [x, y, z] = cartesianFromSphere(data.azimuth, data.altitude, data.distance)

    const star = new Mesh(starGeometry, starMaterial)
    star.position.set(x, y, z)
    /*
        star.userData = {
        longitude: starData.longitude,
        latitude: starData.latitude,
        id: starData.id,
        }
      */
    scene.add(star)
    stars.push(star)
  })
}

const addLine = (from: string, to: string) => {
  const star1 = starData.value.find((s) => s.id === from)
  const star2 = starData.value.find((s) => s.id === to)

  if (star1 && star2) {
    const lineMaterial = new LineBasicMaterial({ color: 0xd3d3d3, linewidth: 1 })

    const [x1, y1, z1] = cartesianFromSphere(star1.azimuth, star1.altitude, star1.distance)

    const [x2, y2, z2] = cartesianFromSphere(star2.azimuth, star2.altitude, star2.distance)

    const lineGeometry = new BufferGeometry().setFromPoints([
      new Vector3(x1, y1, z1),
      new Vector3(x2, y2, z2),
    ])

    const line = new Line(lineGeometry, lineMaterial)

    scene.add(line)
  }
}

const cartesianFromSphere = (azimuth: number, altitude: number, distance: number): number[] => {
  const theta = Math.PI / 2 - altitude
  const phi = azimuth - Math.PI / 2
  const r = SPHERE_RADIUS * distance

  return [
    r * Math.sin(theta) * Math.cos(phi),
    r * Math.cos(theta),
    r * Math.sin(theta) * Math.sin(phi),
  ]
}

const onWindowResize = () => {
  const { width, height } = getDimensions()
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

const getDimensions = (): { width: number; height: number } => ({
  width: window.innerWidth,
  height: window.innerHeight - 136, // should by 85 in mobile, 136 on desktop
})

onMounted(() => {
  initScene()
})
</script>

<style scoped lang="scss">
@use 'sass:map';
@import 'vuetify/lib/styles/settings/_variables';

.canvas-container {
  --bottom-height: 136px;

  width: 100%;
  height: calc(100vh - var(--v-layout-top) - var(--bottom-height));
  overflow: hidden;
  position: relative;
  border: none;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

@media #{map.get($display-breakpoints, 'sm-and-down')} {
  .container {
    --bottom-height: 85px;
  }
}
</style>
