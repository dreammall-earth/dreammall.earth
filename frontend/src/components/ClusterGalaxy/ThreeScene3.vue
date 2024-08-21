<template>
  <div class="canvas-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
// version 3
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
    let raycaster: THREE.Raycaster;
    let mouse: THREE.Vector2;
    const starMeshes: THREE.Mesh[] = [];
    let centralStar: THREE.Mesh;
    let pulseScale = 1;
    let pulseDirection = 1;
    const connections: THREE.Line[] = [];
    let connectionsVisible = false;

    const initScene = () => {
      scene = new THREE.Scene();

      // Kamera initialisieren
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
      camera.position.z = 1100;

      // Renderer initialisieren
      renderer = new THREE.WebGLRenderer({ canvas: canvas.value!, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      // OrbitControls hinzufügen
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = true;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.minPolarAngle = Math.PI / 2 - Math.PI / 8;
      controls.maxPolarAngle = Math.PI / 2 + Math.PI / 8;

      // Raycaster initialisieren
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      // Sphärenfläche erstellen (wie die Innenseite einer Kugel)
      const sphereGeometry = new THREE.SphereGeometry(3000, 64, 64, 0, Math.PI * 2, 0, Math.PI);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.BackSide,
      });

      const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(sphereMesh);

      // Sterne hinzufügen
      createStars();

      // Zentralen roten Stern hinzufügen und pulsieren lassen
      createCentralStar();

      // Verbindungen erstellen
      createConnections();

      // Animation
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();

        // Pulsationslogik
        pulseScale += 0.01 * pulseDirection;
        if (pulseScale > 1.2 || pulseScale < 0.8) {
          pulseDirection *= -1; // Richtungswechsel bei bestimmter Skalierung
        }
        centralStar.scale.set(pulseScale, pulseScale, pulseScale);

        // Verbindungen sichtbar machen, wenn aktiv
        connections.forEach(line => {
          line.visible = connectionsVisible;
        });

        renderer.render(scene, camera);
      };
      animate();

      window.addEventListener('resize', onWindowResize);
      canvas.value?.addEventListener('click', onCanvasClick);
    };

    const createStars = () => {
      const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const starGeometry = new THREE.SphereGeometry(15, 32, 32);

      const numberOfStars = 100;
      for (let i = 0; i < numberOfStars; i++) {
        const starPosition = getRandomPositionOnSphere(2500);
        const starMesh = new THREE.Mesh(starGeometry, starMaterial);
        starMesh.position.set(starPosition.x, starPosition.y, starPosition.z);
        starMeshes.push(starMesh);
        scene.add(starMesh);
      }
    };

    const createCentralStar = () => {
      const centralStarMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const centralStarGeometry = new THREE.SphereGeometry(30, 32, 32);

      centralStar = new THREE.Mesh(centralStarGeometry, centralStarMaterial);
      centralStar.position.set(0, 0, 0);
      scene.add(centralStar);
    };

    const createConnections = () => {
      const numberOfConnections = Math.floor(starMeshes.length * 0.1);
      for (let i = 0; i < numberOfConnections; i++) {
        const starMesh = starMeshes[i];

        const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const points = [];
        points.push(new THREE.Vector3(0, 0, 0)); // Zentraler Stern
        points.push(starMesh.position); // Stern, der verbunden wird

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        line.visible = false; // Startet als unsichtbar
        connections.push(line);
        scene.add(line);
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

    const onCanvasClick = (event: MouseEvent) => {
      const rect = canvas.value?.getBoundingClientRect();
      if (!rect) return;

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(starMeshes.concat(centralStar));

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject === centralStar) {
          connectionsVisible = !connectionsVisible; // Verbindungen ein- oder ausblenden
        } else {
          const intersectedPosition = intersectedObject.position;
          alert(`Stern angeklickt!\nKoordinaten: (${intersectedPosition.x.toFixed(2)}, ${intersectedPosition.y.toFixed(2)}, ${intersectedPosition.z.toFixed(2)})`);
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
