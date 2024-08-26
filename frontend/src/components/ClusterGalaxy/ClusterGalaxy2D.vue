<template>
  <div class="hemisphere-container">
    <div ref="northernHemisphere" class="hemisphere"></div>
    <div ref="southernHemisphere" class="hemisphere"></div>

    <!-- Modal -->
    <div v-if="showModal" class="modal">
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
import { geoStereographic, geoPath, select, geoGraticule, geoCircle, range } from 'd3'
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  props: {
    starData: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const northernHemisphere = ref<HTMLElement | null>(null)
    const southernHemisphere = ref<HTMLElement | null>(null)
    const showModal = ref(false)
    const selectedStar = ref({ longitude: 0, latitude: 0, quadrant: '' })

    const width = 800
    const height = 800

    const projection = geoStereographic()
      .reflectY(true)
      .scale((width - 120) * 0.5)
      .rotate([0, -90])
      .translate([width / 2, height / 2])
      .precision(0.1)

    const path = geoPath(projection)

    const calculateQuadrant = (longitude: number, latitude: number): string => {
      const latIndex = Math.floor((latitude / 180) * 32)
      const longIndex = Math.floor((longitude / 360) * 16)

      const latitudeLabel = `B${latIndex}`
      const longitudeLabel = `L${String.fromCharCode(65 + longIndex)}`

      return `${latitudeLabel}${longitudeLabel}`
    }

    const drawHemisphere = (
      element: HTMLElement | null,
      data: any[],
      filterCondition: (d: any) => boolean,
    ) => {
      if (!element) return

      const svg = select(element)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#081b3f')

      const graticule = geoGraticule().step([15, 10])()
      const outline = geoCircle().radius(90).center([0, 90])()

      svg
        .append('path')
        .attr('d', path(graticule))
        .attr('fill', 'none')
        .attr('stroke', '#6c757d')
        .attr('stroke-opacity', 0.2)

      svg.append('path').attr('d', path(outline)).attr('fill', 'none').attr('stroke', '#6c757d')

      svg
        .append('g')
        .selectAll('text')
        .data(range(0, 1440, 60)) // Jede Stunde
        .join('text')
        .attr('dy', '0.35em')
        .text((d) => `${d / 60}h`)
        .attr('font-size', (d) => (d % 360 ? 10 : 14))
        .attr('font-weight', (d) => (d % 360 ? null : 'bold'))
        .attr('fill', '#e0e0e0')
        .datum((d) => projection([d / 4, -4]))
        .attr('x', (d) => (d ? d[0] : 0))
        .attr('y', (d) => (d ? d[1] : 0))

      svg
        .selectAll('circle')
        .data(data.filter(filterCondition))
        .enter()
        .append('circle')
        .attr('cx', (d) => {
          const point = projection([d.longitude, d.latitude])
          return point ? point[0] : 0
        })
        .attr('cy', (d) => {
          const point = projection([d.longitude, d.latitude])
          return point ? point[1] : 0
        })
        .attr('r', (d) => (d.magnitude ? (8 - d.magnitude) / 2 : 3))
        .attr('fill', 'white')
        .attr('stroke', 'none')
        .attr('opacity', 0.8)
        .on('mouseover', function () {
          select(this).attr('r', 6)
        })
        .on('mouseout', function (event, d) {
          select(this).attr('r', d.magnitude ? (8 - d.magnitude) / 2 : 3)
        })
        .on('click', (event, d) => {
          const quadrant = calculateQuadrant(d.longitude, d.latitude)
          selectedStar.value = { ...d, quadrant }
          showModal.value = true
        })
    }

    const closeModal = () => {
      showModal.value = false
    }

    onMounted(() => {
      drawHemisphere(northernHemisphere.value, props.starData, (d) => d.latitude > 0)
      drawHemisphere(southernHemisphere.value, props.starData, (d) => d.latitude <= 0)
    })

    return {
      northernHemisphere,
      southernHemisphere,
      showModal,
      selectedStar,
      closeModal,
    }
  },
})
</script>

<style scoped>
.hemisphere-container {
  display: flex;
  justify-content: space-around;
}

.hemisphere {
  width: 800px;
  height: 800px;
  border: 1px solid #6c757d;
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
