<template>
  <div class="canvas-container">
    <canvas ref="canvas" gl="{{powerPreference: 'default', antialias: false}}"></canvas>
  </div>
  <FadeTransition>
    <HoverInfo
      v-show="hoveredStar.data"
      v-bind="hoveredStar"
      :show-more-button="displayedProfile?.id !== hoveredStar.data?.id"
      @show-more="displayHoveredProfile"
    />
  </FadeTransition>

  <FadeTransition>
    <SidebarInfo v-if="displayedProfile" :profile="displayedProfile" @close="closeProfile" />
  </FadeTransition>
</template>

<script lang="ts" setup>
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
  Object3D,
  Raycaster,
  Vector2,
  Vector3,
  TextureLoader,
  BackSide,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { onMounted, reactive, ref, watch } from 'vue'

import FadeTransition from '#components/transitions/FadeTransition.vue'
import { starmapQuery, StarmapQueryResult, StarLine, Star } from '#queries/starmapQuery'

import HoverInfo from './HoverInfo.vue'
import SidebarInfo from './SidebarInfo.vue'

import type { UserWithProfile } from '#stores/userStore'

const starData = ref<Star[]>([])

const canvas = ref<HTMLCanvasElement | null>(null)

type HoveredStar = {
  data: UserWithProfile | null
  x: number
  y: number
}

const hoveredStar = reactive<HoveredStar>({
  data: null,
  x: 0,
  y: 0,
})

const displayedProfile = ref<UserWithProfile | null>(null)

const displayProfile = (data: UserWithProfile) => {
  displayedProfile.value = data
}

const displayHoveredProfile = () => {
  displayedProfile.value = hoveredStar.data
}

const closeProfile = () => {
  displayedProfile.value = null
}

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

class StarMesh extends Mesh {
  star: Star

  constructor(sphereGeometry: SphereGeometry, meshBasicMaterial: MeshBasicMaterial, star: Star) {
    super(sphereGeometry, meshBasicMaterial)
    this.star = star
  }
}

const stars: StarMesh[] = []

// Erhöht den Radius der Sphäre, um Verzerrungen zu reduzieren
const SPHERE_RADIUS = 4500 // Angepasster Radius der Sphäre
const STAR_RADIUS = 15

let renderer: WebGLRenderer
let camera: PerspectiveCamera
let scene: Scene
let raycaster: Raycaster
let mouse: Vector2

