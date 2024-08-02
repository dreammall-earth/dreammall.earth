<template>
  <CockpitCard narrow>
    <template #default>
      <div class="header">
        <v-avatar class="avatar d-flex align-center text-font bg-primary" size="75">
          <v-img v-if="props.userImage" :src="props.userImage" />
          <span v-else>{{ props.initials }}</span>
        </v-avatar>
        <select v-model="availability" class="availability">
          <option v-for="item in availabilityOptions" :key="item.value" :value="item.value">
            {{ item.circle }} {{ item.text }} <v-icon icon="$chevronDown"></v-icon>
          </option>
        </select>
        <div class="name">{{ props.name }}</div>
        <div class="introduction">{{ props.introduction }}</div>
      </div>
      <ul class="details">
        <li v-for="(detail, index) in props.details" :key="index">
          <v-chip :prepend-icon="getIcon(detail.category)" class="detail">{{ detail.text }}</v-chip>
        </li>
      </ul>
      <ul class="social">
        <li v-if="props.social.facebook">
          <a :href="props.social.facebook" target="_blank" rel="noopener noreferrer">
            <v-icon icon="$facebook"></v-icon>
          </a>
        </li>
        <li v-if="props.social.linkedin">
          <a :href="props.social.linkedin" target="_blank" rel="noopener noreferrer">
            <v-icon icon="$linkedIn"></v-icon>
          </a>
        </li>
        <li v-if="props.social.xing">
          <a :href="props.social.xing" target="_blank" rel="noopener noreferrer">
            <v-icon icon="$xing"></v-icon>
          </a>
        </li>
        <li v-if="props.social.x">
          <a :href="props.social.x" target="_blank" rel="noopener noreferrer">
            <v-icon icon="$x"></v-icon>
          </a>
        </li>
      </ul>
    </template>
  </CockpitCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import CockpitCard from '#components/cockpit/cockpitCard/CockpitCard.vue'

type DetailCategory = 'place' | 'work' | 'language' | 'education' | 'feeling'

type Detail = {
  category: DetailCategory
  text: string
}

const props = defineProps<{
  userName: string
  name: string
  userImage?: string
  initials?: string
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

const availability = ref(props.availability)

const availabilityOptions = [
  { circle: '🟢', value: 'available', text: 'Available to work' },
  { circle: '🟡', value: 'partly_available', text: 'Busy but have time' },
  { circle: '🔴', value: 'busy', text: 'Busy' },
]

function getIcon(category: DetailCategory) {
  switch (category) {
    case 'place':
      return '$place'
    case 'work':
      return '$working'
    case 'language':
      return '$world'
    case 'education':
      return '$education'
    case 'feeling':
      return '$feeling'
    default:
      throw new Error(`Unknown category: ${category}`)
  }
}
</script>

<style scoped>
.header {
  display: grid;
  grid-template-columns: 75px 1fr;
  grid-template-rows: 1 fr 1fr 1fr;
  gap: 10px;
}

.avatar {
  grid-row: 1 / 3;
  border-radius: 15px;
}

.availability select {
  display: none;
}

.availability::after {
  grid-column: 2;
  grid-row: 1;

  content: '';

  font-size: 10px;
  color: white;
  display: flex;
  height: 24px;
  padding: 0px 12px 0px 4px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  border-radius: 9999px;
  border: 1px solid rgba(214, 223, 233, 0.4);
  background: #5d6670;
}

.name {
  grid-column: 2;
  grid-row: 2;
}

.introduction {
  grid-column: 2;
  grid-row: 3;
  font-size: 12px;
}

.details,
.social {
  padding: 0;
  list-style: none;
}

.details {
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  width: 300px;
  padding: 10px;
  border-radius: 15px;
  background: #f3f3f3;
}

.detail {
  font-size: 10px !important;
}

.social {
  display: flex;
}

hr {
  margin-block: 10px;
  border-color: white;
}
</style>
