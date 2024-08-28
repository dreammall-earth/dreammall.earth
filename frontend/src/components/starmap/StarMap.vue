<template>
  <div class="canvas-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { update as tweenUpdate } from '@tweenjs/tween.js'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  SphereGeometry,
  MeshBasicMaterial,
  /*
  LineBasicMaterial,
  BufferGeometry,
  Line,
   Vector3,
   */
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { onMounted, ref } from 'vue'

type Star = {
  id: string
  azimuth: number // longitude in radients 0 <= azimuth <= 2 * pi
  altitude: number // latitude in radients - pi / 2 <= altitude <= pi / 2
  distance: number // relative distance
  magnitude: number // relative size
  color: number // relative color
}

const canvas = ref<HTMLCanvasElement | null>(null)

const stars: Mesh[] = []

const SPHERE_RADIUS = 3000
const STAR_RADIUS = 10

const initScene = () => {
  const scene = new Scene()
  const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 5000)
  const renderer = new WebGLRenderer({ canvas: canvas.value!, antialias: true })

  camera.position.z = 1500

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true

  const controls = new OrbitControls(camera, renderer.domElement)

  controls.enableZoom = true
  controls.enablePan = false
  controls.enableDamping = true
  controls.dampingFactor = 0.1
  controls.minPolarAngle = -Math.PI / 2
  controls.maxPolarAngle = Math.PI / 2

  /*
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

  addStars(
    [
      {
        id: 's1',
        azimuth: 0.0,
        altitude: 0.0,
        distance: 1,
        magnitude: 1,
        color: 1,
      },
      {
        id: 's2',
        azimuth: Math.PI / 4,
        altitude: Math.PI / 4,
        distance: 1,
        magnitude: 1,
        color: 1,
      },
      {
        id: 's3',
        azimuth: -Math.PI / 4,
        altitude: Math.PI / 6,
        distance: 1,
        magnitude: 1,
        color: 1,
      },
      {
        id: 's4',
        azimuth: -Math.PI / 6,
        altitude: (2 * Math.PI) / 6,
        distance: 1,
        magnitude: 1,
        color: 1,
      },
      {
        id: 's5',
        azimuth: (-2 * Math.PI) / 6,
        altitude: -Math.PI / 6,
        distance: 1,
        magnitude: 1,
        color: 1,
      },
    ],
    scene,
  )

  const animate = () => {
    requestAnimationFrame(animate)
    tweenUpdate()
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
}

const addStars = (data: Star[], scene: Scene) => {
  data.forEach((starData) => {
    const starGeometry = new SphereGeometry(STAR_RADIUS * starData.magnitude, 16, 16)
    const starMaterial = new MeshBasicMaterial({ color: 0xffffff })

    const theta = Math.PI / 2 - starData.altitude
    const phi = starData.azimuth - Math.PI / 2
    const r = SPHERE_RADIUS * starData.distance

    const x = r * Math.sin(theta) * Math.cos(phi)
    const y = r * Math.cos(theta)
    const z = r * Math.sin(theta) * Math.sin(phi)

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

onMounted(() => {
  initScene()
})
</script>

<style scoped lang="scss">
.canvas-container {
  background-color: #000;
  width: 100%;
  height: 100%;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
