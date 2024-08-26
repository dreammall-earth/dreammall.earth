<template>
  <div class="canvas-container">
    <canvas ref="canvas"></canvas>
    <div v-if="modalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <p>Längengrad: {{ selectedStar.longitude.toFixed(6) }}°</p>
        <p>Breitengrad: {{ selectedStar.latitude.toFixed(6) }}°</p>
        <p>Quadrant: {{ selectedStar.quadrant }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import TWEEN from '@tweenjs/tween.js';

export default defineComponent({
  props: {
    starData: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const canvas = ref<HTMLCanvasElement | null>(null);
    const modalVisible = ref(false);
    const selectedStar = ref({ longitude: 0, latitude: 0, quadrant: '' });
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let stars: THREE.Mesh[] = [];
    let redLongitudeLine: THREE.Line | null = null;
    let redLatitudeLine: THREE.Line | null = null;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const initScene = () => {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 5000);
      camera.position.z = 1500;

      renderer = new THREE.WebGLRenderer({ canvas: canvas.value!, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = true;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.minPolarAngle = Math.PI / 2 - Math.PI / 8;
      controls.maxPolarAngle = Math.PI / 2 + Math.PI / 8;

      createFineGridWithIntersections();
      drawPrimeMeridian();
      drawEquator();
      drawHighlightedMeridiansAndParallels();
      createColoredFieldsWithNumbers();
      createStars(props.starData);

      const animate = () => {
        requestAnimationFrame(animate);
        TWEEN.update();
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      window.addEventListener('resize', onWindowResize);
      window.addEventListener('click', onMouseClick);
      window.addEventListener('mousemove', onMouseMove);
    };

    const createFineGridWithIntersections = () => {
      const gridGeometry = new THREE.EdgesGeometry(new THREE.SphereGeometry(3000, 64, 64));
      const gridMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.2 });
      const gridLines = new THREE.LineSegments(gridGeometry, gridMaterial);
      scene.add(gridLines);
    };

    const drawPrimeMeridian = () => {
      const primeMeridianMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 3 });
      const primeMeridianGeometry = new THREE.BufferGeometry();
      const points = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI;
        points.push(new THREE.Vector3(0, 3000 * Math.cos(theta), 3000 * Math.sin(theta)));
      }
      primeMeridianGeometry.setFromPoints(points);
      const primeMeridianLine = new THREE.Line(primeMeridianGeometry, primeMeridianMaterial);
      scene.add(primeMeridianLine);

      const loader = new FontLoader();
      loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
        const textGeometry = new TextGeometry('0°', {
          font: font,
          size: 100,
          height: 5,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 3200, 0);
        textMesh.rotation.y = -Math.PI / 2;
        scene.add(textMesh);
      });
    };

    const drawEquator = () => {
      const equatorMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 3 });
      const equatorGeometry = new THREE.BufferGeometry();
      const points = [];
      for (let i = 0; i <= 64; i++) {
        const phi = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(3000 * Math.cos(phi), 0, 3000 * Math.sin(phi)));
      }
      equatorGeometry.setFromPoints(points);
      const equatorLine = new THREE.Line(equatorGeometry, equatorMaterial);
      scene.add(equatorLine);

      const loader = new FontLoader();
      loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
        const textGeometry = new TextGeometry('Äquator', {
          font: font,
          size: 100,
          height: 5,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(3200, 0, 0);
        textMesh.rotation.y = -Math.PI / 2;
        scene.add(textMesh);
      });
    };

    const drawHighlightedMeridiansAndParallels = () => {
      const highlightedMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 });

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

    const createColoredFieldsWithNumbers = () => {
      const colors = [0x4CAF50, 0x2196F3, 0xFFC107, 0xFF5722, 0x9C27B0, 0x00BCD4];
      let fieldCount = 0;

      const startLatitudeIndex = 8;
      const endLatitudeIndex = 23;
      const latStep = Math.PI / 32;

      for (let i = startLatitudeIndex; i <= endLatitudeIndex; i++) {
        const theta = (i / 32) * Math.PI;

        for (let j = 0; j < 16; j++) {
          const phi = (j / 16) * Math.PI * 2;
          const vertices = [];

          vertices.push(
            new THREE.Vector3(
              3000 * Math.sin(theta) * Math.cos(phi),
              3000 * Math.cos(theta),
              3000 * Math.sin(theta) * Math.sin(phi)
            ),
            new THREE.Vector3(
              3000 * Math.sin(theta + latStep) * Math.cos(phi),
              3000 * Math.cos(theta + latStep),
              3000 * Math.sin(theta + latStep) * Math.sin(phi)
            ),
            new THREE.Vector3(
              3000 * Math.sin(theta + latStep) * Math.cos(phi + Math.PI / 8),
              3000 * Math.cos(theta + latStep),
              3000 * Math.sin(theta + latStep) * Math.sin(phi + Math.PI / 8)
            ),
            new THREE.Vector3(
              3000 * Math.sin(theta) * Math.cos(phi + Math.PI / 8),
              3000 * Math.cos(theta),
              3000 * Math.sin(theta) * Math.sin(phi + Math.PI / 8)
            )
          );

          const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
          geometry.setIndex([0, 1, 2, 0, 2, 3]);

          const material = new THREE.MeshBasicMaterial({
            color: colors[fieldCount % colors.length],
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.3
          });

          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);

          const loader = new FontLoader();
          loader.load('/src/assets/fonts/Helvetica/font.json', (font) => {
            const label = `B${i}L${String.fromCharCode(65 + j)}`;
            const textGeometry = new TextGeometry(label, {
              font: font,
              size: 50,
              height: 5,
            });
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            const centerTheta = theta + latStep / 2;
            const centerPhi = phi + (Math.PI / 16);
            textMesh.position.set(
              3100 * Math.sin(centerTheta) * Math.cos(centerPhi),
              3100 * Math.cos(centerTheta),
              3100 * Math.sin(centerTheta) * Math.sin(centerPhi)
            );
            textMesh.lookAt(0, 0, 0);
            textMesh.rotateY(Math.PI);

            scene.add(textMesh);
          });

          fieldCount++;
        }
      }
    };

    const createStars = (data: any[]) => {
      const starGeometry = new THREE.SphereGeometry(10, 16, 16);
      const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

      data.forEach(starData => {
        const phi = starData.longitude * (Math.PI / 180);
        const theta = starData.latitude * (Math.PI / 180);

        const x = 3000 * Math.sin(theta) * Math.cos(phi);
        const y = 3000 * Math.cos(theta);
        const z = 3000 * Math.sin(theta) * Math.sin(phi);

        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.set(x, y, z);
        star.userData = { longitude: starData.longitude, latitude: starData.latitude, id: starData.id };

        scene.add(star);
        stars.push(star);
      });
    };

    const onMouseClick = (event: MouseEvent) => {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(stars);

      if (intersects.length > 0) {
        const intersectedStar = intersects[0].object as THREE.Mesh;
        handleStarClick(intersectedStar);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(stars);

      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    };

    const calculateQuadrant = (longitude: number, latitude: number): string => {
      const latIndex = Math.floor((latitude / 180) * 32);
      const longIndex = Math.floor((longitude / 360) * 16);

      const latitudeLabel = `B${latIndex}`;
      const longitudeLabel = `L${String.fromCharCode(65 + longIndex)}`;

      return `${latitudeLabel}${longitudeLabel}`;
    };

    const handleStarClick = (star: THREE.Mesh) => {
      const userData = star.userData as { longitude: number; latitude: number };
      const quadrant = calculateQuadrant(userData.longitude, userData.latitude);
      selectedStar.value = { ...userData, quadrant };
      modalVisible.value = true;

      const { longitude, latitude } = userData;

      if (redLongitudeLine) scene.remove(redLongitudeLine);
      if (redLatitudeLine) scene.remove(redLatitudeLine);

      const longitudeLineGeometry = new THREE.BufferGeometry();
      const longitudePoints = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI;
        longitudePoints.push(new THREE.Vector3(
          3000 * Math.sin(theta) * Math.cos(longitude * (Math.PI / 180)),
          3000 * Math.cos(theta),
          3000 * Math.sin(theta) * Math.sin(longitude * (Math.PI / 180))
        ));
      }
      longitudeLineGeometry.setFromPoints(longitudePoints);
      redLongitudeLine = new THREE.Line(longitudeLineGeometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
      scene.add(redLongitudeLine);

      const latitudeLineGeometry = new THREE.BufferGeometry();
      const latitudePoints = [];
      for (let i = 0; i <= 64; i++) {
        const phi = (i / 64) * Math.PI * 2;
        latitudePoints.push(new THREE.Vector3(
          3000 * Math.sin(latitude * (Math.PI / 180)) * Math.cos(phi),
          3000 * Math.cos(latitude * (Math.PI / 180)),
          3000 * Math.sin(latitude * (Math.PI / 180)) * Math.sin(phi)
        ));
      }
      latitudeLineGeometry.setFromPoints(latitudePoints);
      redLatitudeLine = new THREE.Line(latitudeLineGeometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
      scene.add(redLatitudeLine);

      const target = new THREE.Vector3(star.position.x, star.position.y, star.position.z);
      new TWEEN.Tween(camera.position)
        .to({
          x: target.x * 0.9,
          y: target.y * 0.9,
          z: target.z * 0.9
        }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

      new TWEEN.Tween(controls.target)
        .to({
          x: target.x,
          y: target.y,
          z: target.z
        }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => controls.update())
        .start();
    };

    const closeModal = () => {
      modalVisible.value = false;
      if (redLongitudeLine) scene.remove(redLongitudeLine);
      if (redLatitudeLine) scene.remove(redLatitudeLine);
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
      modalVisible,
      selectedStar,
      closeModal
    };
  },
});
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.modal {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -10%);
  background-color: #333;
  color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.close {
  align-self: flex-end;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal p {
  margin: 5px 0;
}
</style>