// Initialisiert die 3D-Szene, Kamera, Renderer und Steuerungen
const initScene = () => {
  const { width, height } = getDimensions()

  // Erstellt eine neue Three.js-Szene
  scene = new Scene()

  // Erstellt eine Kamera mit einem Sichtfeld, um die Sphäre darzustellen
  camera = new PerspectiveCamera(45, width / height, 0.1, 10000)
  // Positioniert die Kamera leicht versetzt vom Mittelpunkt der Szene
  camera.position.set(0, 0, 2250)

  // Erstellt einen Renderer und weist ihm das Canvas-Element zu
  renderer = new WebGLRenderer({ canvas: canvas.value!, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true

  // Lädt die Textur für den Weltraumhintergrund
  const textureLoader = new TextureLoader()
  const spaceTexture = textureLoader.load(
    'https://raw.githubusercontent.com/ogerly/playstuff/main/dskSu.jpg',
  )
  const sphereGeometry = new SphereGeometry(SPHERE_RADIUS, 64, 64)
  const sphereMaterial = new MeshBasicMaterial({
    map: spaceTexture,
    side: BackSide, // Textur wird auf der Innenseite der Sphäre angezeigt
    transparent: true, // Ermöglicht die Transparenz
    opacity: 0.5, // Setzt die Transparenz für das Hintergrundbild
  })
  const sphere = new Mesh(sphereGeometry, sphereMaterial)
  scene.add(sphere)

  // Fügt Steuerungen für die Kamera hinzu, ermöglicht das Schwenken, Drehen und Zoomen
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = false // Deaktiviert das Zoomen
  controls.enablePan = false // Deaktiviert das Schwenken
  controls.enableDamping = true // Fügt eine Dämpfung für sanftere Bewegungen hinzu
  controls.dampingFactor = 0.1
  controls.minPolarAngle = Math.PI / 2 - Math.PI / 9 // Begrenzung nach unten: 50° vom Äquator (90° - 20° = 70°)
  controls.maxPolarAngle = Math.PI / 2 + Math.PI / 9 // Begrenzung nach oben: 130° vom Äquator (90° + 20° = 110°)

  raycaster = new Raycaster()
  mouse = new Vector2()

  // Fügt das dezente Raster zur Sphäre hinzu
  createDezentGrid()

  // Startet die Animationsschleife
  const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // Fügt Event-Listener für das Anpassen der Fenstergröße hinzu
  window.addEventListener('resize', onWindowResize)

  canvas.value?.addEventListener('click', onCanvasClick)
  canvas.value?.addEventListener('pointermove', onCanvasMouseMove)
}

// Erstellt ein dezentes Raster auf der Sphäre
const createDezentGrid = () => {
  const gridMaterial = new LineBasicMaterial({
    color: 0x00ffff, // Leichte Farbe, z.B. ein helles Cyan
    transparent: true,
    opacity: 0.1, // Sehr transparent, um das Raster dezent erscheinen zu lassen
    linewidth: 1, // Dünne Linien
  })

  // Erstellt die Geometrie und Linien für die Meridiane (Längengrade)
  for (let i = 0; i < 24; i++) {
    const phi = (i / 24) * Math.PI * 2
    const meridianPoints = []

    for (let j = 0; j <= 64; j++) {
      const theta = (j / 64) * Math.PI
      meridianPoints.push(new Vector3(...cartesianFromSphere(theta, phi, SPHERE_RADIUS)))
    }

    const geometry = new BufferGeometry().setFromPoints(meridianPoints)
    const meridianLine = new Line(geometry, gridMaterial)
    scene.add(meridianLine)
  }

  // Erstellt die Geometrie und Linien für die Parallelen (Breitengrade)
  for (let i = 1; i < 12; i++) {
    const theta = (i / 12) * Math.PI
    const parallelPoints = []

    for (let j = 0; j <= 64; j++) {
      const phi = (j / 64) * Math.PI * 2
      parallelPoints.push(new Vector3(...cartesianFromSphere(theta, phi, SPHERE_RADIUS)))
    }

    const geometry = new BufferGeometry().setFromPoints(parallelPoints)
    const parallelLine = new Line(geometry, gridMaterial)
    scene.add(parallelLine)
  }
}

// Fügt Sterne zur Szene hinzu, basierend auf den Daten aus der Datenbankabfrage
const addStars = (data: Star[]) => {
  data.forEach((data) => {
    // Erstellt eine Sphäre für jeden Stern basierend auf seiner Magnitude
    const starGeometry = new SphereGeometry(STAR_RADIUS * data.magnitude, 16, 16)
    const starMaterial = new MeshBasicMaterial({ color: 0xffffff })

    const hoverStarGeometry = new SphereGeometry(STAR_RADIUS * data.magnitude * 5, 16, 16)
    const hoverStarMaterial = new MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0,
      transparent: true,
      alphaTest: 0.5,
    })

    // Berechnet die Position des Sterns auf der Sphäre
    const [x, y, z] = cartesianFromSphere(data.azimuth, data.altitude, data.distance)

    const star = new StarMesh(starGeometry, starMaterial, data)
    const hoverStar = new StarMesh(hoverStarGeometry, hoverStarMaterial, data)
    star.position.set(x, y, z)
    hoverStar.position.set(x, y, z)
    scene.add(star)
    scene.add(hoverStar)
    stars.push(hoverStar)
  })
}

// Fügt Linien zwischen den Sternen hinzu, um Konstellationen oder Verbindungen darzustellen
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

// Konvertiert sphärische Koordinaten (Azimut, Höhe, Entfernung) in kartesische Koordinaten (x, y, z)
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

// Passt die Szene und Kamera an die neue Fenstergröße an
const onWindowResize = () => {
  const { width, height } = getDimensions()
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

const onCanvasClick = (event: MouseEvent) => {
  const star = getRaycasterIntersects(event)
  if (star) {
    displayProfile(star.data)
  }
}

const onCanvasMouseMove = (event: PointerEvent) => {
  if (event.pointerType !== 'mouse') return
  const star = getRaycasterIntersects(event)
  if (!star) {
    hoveredStar.data = null
    return
  }
  // Get the position of the star on the screen
  const vector = new Vector3(...cartesianFromSphere(star.azimuth, star.altitude, star.distance))
  const canvas = renderer.domElement
  vector.project(camera)

  const x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio))
  const y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio))

  // Set data for info component
  hoveredStar.x = x
  hoveredStar.y = y
  hoveredStar.data = star.data
}

const getRaycasterIntersects = (event: MouseEvent): Star | undefined => {
  const rect = canvas.value?.getBoundingClientRect()
  if (!rect) return

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(stars)

  if (intersects.length > 0) {
    const { star } = intersects[0].object as Object3D & { star: Star }
    return star
  }
}

// Berechnet die Abmessungen des Canvas-Containers basierend auf der Fenstergröße
const getDimensions = (): { width: number; height: number } => ({
  width: window.innerWidth,
  height: window.innerHeight, // Sollte 85px in der mobilen Ansicht, 136px auf dem Desktop sein
})

// Startet die Initialisierung der Szene, sobald die Komponente gemountet ist
onMounted(() => {
  initScene()
})
</script>

<style scoped>
.canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  border: none;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
