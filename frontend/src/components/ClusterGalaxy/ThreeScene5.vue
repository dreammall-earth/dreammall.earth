<template>
  <div class="canvas-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default defineComponent({
  setup() {
    const canvas = ref<HTMLCanvasElement | null>(null);
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let gridLines: THREE.LineSegments;
    const intersectionPoints: THREE.Mesh[] = [];

    const initScene = () => {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 5000);
      camera.position.z = 1500;

      renderer = new THREE.WebGLRenderer({ canvas: canvas.value!, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.minPolarAngle = Math.PI / 2 - Math.PI / 8;
      controls.maxPolarAngle = Math.PI / 2 + Math.PI / 8;

      createGridWithIntersections();
      createStars();

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      window.addEventListener('resize', onWindowResize);
    };

    const createGridWithIntersections = () => {
      const gridGeometry = new THREE.EdgesGeometry(new THREE.SphereGeometry(3000, 32, 32)); // Engeres Gitter durch Erhöhung der Segmente
      const gridMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.2 });
      gridLines = new THREE.LineSegments(gridGeometry, gridMaterial);
      scene.add(gridLines);

      // Schnittpunkte auf dem Kugelgitter hinzufügen
      const gridVertices = gridGeometry.attributes.position.array;
      const intersectionMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const intersectionGeometry = new THREE.SphereGeometry(10, 8, 8);

      for (let i = 0; i < gridVertices.length; i += 3) {
        const x = gridVertices[i];
        const y = gridVertices[i + 1];
        const z = gridVertices[i + 2];
        const intersectionMesh = new THREE.Mesh(intersectionGeometry, intersectionMaterial);
        intersectionMesh.position.set(x, y, z);
        intersectionPoints.push(intersectionMesh);
        scene.add(intersectionMesh);
      }
    };

    const createStars = () => {
      const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00 });
      const starGeometry = new THREE.SphereGeometry(45, 32, 32);

      const numberOfStars = 100;
      for (let i = 0; i < numberOfStars; i++) {
        const starPosition = getRandomPositionOnSphere(2500);
        const starMesh = new THREE.Mesh(starGeometry, starMaterial);
        starMesh.position.set(starPosition.x, starPosition.y, starPosition.z);
        starMesh.castShadow = true;
        scene.add(starMesh);
      }
    };

    const getRandomPositionOnSphere = (radius: number) => {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    onMounted(() => {
      initScene();
    });

    return {
      canvas,
    };
  },
});
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
