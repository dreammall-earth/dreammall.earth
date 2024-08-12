<template>
  <div class="universe-viewport" 
       @mousedown="startDrag"
       @mousemove="drag"
       @mouseup="stopDrag"
       @mouseleave="stopDrag"
       @touchstart="startDrag"
       @touchmove="drag"
       @touchend="stopDrag"
       @wheel="handleWheel">
    <div class="interactive-layer" :style="getInteractiveLayerStyle()">
      <div v-for="cluster in getVisibleClusters()" :key="cluster.id" 
           class="cluster"
          :class="{ 'low-zoom': scale <= 0.5 }"
          :style="getClusterStyle(cluster)">
        <div class="cluster-background" :style="getClusterBackgroundStyle(cluster)"></div>
        <h4 class="cluster-title">{{ cluster.name }}</h4>
        <div v-for="star in cluster.stars" :key="star.id"
            class="star"
            :class="[star.type, { pulsing: star.pulsing, 'low-zoom': scale <= 0.5 }]"
            :style="getStarStyle(star)"
            @click.stop="showInfo(star)">
          {{ scale > 0.5 ? star.text : '' }}
        </div>
      </div>
    </div>
  </div>
  <div v-if="selectedStar" class="info-box">
    <h3>{{ selectedStar.name }}</h3>
    <p>Type: {{ selectedStar.type }}</p>
    <p>Job: {{ selectedStar.job }}</p>
    <p>Description: {{ selectedStar.description }}</p>
    <button @click="selectedStar = null">Close</button>
  </div>
  <div class="controls">
    <div class="position-info">{{ positionInfo }}</div>
    <div class="zoom-control">
      <button v-for="zoomLevel in zoomLevels" :key="zoomLevel.value" 
              class="zoom-button" 
              @click="setZoom(zoomLevel.value)">
        {{ zoomLevel.label }}
      </button>
    </div>
     <div class="job-control">
      <label for="job-count">Number of Jobs:</label>
      <select id="job-count" v-model="jobCount" @change="regenerateClusters">
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="200">200</option>
      </select>
    </div>
     <div class="job-selector">
      <label for="job-select">Navigate to Job:</label>
      <select id="job-select" v-model="selectedJob" @change="navigateToJob">
        <option value="">Select a job</option>
        <option v-for="cluster in clusters" :key="cluster.id" :value="cluster.id">
          {{ cluster.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';

interface Star {
  id: number;
  text: string;
  name: string;
  type: 'User' | 'Table' | 'Project' | 'Group';
  job: string;
  description: string;
  pulsing: boolean;
  x: number;
  y: number;
}

interface Cluster {
  id: number;
  name: string;
  stars: Star[];
  row: number;
  col: number;
}

interface ZoomLevel {
  label: string;
  value: number;
}

export default defineComponent({
  name: 'StarryMap',
  setup() {
    const clusters = ref<Cluster[]>([]);
    const viewportX = ref(0);
    const viewportY = ref(0);
    const scale = ref(1);
    const isDragging = ref(false);
    const startX = ref(0);
    const startY = ref(0);
    const selectedStar = ref<Star | null>(null);
    const jobCount = ref(50);
    const zoomLevels: ZoomLevel[] = [
      { label: '----', value: 0.2 },
      { label: '---', value: 0.35 },
      { label: '--', value: 0.5 },
      { label: '-', value: 0.8 },
      { label: 'o', value: 1 },
      { label: '+', value: 1.3 },
      { label: '++', value: 1.6 },
    ];
    
    const selectedJob = ref<number | null>(null);

    const CLUSTER_SIZE = 300;

    const positionInfo = computed(() => {
      return `Position: (${Math.round(viewportX.value)}, ${Math.round(viewportY.value)}) Zoom: ${scale.value.toFixed(2)}`;
    });

    const gridSize = computed(() => {
      return Math.ceil(Math.sqrt(jobCount.value));
    });

    const setZoom = (level: number) => {
      scale.value = level;
    };

    const generateClusters = () => {
      const jobTypes = [
        'Developer', 'Designer', 'Manager', 'Marketer', 'Sales', 
        'HR', 'Finance', 'Operations', 'Customer Support', 'Product',
        'QA', 'DevOps', 'Data Scientist', 'Business Analyst', 'UX Researcher'
        // ... add more job types as needed
      ];
      
      clusters.value = Array.from({ length: jobCount.value }, (_, index) => ({
        id: index + 1,
        name: `${jobTypes[index % jobTypes.length]} Cluster`,
        stars: generateStarsForCluster(jobTypes[index % jobTypes.length]),
        row: Math.floor(index / gridSize.value),
        col: index % gridSize.value
      }));
    };

    const generateStarsForCluster = (job: string): Star[] => {
      const starTypes: ('User' | 'Table' | 'Project' | 'Group')[] = ['User', 'Table', 'Project', 'Group'];
      const starCount = Math.floor(Math.random() * 10) + 1; // 1 to 10 stars
      return Array.from({ length: starCount }, (_, i) => ({
        id: i + 1,
        text: starTypes[Math.floor(Math.random() * starTypes.length)].charAt(0),
        name: `${starTypes[Math.floor(Math.random() * starTypes.length)]} ${i + 1}`,
        type: starTypes[Math.floor(Math.random() * starTypes.length)],
        job: job,
        description: `This is a ${job} related entity. More information can be added here.`,
        pulsing: Math.random() < 0.1,
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
    };

    const getInteractiveLayerStyle = () => {
      return {
        transform: `translate(${-viewportX.value}px, ${-viewportY.value}px) scale(${scale.value})`,
        width: `${gridSize.value * CLUSTER_SIZE}px`,
        height: `${gridSize.value * CLUSTER_SIZE}px`
      };
    };

    const getClusterStyle = (cluster: Cluster) => {
      return {
        width: `${CLUSTER_SIZE}px`,
        height: `${CLUSTER_SIZE}px`,
        left: `${cluster.col * CLUSTER_SIZE}px`,
        top: `${cluster.row * CLUSTER_SIZE}px`,
      };
    };

    const getClusterBackgroundStyle = (cluster: Cluster) => {
      const hue = (cluster.id * 137.5) % 360;
      return {
        backgroundColor: 'transparent',
        backgroundImage: `radial-gradient(circle at 50% 50%, hsla(${hue}, 70%, 60%, 0.1) 10%, transparent 60%)`
      };
    };



    const getStarStyle = (star: Star) => {
      return {
        left: `${star.x}%`,
        top: `${star.y}%`
      };
    };

   const getVisibleClusters = () => {
      if (typeof window === 'undefined') return clusters.value;

      const viewportWidth = window.innerWidth / scale.value;
      const viewportHeight = window.innerHeight / scale.value;
      const buffer = 1 / scale.value; // Fügt einen Puffer hinzu, der bei niedrigerem Zoom größer wird

      const startCol = Math.floor(viewportX.value / CLUSTER_SIZE) - buffer;
      const startRow = Math.floor(viewportY.value / CLUSTER_SIZE) - buffer;
      const endCol = Math.ceil((viewportX.value + viewportWidth) / CLUSTER_SIZE) + buffer;
      const endRow = Math.ceil((viewportY.value + viewportHeight) / CLUSTER_SIZE) + buffer;

      return clusters.value.filter(cluster => 
        cluster.col >= startCol && cluster.col <= endCol &&
        cluster.row >= startRow && cluster.row <= endRow
      );
    };

   const navigateToJob = () => {
      if (selectedJob.value === null) return;
      
      const targetCluster = clusters.value.find(c => c.id === selectedJob.value);
      if (!targetCluster) return;

      const targetX = (targetCluster.col + 0.5) * CLUSTER_SIZE;
      const targetY = (targetCluster.row + 0.5) * CLUSTER_SIZE;

      viewportX.value = targetX - window.innerWidth / (2 * scale.value);
      viewportY.value = targetY - window.innerHeight / (2 * scale.value);

      scale.value = 1.2;
    };


   const handleWheel = (e: WheelEvent) => {
      if (typeof window === 'undefined') return;
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      const newScale = Math.max(0.2, Math.min(1.6, scale.value + delta));
      const scaleFactor = newScale / scale.value;
      
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;
      
      const worldCenterX = viewportX.value + screenCenterX / scale.value;
      const worldCenterY = viewportY.value + screenCenterY / scale.value;
      
      viewportX.value = worldCenterX - screenCenterX / newScale;
      viewportY.value = worldCenterY - screenCenterY / newScale;
      
      scale.value = newScale;
    };

    const showInfo = (star: Star) => {
      selectedStar.value = star;
    };

    const startDrag = (event: MouseEvent | TouchEvent) => {
      isDragging.value = true;
      startX.value = 'touches' in event ? event.touches[0].clientX : event.clientX;
      startY.value = 'touches' in event ? event.touches[0].clientY : event.clientY;
    };

    const drag = (event: MouseEvent | TouchEvent) => {
      if (!isDragging.value) return;
      const currentX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const currentY = 'touches' in event ? event.touches[0].clientY : event.clientY;
      const dx = currentX - startX.value;
      const dy = currentY - startY.value;
      viewportX.value -= dx / scale.value;
      viewportY.value -= dy / scale.value;
      startX.value = currentX;
      startY.value = currentY;
    };

    const stopDrag = () => {
      isDragging.value = false;
    };

    const regenerateClusters = () => {
      generateClusters();
      if (typeof window !== 'undefined') {
        const totalCols = gridSize.value;
        const totalRows = gridSize.value;
        const centerX = (totalCols * CLUSTER_SIZE) / 2;
        const centerY = (totalRows * CLUSTER_SIZE) / 2;

        viewportX.value = centerX - window.innerWidth / (2 * scale.value);
        viewportY.value = centerY - window.innerHeight / (2 * scale.value);
      }
    };

    const centerView = () => {
      if (typeof window === 'undefined') return;
      const totalCols = gridSize.value;
      const totalRows = gridSize.value;
      const centerX = (totalCols * CLUSTER_SIZE) / 2;
      const centerY = (totalRows * CLUSTER_SIZE) / 2;

      viewportX.value = centerX - window.innerWidth / (2 * scale.value);
      viewportY.value = centerY - window.innerHeight / (2 * scale.value);
    };

    onMounted(() => {
      regenerateClusters();
      centerView();
      window.addEventListener('resize', centerView);
    });

     
      onBeforeUnmount(() => {
          window.removeEventListener('resize', centerView);
        });

    watch(jobCount, regenerateClusters);

    return {
      jobCount,
      clusters,
      viewportX,
      viewportY,
      scale,
      selectedStar,
      zoomLevels,
      positionInfo,
      getInteractiveLayerStyle,
      getClusterStyle,
      getClusterBackgroundStyle,
      getStarStyle,
      getVisibleClusters,
      handleWheel,
      setZoom,
      showInfo,
      startDrag,
      drag,
      stopDrag,
      regenerateClusters,
      selectedJob,
      navigateToJob,
      isDragging,
    };
  }
});
</script>

<style scoped>
.universe-viewport {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #f0f0f0;
}

.interactive-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.cluster {
  position: absolute;
  border: 1px dotted rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: all 0.3s;
}

.cluster-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.3;
}

.cluster-title {
  position: absolute;
  top: 10px;
  left: 10px;
  margin: 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
  background-color: rgba(255, 255, 255, 0.7);
  padding: 2px 5px;
  border-radius: 3px;
}

.star {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  transition: transform 0.3s;
}

.star:hover {
  transform: scale(1.2);
}

.star.User { background-color: rgba(255, 215, 0, 0.7); }
.star.Table { background-color: rgba(0, 206, 209, 0.7); }
.star.Project { background-color: rgba(255, 99, 71, 0.7); }
.star.Group { background-color: rgba(50, 205, 50, 0.7); }

.star.pulsing {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.info-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  color: black;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  max-width: 300px;
}

.controls {
  position: fixed;
  bottom: 10px;
  left: 10px;
  z-index: 1000;
  color: black;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
}

.zoom-control button {
  margin: 5px;
  padding: 5px 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}

.job-control {
  margin-top: 10px;
}

.job-control label {
  margin-right: 10px;
}

.job-control select {
  padding: 5px;
}

.job-selector {
  margin-top: 10px;
}

.job-selector label {
  margin-right: 10px;
}

.job-selector select {
  padding: 5px;
  width: 200px;
}



.cluster.low-zoom {
  border: 1px dotted rgba(0, 0, 0, 0.1);
}

.cluster.low-zoom .cluster-title {
  display: none;
}

.star.low-zoom {
  width: 4px;
  height: 4px;
  font-size: 0;
}

.star.low-zoom:hover {
  transform: scale(3);
}


</style>