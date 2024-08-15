<template>
  <div class="canvas-container">
    <canvas ref="canvas" @wheel="onZoom" @mousedown="onMouseDown" @mouseup="onMouseUp"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  setup() {
    const canvas = ref<HTMLCanvasElement | null>(null);
    const ctx = ref<CanvasRenderingContext2D | null>(null);
    const scale = ref(1);
    const offsetX = ref(0);
    const offsetY = ref(0);
    const isDragging = ref(false);

    const cluster = {
      points: [
        { x: 100, y: 100, active: true },
        { x: 200, y: 200, active: true },
        { x: 150, y: 300, active: false },
      ],
    };

    const drawCanvas = () => {
      if (ctx.value) {
        ctx.value.clearRect(0, 0, canvas.value!.width, canvas.value!.height);

        ctx.value.save();
        ctx.value.translate(offsetX.value, offsetY.value);
        ctx.value.scale(scale.value, scale.value);

        ctx.value.strokeStyle = 'white';
        ctx.value.lineWidth = 1;

        ctx.value.beginPath();
        for (let i = 0; i < cluster.points.length - 1; i++) {
          ctx.value.moveTo(cluster.points[i].x, cluster.points[i].y);
          ctx.value.lineTo(cluster.points[i + 1].x, cluster.points[i + 1].y);
        }
        ctx.value.stroke();

        for (const point of cluster.points) {
          ctx.value.fillStyle = point.active ? 'yellow' : 'gray';
          ctx.value.beginPath();
          ctx.value.arc(point.x, point.y, point.active ? 5 : 3, 0, Math.PI * 2);
          ctx.value.fill();
        }

        ctx.value.restore();
      }
    };

    const onZoom = (event: WheelEvent) => {
      const zoomSpeed = 0.1;
      const zoom = event.deltaY > 0 ? 1 - zoomSpeed : 1 + zoomSpeed;

      scale.value *= zoom;
      drawCanvas();
    };

    const onPan = (event: MouseEvent) => {
      if (isDragging.value) {
        offsetX.value += event.movementX;
        offsetY.value += event.movementY;
        drawCanvas();
      }
    };

    const onMouseDown = () => {
      isDragging.value = true;
      window.addEventListener('mousemove', onPan);
    };

    const onMouseUp = () => {
      isDragging.value = false;
      window.removeEventListener('mousemove', onPan);
    };

    onMounted(() => {
      if (canvas.value) {
        ctx.value = canvas.value.getContext('2d');
        canvas.value.width = window.innerWidth;
        canvas.value.height = window.innerHeight;
        drawCanvas();
      }
    });

    return {
      canvas,
      onZoom,
      onMouseDown,
      onMouseUp,
    };
  },
});
</script>

<style scoped>
.canvas-container {
  width: 100vw;
  height: 100vh;
  background-color: black;
}
canvas {
  display: block;
}
</style>
