<template>
  <MotivationBox>{{ $t('invitationLink.motivation') }}</MotivationBox>
  <CopyToClipboard :url="myLink"></CopyToClipboard>
</template>

<script setup lang="ts">
import MotivationBox from '#components/cockpit/my-tables/create-table/MotivationBox.vue'
import CopyToClipboard from '#components/copy-to-clipboard/CopyToClipboard.vue'

const myLink = 'foo'
</script>
