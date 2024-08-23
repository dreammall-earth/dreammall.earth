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

      createFineGridWithIntersections();
      drawPrimeMeridian();
      drawEquator();
      drawHighlightedMeridiansAndParallels();

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      window.addEventListener('resize', onWindowResize);
    };

    const createFineGridWithIntersections = () => {
      const gridGeometry = new THREE.EdgesGeometry(new THREE.SphereGeometry(3000, 64, 64)); // Engeres Gitter
      const gridMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.2 });
      const gridLines = new THREE.LineSegments(gridGeometry, gridMaterial);
      scene.add(gridLines);
    };

    const drawPrimeMeridian = () => {
      const primeMeridianMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 3 });
      const primeMeridianGeometry = new THREE.BufferGeometry();
      const points = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI;
        points.push(new THREE.Vector3(0, 3000 * Math.cos(theta), 3000 * Math.sin(theta)));
      }
      primeMeridianGeometry.setFromPoints(points);
      const primeMeridianLine = new THREE.Line(primeMeridianGeometry, primeMeridianMaterial);
      scene.add(primeMeridianLine);
    };

    const drawEquator = () => {
      const equatorMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 3 });
      const equatorGeometry = new THREE.BufferGeometry();
      const points = [];
      for (let i = 0; i <= 64; i++) {
        const phi = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(3000 * Math.cos(phi), 0, 3000 * Math.sin(phi)));
      }
      equatorGeometry.setFromPoints(points);
      const equatorLine = new THREE.Line(equatorGeometry, equatorMaterial);
      scene.add(equatorLine);
    };

    const drawHighlightedMeridiansAndParallels = () => {
      const highlightedMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 });

      // Zeichne jeden zweiten Längengrad
      for (let i = 1; i <= 16; i++) {
        if (i % 2 === 0) {
          const meridianGeometry = new THREE.BufferGeometry();
          const meridianPoints = [];
          for (let j = 0; j <= 64; j++) {
            const theta = (j / 64) * Math.PI;
            const phi = (i / 16) * Math.PI * 2;
            meridianPoints.push(new THREE.Vector3(3000 * Math.sin(theta) * Math.cos(phi), 3000 * Math.cos(theta), 3000 * Math.sin(theta) * Math.sin(phi)));
          }
          meridianGeometry.setFromPoints(meridianPoints);
          const meridianLine = new THREE.Line(meridianGeometry, highlightedMaterial);
          scene.add(meridianLine);
        }
      }

      // Zeichne jeden zweiten Breitengrad
      for (let i = 1; i <= 32; i++) {
        if (i % 2 === 0) {
          const parallelGeometry = new THREE.BufferGeometry();
          const parallelPoints = [];
          const theta = (i / 32) * Math.PI;
          for (let j = 0; j <= 64; j++) {
            const phi = (j / 64) * Math.PI * 2;
            parallelPoints.push(new THREE.Vector3(3000 * Math.sin(theta) * Math.cos(phi), 3000 * Math.cos(theta), 3000 * Math.sin(theta) * Math.sin(phi)));
          }
          parallelGeometry.setFromPoints(parallelPoints);
          const parallelLine = new THREE.Line(parallelGeometry, highlightedMaterial);
          scene.add(parallelLine);
        }
      }
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
