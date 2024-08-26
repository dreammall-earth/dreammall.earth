<template>
  <div class="hemisphere-container mb-5">
    <div ref="northernHemisphere" class="hemisphere"></div>
    <div ref="southernHemisphere" class="hemisphere"></div>
  </div>
</template>

<script lang="ts">
// https://observablehq.com/@d3/star-map
import { defineComponent, ref, onMounted } from 'vue';
import * as d3 from 'd3';
import userData from '#src/assets/user_data.json';

export default defineComponent({
  setup() {
    const northernHemisphere = ref<HTMLElement | null>(null);
    const southernHemisphere = ref<HTMLElement | null>(null);

    const width = 800;
    const height = 800;

    const projection = d3.geoStereographic()
      .reflectY(true)
      .scale((width - 120) * 0.5)
      .rotate([0, -90])
      .translate([width / 2, height / 2])
      .precision(0.1);

    const path = d3.geoPath(projection);

    const drawHemisphere = (element: HTMLElement | null, data: any[], filterCondition: (d: any) => boolean) => {
      if (!element) return;

      const svg = d3.select(element)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#081b3f');  // Dark background color

      // Graticule and Outline
      const graticule = d3.geoGraticule().step([15, 10])();
      const outline = d3.geoCircle().radius(90).center([0, 90])();

      svg.append("path")
        .attr("d", path(graticule))
        .attr("fill", "none")
        .attr("stroke", "#6c757d")  // Light grid lines
        .attr("stroke-opacity", 0.2);

      svg.append("path")
        .attr("d", path(outline))
        .attr("fill", "none")
        .attr("stroke", "#6c757d");

      svg.append("g")
        .selectAll("text")
        .data(d3.range(0, 1440, 60)) // each hour
        .join("text")
        .attr("dy", "0.35em")
        .text(d => `${d / 60}h`)
        .attr("font-size", d => d % 360 ? 10 : 14)
        .attr("font-weight", d => d % 360 ? null : "bold")
        .attr("fill", "#e0e0e0")  // Text color
        .datum(d => projection([d / 4, -4]))
        .attr("x", d => d ? d[0] : 0)
        .attr("y", d => d ? d[1] : 0);

      // Draw stars with varying sizes
      svg.selectAll('circle')
        .data(data.filter(filterCondition))
        .enter()
        .append('circle')
        .attr('cx', d => {
          const point = projection([d.longitude, d.latitude]);
          return point ? point[0] : 0;
        })
        .attr('cy', d => {
          const point = projection([d.longitude, d.latitude]);
          return point ? point[1] : 0;
        })
        .attr('r', d => d.magnitude ? (8 - d.magnitude) / 2 : 3)  // Size based on magnitude
        .attr('fill', 'white')
        .attr('stroke', 'none')
        .attr('opacity', 0.8)
        .on('mouseover', function(event, d) {
          d3.select(this).attr('r', 6);
        })
        .on('mouseout', function(event, d) {
          d3.select(this).attr('r', d.magnitude ? (8 - d.magnitude) / 2 : 3);
        })
        .on('click', (event, d) => {
          console.log(`Clicked star: Longitude ${d.longitude}, Latitude ${d.latitude}`);
        });
    };

    onMounted(() => {
      drawHemisphere(northernHemisphere.value, userData, d => d.latitude > 0);
      drawHemisphere(southernHemisphere.value, userData, d => d.latitude <= 0);
    });

    return {
      northernHemisphere,
      southernHemisphere
    };
  },
});
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
</style>
