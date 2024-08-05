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
      <div class="background-layers">
        <div v-for="(layer, index) in layers" :key="index" 
             class="parallax-layer" 
             :style="getLayerStyle(index)">
          <img :src="layer.src" :alt="`Background ${index + 1}`" class="bg-image">
        </div>
      </div>
      <div class="interactive-layer" :style="getInteractiveLayerStyle()">
        <div v-for="(star, index) in stars" :key="index" 
             class="star" 
             :class="{ pulsing: star.pulsing }"
             :style="{ left: star.left, top: star.top }"
             @click.stop="showInfo(star)">
          {{ star.text }}
        </div>
      </div>
    </div>
    <div v-if="selectedStar" class="info-box">
      <h3>{{ selectedStar.name }}</h3>
      <p>Type: {{ selectedStar.type }}</p>
      <p>Users: {{ selectedStar.users.join(', ') }}</p>
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
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue';
  
  interface Star {
    id: number;
    left: string;
    top: string;
    pulsing: boolean;
    text: string;
    name: string;
    type: string;
    users: string[];
    description: string;
  }
  
  interface Layer {
    src: string;
  }
  
  interface ZoomLevel {
    label: string;
    value: number;
  }
  
  export default defineComponent({
    name: 'StarryMap',
    setup() {
      const layers = ref<Layer[]>([
        { src: 'src/assets/img/star_bg3.png' },
        { src: 'src/assets/img/star_bg2.png' },
        { src: 'src/assets/img/star_bg1.png' },
      ]);
      const stars = ref<Star[]>([]);
      const viewportX = ref(0);
      const viewportY = ref(0);
      const scale = ref(1);
      const isDragging = ref(false);
      const startX = ref(0);
      const startY = ref(0);
      const selectedStar = ref<Star | null>(null);
      const zoomLevels: ZoomLevel[] = [
        { label: '--', value: 0.5 },
        { label: '-', value: 0.8 },
        { label: 'o', value: 1 },
        { label: '+', value: 1.3 },
        { label: '++', value: 1.6 },
      ];
  
      const positionInfo = computed(() => {
        return `Position: (${Math.round(viewportX.value)}, ${Math.round(viewportY.value)}) Zoom: ${scale.value.toFixed(2)}`;
      });
  
      const generateStars = () => {
        const starTypes = ['User', 'Chat Room', 'Forum', 'Game Room', 'Workshop'];
        stars.value = Array.from({ length: 200 }, (_, i) => ({
          id: i + 1,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          pulsing: Math.random() < 0.1,
          text: starTypes[Math.floor(Math.random() * starTypes.length)].charAt(0),
          name: `${starTypes[Math.floor(Math.random() * starTypes.length)]} ${i + 1}`,
          type: starTypes[Math.floor(Math.random() * starTypes.length)],
          users: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => `User${Math.floor(Math.random() * 1000)}`),
          description: `This is a virtual space. More information can be added here.`
        }));
      };
  
      const getLayerStyle = (index: number) => {
        const factor = 0.1 * (index + 1);
        return {
          transform: `translate(${-viewportX.value * factor}px, ${-viewportY.value * factor}px)`
        };
      };
  
      const getInteractiveLayerStyle = () => {
        return {
          transform: `translate(${-viewportX.value}px, ${-viewportY.value}px) scale(${scale.value})`
        };
      };
  
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        const newScale = Math.max(0.5, Math.min(2, scale.value + delta));
        const scaleFactor = newScale / scale.value;
        
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        viewportX.value = mouseX - (mouseX - viewportX.value) * scaleFactor;
        viewportY.value = mouseY - (mouseY - viewportY.value) * scaleFactor;
        
        scale.value = newScale;
      };
  
      const setZoom = (level: number) => {
        scale.value = level;
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
  
      onMounted(() => {
        generateStars();
      });
  
      return {
        layers,
        stars,
        viewportX,
        viewportY,
        scale,
        selectedStar,
        zoomLevels,
        positionInfo,
        getLayerStyle,
        getInteractiveLayerStyle,
        handleWheel,
        setZoom,
        showInfo,
        startDrag,
        drag,
        stopDrag
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
    background-color: black;
  }
  
  .background-layers, .interactive-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  
  .parallax-layer {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .star {
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: black;
    cursor: pointer;
  }
  
  .star.pulsing {
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
  }
  
  .info-box {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    border-radius: 10px;
    z-index: 1000;
    max-width: 300px;
  }
  
  .controls {
    position: fixed;
    bottom: 10px;
    left: 10px;
    z-index: 1000;
    color: white;
  }
  
  .zoom-control button {
    margin: 5px;
  }
  </style>