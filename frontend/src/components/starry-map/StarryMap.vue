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
  
  <script>
  export default {
    name: 'StarryMap',
    data() {
      return {
        layers: [
          { src: 'src/assets/img/star_bg3.png' },
          { src: 'src/assets/img/star_bg2.png' },
          { src: 'src/assets/img/star_bg1.png' },
        ],
        stars: [],
        viewportX: 0,
        viewportY: 0,
        scale: 1,
        isDragging: false,
        startX: 0,
        startY: 0,
        selectedStar: null,
        zoomLevels: [
          { label: '--', value: 0.5 },
          { label: '-', value: 0.8 },
          { label: 'o', value: 1 },
          { label: '+', value: 1.3 },
          { label: '++', value: 1.6 },
        ],
      };
    },
    computed: {
      positionInfo() {
        return `Position: (${Math.round(this.viewportX)}, ${Math.round(this.viewportY)}) Zoom: ${this.scale.toFixed(2)}`;
      },
    },
    mounted() {
      this.generateStars();
    },
    methods: {
      generateStars() {
        const starTypes = ['User', 'Chat Room', 'Forum', 'Game Room', 'Workshop'];
        this.stars = Array.from({ length: 200 }, (_, i) => {
          return {
            id: i + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            pulsing: Math.random() < 0.1,
            text: starTypes[Math.floor(Math.random() * starTypes.length)].charAt(0),
            name: `${starTypes[Math.floor(Math.random() * starTypes.length)]} ${i + 1}`,
            type: starTypes[Math.floor(Math.random() * starTypes.length)],
            users: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => `User${Math.floor(Math.random() * 1000)}`),
            description: `This is a virtual space. More information can be added here.`
          };
        });
      },
      getLayerStyle(index) {
        const factor = 0.1 * (index + 1);
        return {
          transform: `translate(${-this.viewportX * factor}px, ${-this.viewportY * factor}px)`
        };
      },
      getInteractiveLayerStyle() {
        return {
          transform: `translate(${-this.viewportX}px, ${-this.viewportY}px) scale(${this.scale})`
        };
      },
      handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        const newScale = Math.max(0.5, Math.min(2, this.scale + delta));
        const scaleFactor = newScale / this.scale;
        
        // Adjust viewport position to zoom towards mouse position
        const rect = e.target.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        this.viewportX = mouseX - (mouseX - this.viewportX) * scaleFactor;
        this.viewportY = mouseY - (mouseY - this.viewportY) * scaleFactor;
        
        this.scale = newScale;
      },
      setZoom(level) {
        this.scale = level;
      },
      showInfo(star) {
        this.selectedStar = star;
      },
      startDrag(event) {
        this.isDragging = true;
        this.startX = event.clientX || event.touches[0].clientX;
        this.startY = event.clientY || event.touches[0].clientY;
      },
      drag(event) {
        if (!this.isDragging) return;
        const currentX = event.clientX || event.touches[0].clientX;
        const currentY = event.clientY || event.touches[0].clientY;
        const dx = currentX - this.startX;
        const dy = currentY - this.startY;
        this.viewportX -= dx / this.scale;
        this.viewportY -= dy / this.scale;
        this.startX = currentX;
        this.startY = currentY;
      },
      stopDrag() {
        this.isDragging = false;
      },
    },
  };
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