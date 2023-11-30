<template>
  <!-- <v-btn :variant="isRouteSelected($attrs.href as string) ? 'tonal' : 'flat'"> -->
  <v-btn :class="classes" variant="plain" :href="props.href">
    {{ props.label }}
  </v-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

// import { usePageContext } from '#context/usePageContext'

// const pageContext = usePageContext()

const props = withDefaults(
  defineProps<{
    /**
     * The label of the anchor
     */
    label: string,    
    /**
     * The href of the anchor
     */
    href: string    
  }>(),
  { href: '#', label: 'Link' },
)

// const isRouteSelected = (href: string) => {
//     if(!href) return false;

//   if (href === '/app') {
//     return pageContext.urlPathname.indexOf(href) === 0
//   }
//   return pageContext.urlPathname === href
// }

const classes = computed(() => ({
  'anchor-link': true,
//   'anchor-link--active': isRouteSelected(props.href as string) ? true : "",  
}))

const style = computed(() => ({
//   backgroundColor: props.backgroundColor,
}))

</script>

<style scoped lang="scss">

.anchor-link{
    color: #3D4753;
    text-transform: unset !important;
    font-weight: 300;
    text-align: center;
    line-height: 1.9rem;
    font-size: 1.25rem;
    letter-spacing: 0em;
    padding-left: 0;
    padding-right: 0;

    &:hover{
        color: #3f454d;
        font-weight: 400;        
    }

    &--active{
        color: rgb(121, 121, 121);
        font-weight: 400;        
    }
}
</style>