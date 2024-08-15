<template>
  <div class="canvas-container">
    <v-container fluid class="pa-0 ma-0 fill-height">
      <v-row no-gutters class="fill-height">
        <v-col cols="3">
          <v-card class="h-100">
            <v-card-title>
              <v-text-field
                v-model="searchQuery"
                label="Suche nach Cluster"
                @input="onSearchInput"
                clearable
              ></v-text-field>
            </v-card-title>
            <v-card-text>
              <v-list class="cluster-list">
                <v-list-item
                  v-for="cluster in filteredClusters"
                  :key="cluster.name"
                  @click="zoomToCluster(cluster)"
                >
                  <v-list-item-title>{{ cluster.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
              <!-- Infobereich -->
              <div class="info-area" v-if="selectedInfo.length">
                <v-card class="mt-4">
                  <v-card-title>Details</v-card-title>
                  <v-card-text>
                    <div v-for="info in selectedInfo" :key="info.text">{{ info.text }}</div>
                  </v-card-text>
                </v-card>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="9" class="pa-0">
          <canvas ref="canvas" class="canvas"></canvas>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue';

export default defineComponent({
  setup() {
    const canvas = ref<HTMLCanvasElement | null>(null);
    const ctx = ref<CanvasRenderingContext2D | null>(null);
    const clusters = ref<any[]>([]);
    const searchQuery = ref('');
    const selectedInfo = ref<any[]>([]); // Informationen für das ausgewählte Element
    const scale = ref(1);
    const offsetX = ref(0);
    const offsetY = ref(0);
    const spaceWidth = ref(0);
    const spaceHeight = ref(0);

    const filteredClusters = computed(() => {
      return clusters.value.filter((cluster) =>
        cluster.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const initCanvas = () => {
      if (canvas.value) {
        ctx.value = canvas.value.getContext('2d');
        canvas.value.addEventListener('wheel', onZoom);
        canvas.value.addEventListener('mousedown', onMouseDown);
        canvas.value.addEventListener('mouseup', onMouseUp);
        canvas.value.addEventListener('click', onClick);
      }
    };

    const resizeCanvas = () => {
      if (canvas.value) {
        const container = canvas.value.parentElement;
        if (container) {
          canvas.value.width = container.clientWidth * 3;
          canvas.value.height = container.clientHeight * 3;
          spaceWidth.value = canvas.value.width;
          spaceHeight.value = canvas.value.height;
        }
        drawClusters();
      }
    };

    const generateClusters = () => {
      const clusterCount = 1;
      const baseSizeScale = 30;
      const clusterSpacing = 300;
      const clusterNames = generateClusterNames(clusterCount);

      clusters.value = [];

      for (let i = 0; i < clusterCount; i++) {
        const activeStars = Math.floor(Math.random() * 5) + 1;
        const totalStars = Math.floor(Math.random() * 5) + 5;
        const clusterSize = baseSizeScale * totalStars * (activeStars / 5);
        const baseX = (i % 10) * clusterSpacing + Math.random() * clusterSpacing;
        const baseY = Math.floor(i / 10) * clusterSpacing + Math.random() * clusterSpacing;
        let points = [];

        for (let j = 0; j < totalStars; j++) {
          points.push({
            x: baseX + (Math.random() - 0.5) * clusterSize,
            y: baseY + (Math.random() - 0.5) * clusterSize,
            active: j < activeStars,
          });
        }

        clusters.value.push({
          name: clusterNames[i],
          points: points,
          activeStars: activeStars,
          centerX: baseX,
          centerY: baseY,
          originalPoints: JSON.parse(JSON.stringify(points)),
        });
      }
    };

    const generateClusterNames = (count: number) => {
      const names = [];
      for (let i = 1; i <= count; i++) {
        names.push(`Cluster-${i}`);
      }
      return names;
    };

    const drawClusters = () => {
      if (!ctx.value || !canvas.value) {
        console.log("Canvas oder Context nicht initialisiert");
        return;
      }

      ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);

      console.log("Zeichnen startet");

      ctx.value.save();
      ctx.value.translate(offsetX.value, offsetY.value);
      ctx.value.scale(scale.value, scale.value);

      for (const cluster of clusters.value) {
        const points = cluster.originalPoints;

        ctx.value.strokeStyle = 'white';
        ctx.value.lineWidth = 0.5;
        ctx.value.beginPath();

        for (let i = 0; i < points.length - 1; i++) {
          ctx.value.moveTo(points[i].x, points[i].y);
          ctx.value.lineTo(points[i + 1].x, points[i + 1].y);
        }

        ctx.value.stroke();

        for (let i = 0; i < points.length; i++) {
          const size = points[i].active ? 5 : 2;
          ctx.value.fillStyle = points[i].active ? 'yellow' : 'gray';
          ctx.value.beginPath();
          ctx.value.arc(points[i].x, points[i].y, size, 0, Math.PI * 2);
          ctx.value.fill();
        }
      }

      ctx.value.restore();
      console.log("Zeichnen abgeschlossen");
    };

    const onZoom = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const zoomSpeed = 0.1;
      const zoom = event.deltaY > 0 ? 1 - zoomSpeed : 1 + zoomSpeed;

      scale.value *= zoom;
      drawClusters();
    };

    const onPan = (event: MouseEvent) => {
      offsetX.value += event.movementX;
      offsetY.value += event.movementY;
      drawClusters();
    };

    const onMouseDown = (event: MouseEvent) => {
      canvas.value?.addEventListener('mousemove', onPan);
    };

    const onMouseUp = (event: MouseEvent) => {
      canvas.value?.removeEventListener('mousemove', onPan);
    };

    const onClick = (event: MouseEvent) => {
      const rect = canvas.value?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = (event.clientX - rect.left - offsetX.value) / scale.value;
      const mouseY = (event.clientY - rect.top - offsetY.value) / scale.value;

      let clickedPoint = null;
      let clickedCluster = null;

      for (const cluster of clusters.value) {
        for (const point of cluster.points) {
          const distance = Math.sqrt(Math.pow(point.x - mouseX, 2) + Math.pow(point.y - mouseY, 2));
          if (distance < 5 && point.active) {
            clickedPoint = point;
            clickedCluster = cluster;
            break;
          }
        }
        if (clickedPoint) break;
      }

      if (clickedPoint) {
        showPointDetails(clickedPoint, clickedCluster);
      } else {
        for (const cluster of clusters.value) {
          if (isInsideCluster(mouseX, mouseY, cluster)) {
            clickedCluster = cluster;
            break;
          }
        }

        if (clickedCluster) {
          showClusterDetails(clickedCluster);
        }
      }
    };

    const isInsideCluster = (x: number, y: number, cluster: any) => {
      for (const point of cluster.points) {
        const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
        if (distance < 20) {
          return true;
        }
      }
      return false;
    };

    const showPointDetails = (point: any, cluster: any) => {
      selectedInfo.value = [
        { text: `Cluster: ${cluster.name}` },
        { text: `Punkt: (${Math.round(point.x)}, ${Math.round(point.y)})` },
      ];
    };

    const showClusterDetails = (cluster: any) => {
      selectedInfo.value = [{ text: `Cluster: ${cluster.name}` }];
      cluster.points.forEach((point: any, index: number) => {
        if (point.active) {
          selectedInfo.value.push({
            text: `Punkt ${index + 1}: (${Math.round(point.x)}, ${Math.round(point.y)})`,
          });
        }
      });
    };

    const onSearchInput = () => {};

    const zoomToCluster = (cluster: any) => {
      scale.value = 2;
      offsetX.value = canvas.value!.width / 2 - cluster.centerX * scale.value;
      offsetY.value = canvas.value!.height / 2 - cluster.centerY * scale.value;
      drawClusters();
      searchQuery.value = '';
    };

    onMounted(() => {
      initCanvas();
      resizeCanvas();
      generateClusters();
      drawClusters();

      window.addEventListener('resize', resizeCanvas);
    });

    return {
      canvas,
      clusters,
      searchQuery,
      selectedInfo,
      filteredClusters,
      onSearchInput,
      zoomToCluster,
    };
  },
});
</script>


<style scoped>
.canvas-container {
    position: absolute;
    top: 80px;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.canvas {
    width: 100%;
    height: 100%;
    display: block;
}

.cluster-list {
  max-height: 350px;
  overflow-y: auto;
}

.info-area {
  background-color: #FF0000;
  color: white;
  padding: 10px;
}
</style>



 
