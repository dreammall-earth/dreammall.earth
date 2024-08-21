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
    let raycaster: THREE.Raycaster;
    let mouse: THREE.Vector2;
    const starMeshes: THREE.Mesh[] = [];
    const backgroundStars: THREE.Points[] = [];

    const initScene = () => {
      scene = new THREE.Scene();

      // Kamera initialisieren
      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 5000);
      camera.position.z = 1500;

      // Renderer initialisieren
      renderer = new THREE.WebGLRenderer({ canvas: canvas.value!, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;

      // OrbitControls hinzufügen
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false; // Zoom deaktivieren
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
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        side: THREE.BackSide,
      });

      const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphereMesh.receiveShadow = true;
      scene.add(sphereMesh);

      // Punktlichtquelle hinzufügen, um den Effekt der Sonne zu simulieren
      const sunLight = new THREE.PointLight(0xffffff, 2, 10000);
      sunLight.position.set(0, 1000, 2000); // Positioniert das Licht leicht über und vor der Kamera
      sunLight.castShadow = true;
      scene.add(sunLight);

      // Umgebungslicht, um die Grundbeleuchtung der Szene zu erhalten
      const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
      scene.add(ambientLight);

      // Sterne hinzufügen
      createStars();

      // Hintergrundsterne für Parallax-Effekt hinzufügen
      createBackgroundStars();

      // Animation
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();

        // Parallax-Effekt durch Verschiebung der Hintergrundsterne
        backgroundStars.forEach(starField => {
          starField.position.x += 0.05 * (camera.position.x / 100);
          starField.position.y += 0.05 * (camera.position.y / 100);
        });

        renderer.render(scene, camera);
      };
      animate();

      window.addEventListener('resize', onWindowResize);
      canvas.value?.addEventListener('click', onCanvasClick);
    };

    const createStars = () => {
      const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00 });
      const starGeometry = new THREE.SphereGeometry(45, 32, 32);

      const numberOfStars = 100;
      for (let i = 0; i < numberOfStars; i++) {
        const starPosition = getRandomPositionOnSphere(2500);
        const starMesh = new THREE.Mesh(starGeometry, starMaterial);
        starMesh.position.set(starPosition.x, starPosition.y, starPosition.z);
        starMesh.castShadow = true; // Sterne werfen Schatten
        starMeshes.push(starMesh);
        scene.add(starMesh);
      }
    };

    const createBackgroundStars = () => {
      const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 5 });
      const starGeometry = new THREE.BufferGeometry();
      const starPositions = [];

      for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 5000;
        const y = (Math.random() - 0.5) * 5000;
        const z = -Math.random() * 5000; // Hintergrundsterne haben eine negative Z-Position
        starPositions.push(x, y, z);
      }

      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
      const starField = new THREE.Points(starGeometry, starMaterial);
      backgroundStars.push(starField);
      scene.add(starField);
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
      const intersects = raycaster.intersectObjects(starMeshes);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const intersectedPosition = intersectedObject.position;
        alert(`Stern angeklickt!\nKoordinaten: (${intersectedPosition.x.toFixed(2)}, ${intersectedPosition.y.toFixed(2)}, ${intersectedPosition.z.toFixed(2)})`);
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
