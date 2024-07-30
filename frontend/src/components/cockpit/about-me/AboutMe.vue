<template>
  <CockpitCard>
    <template #header>
      <h2>{{ $t('cockpit.about-me.header') }}</h2>
    </template>
    <template #default>
      <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
      <div class="introduction">"{{ props.introduction }}"</div>
      <hr />
      <ul class="details">
        <v-for :detail="props.details">
          <li><v-icon :icon="getIcon(detail.category)"></v-icon> {{ detail.text }}</li>
        </v-for>
      </ul>
      <ul class="social">
        <li v-if="props.social.facebook">
          <a :href="user.social.facebook" target="_blank" rel="noopener noreferrer">
            <v-icon icon="$facebook"></v-icon>
          </a>
        </li>
        <li v-if="props.social.linkedin">
          <a :href="user.social.linkedin" target="_blank" rel="noopener noreferrer">
            <v-icon icon="$linkedIn"></v-icon>
          </a>
        </li>
        <li v-if="props.social.xing">
          <a :href="user.social.xing" target="_blank" rel="noopener noreferrer">
            <v-icon icon="$xing"></v-icon>
          </a>
        </li>
        <li v-if="props.social.x">
          <a :href="user.social.x" target="_blank" rel="noopener noreferrer">
            <v-icon icon="$x"></v-icon>
          </a>
        </li>
      </ul>
    </template>
  </CockpitCard>
</template>

<script lang="ts" setup>
import CockpitCard from '#components/cockpit/cockpitCard/CockpitCard.vue'

type DetailCategory = 'place' | 'work' | 'language' | 'education' | 'feeling'

type Detail = {
  category: DetailCategory
  text: string
}

const props = defineProps<{
  name: string
  introduction?: string
  availability?: 'available' | 'partly_available' | 'busy'
  details: Detail[]
  social: {
    discord?: string
    telegram?: string
    facebook?: string
    tiktok?: string
    snapchat?: string
    reddit?: string
    wechat?: string
    instagram?: string
    pintarest?: string
    linkedin?: string
    youtube?: string
    whatsapp?: string
    xing?: string
    x?: string
  }
}>()

function getIcon(category: DetailCategory) {
  switch (category) {
    case 'place':
      return '$location'
    case 'work':
      return '$work'
    case 'language':
      return '$language'
    case 'education':
      return '$education'
    case 'feeling':
      return '$feeling'
    default:
      throw new Error(`Unknown category: ${category}`)
  }
}
</script>

<style scoped lang="scss">
.introduction {
  overflow-wrap: break-word;
}

.details,
.social {
  padding: 0;
  list-style: none;
}

.social {
  display: flex;
}

hr {
  margin-block: 10px;
  border-color: white;
}
</style>
