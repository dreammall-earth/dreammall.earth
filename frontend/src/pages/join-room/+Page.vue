<template>
  <DefaultLayout>
    
    <div class="d-flex bg-white text-center pa-6 v-container">
      <v-row class="section-header newsletter-section">
        <v-col>
          <h2 class="section-headline">Raum betreten als: </h2>
        <!-- </v-col> 
      </v-row>
      <v-row>
        <v-col> -->
          <div class="mt-8 d-flex justify-center">
            <v-form  ref="form" class="w-25" @submit.prevent="submitJoinRoomForm">
                <v-text-field
                    class="pb-3"
                    v-model="username"
                    :counter="10"
                    :rules="nameRules"
                    label="Name"
                    hide-details
                    required
                  ></v-text-field>
                  <MainButton
                    variant="submit"
                    size="auto"
                    label="Bestätigen"
                    type="submit"
                    :is-loading="formIsLoading">
                  </MainButton>
            </v-form> 
          </div>
        </v-col>
      </v-row>
         
     
    </div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
  import { useMutation } from '@vue/apollo-composable'
  import { ref } from 'vue'

  import { usePageContext } from '#context/usePageContext'
  import DefaultLayout from '#layouts/DefaultLayout.vue'
  import { joinRoomQuery } from '#queries/joinRoomQuery'
  import MainButton from '#components/buttons/MainButton.vue'

  const pageContext = usePageContext()
  const id = pageContext.routeParams?.id
  const formIsLoading = ref(false)
  const username = ref('')


  const form = ref<HTMLFormElement>()

  const { mutate: sendJoinRoom } = useMutation(joinRoomQuery)

  async function submitJoinRoomForm() {
    const isValid = await form.value?.validate()
    if (isValid?.valid) {
      formIsLoading.value = !formIsLoading.value
      try {
        await sendJoinRoom({ 
          data:{
            id: id, 
            name: username.value} })
      }
      catch{}
  }}
</script>