<template>
  <DefaultLayout>
    <create-button />
  </DefaultLayout>
</template>

<script lang="ts" setup>
import CreateButton from '#components/buttons/CreateButton.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'
// import { joinMyRoomQuery } from '#queries/joinMyRoomQuery'

// const { result: joinMyRoomQueryResult, error: joinMyRoomQueryError } = useQuery(
//   joinMyRoomQuery,
//   null,
//   {
//     prefetch: false,
//     fetchPolicy: 'no-cache',
//   },
// )

// const enterRoom = async () => {
//   if (joinMyRoomQueryError.value) {
//     // eslint-disable-next-line no-console
//     console.log(joinMyRoomQueryError.value.message)
//   } else {
//     window.open(joinMyRoomQueryResult.value?.joinMyRoom, '_blank')
//   }
// }
</script>
