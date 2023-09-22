<template>
  <centered-section>
    <div class="validation">
      <button v-if="isLoggedIn" class="btn_call-to-action" :class="{ '--load': loading }" type="button" @click="emitValidate">
        Envoyez votre demande
      </button>
      <button v-else class="btn_call-to-action" :class="{ '--load': loading }" type="button" @click="openLoginModal">Envoyez votre demande</button>
    </div>
    <p class="notice">Envoyer une demande de devis ne vous engage à rien. Vous serez libre d'accepter ou de refuser les devis proposés</p>
  </centered-section>
</template>
<script setup lang="ts">
import { GlobalEventTypes } from '@/types/constants'

const emit = defineEmits(['validate'])
defineProps({ loading: { type: Boolean, default: false } })

const isLoggedIn = ref<boolean>(useSessionStore().isLoggedIn)

watch(
  () => useSessionStore().isLoggedIn,
  () => (isLoggedIn.value = useSessionStore().isLoggedIn)
)

function openLoginModal() {
  useGlobalEvents().emitEvent(GlobalEventTypes.OPEN_LOGIN)
}

const emitValidate = () => {
  emit('validate')
}
</script>
<style lang="scss">
.validation {
  display: flex;
  justify-content: center;
}
.notice {
  margin: 3.75rem;
  text-align: center;
}

@media screen and (max-width: 480px) {
  .notice {
    margin: 50px 10px 10px;
  }
}
</style>
