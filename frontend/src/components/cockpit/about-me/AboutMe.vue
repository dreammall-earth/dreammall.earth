<template>
  <CockpitCard>
    <template #header>
      <h2>{{ $t('cockpit.about-me.header') }}</h2>
    </template>
    <template #default>
      <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
      <div class="about-me-text">"{{ user.text }}"</div>
      <hr />
      <ul class="details">
        <li v-if="user.place"><v-icon icon="$place"></v-icon> {{ user.place }}</li>
        <li v-if="user.work"><v-icon icon="$working"></v-icon> {{ user.work }}</li>
        <li></li>
      </ul>
      <ul class="social">
        <li v-if="user.social.facebook">
          <a :href="user.social.facebook" target="_blank" rel="noopener noreferrer">
            <v-icon icon="$facebook"></v-icon>
          </a>
        </li>
        <li v-if="user.social.linkedin">
          <a :href="user.social.linkedin" target="_blank" rel="noopener noreferrer">
            <v-icon icon="$linkedIn"></v-icon>
          </a>
        </li>
        <li v-if="user.social.xing">
          <a :href="user.social.xing" target="_blank" rel="noopener noreferrer">
            <v-icon icon="$xing"></v-icon>
          </a>
        </li>
        <li v-if="user.social.x">
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

type User = {
  name: string
  text?: string
  place?: string
  work?: string
  social: {
    facebook?: string
    linkedin?: string
    xing?: string
    x?: string
  }
}

defineProps<{
  user: User
}>()
</script>

<style scoped lang="scss">
.about-me-text {
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
