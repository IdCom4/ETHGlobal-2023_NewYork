<template>
  <div class="logo">
    <div class="logo__profile" :class="{ 'card-format': cardFormat }" :style="{ backgroundColor: color, color: complementaryColor }">
      {{ initial }}
      <img v-if="url" :src="url" class="logo__profile--img" alt="Profile Picture" />
      <label v-if="updatable" for="file-upload" class="logo__add">
        <input id="file-upload" class="logo__add--input" type="file" name="file" @change="uploadImage" />
        <span tabindex="0" class="logo__add--icon">+</span>
      </label>
    </div>

    <eth-modal :is-open="isModalWarning" title="Attention" max-width="400px" confirmation-style @close="closeModalWarning">
      <div class="modal">
        <p>{{ errorFile }}</p>
        <button class="btn-modal btn btn_call-to-action" @click="closeModalWarning()">ok</button>
      </div>
    </eth-modal>
  </div>
</template>

<script lang="ts" setup>
const emitEvent = defineEmits(['updated'])

const props = defineProps({
  user: {
    type: Object as PropType<ILiteUser>,
    required: true
  },
  isProfessional: {
    type: Boolean,
    default: false
  },
  updatable: {
    type: Boolean,
    default: false
  },
  cardFormat: {
    type: Boolean,
    default: false
  }
})

const initial = ref<string>(props.user.name.substring(0, 1) + props.user.lastName.substring(0, 1))
const color = useUtils().users.getUserColorAsHex(props.user._id)
const complementaryColor = useUtils().users.getComplementaryColor(useUtils().users.getUserColor(props.user._id))
const updatedUser = ref<IUser>()
const errorFile = ref<string>('')
const url = computed(() => (props.isProfessional ? props.user.professionalProfile?.businessPicture?.fileURL : props.user.picture?.fileURL) || '')

async function uploadImage(event: Event) {
  if (!props.user) return

  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const acceptedFormats = ['image/png', 'image/bmp', 'image/jpg', 'image/jpeg']
  if (!acceptedFormats.includes(file.type)) {
    errorFile.value = "Le format du fichier n'est pas pris en charge. Veuillez sélectionner une image au format PNG, BMP, JPG ou JPEG."
    openModalWarning()
    return
  }

  const base64result = await useUtils().files.getFileAsBase64(file)
  if (!base64result) return

  const maxFileSize = 5000000
  if (file.size > maxFileSize) {
    errorFile.value = 'Le poids du fichier dépasse la limite autorisée de 5MB. Veuillez sélectionner une image plus petite.'
    openModalWarning()
    return
  }

  if (props.isProfessional) {
    const response = await useAPI().professionals.updateProfile(['businessPicture'], { businessPicture: base64result || undefined })

    updatedUser.value = response.data || undefined

    if (updatedUser.value && updatedUser.value.professionalProfile?.businessPicture)
      emitEvent('updated', updatedUser.value.professionalProfile?.businessPicture?.fileURL)
  } else {
    const response = await useAPI().users.updateProfile({ picture: base64result || undefined })

    updatedUser.value = response.data || undefined
    if (updatedUser.value && updatedUser.value.picture) emitEvent('updated', updatedUser.value.picture?.fileURL)
  }
}

const isModalWarning = ref<boolean>(false)

const openModalWarning = () => {
  isModalWarning.value = true
}

const closeModalWarning = () => {
  isModalWarning.value = false
}
</script>

<style lang="scss" scoped>
.logo {
  position: relative;
  width: 200px;
  height: 200px;

  &__profile {
    height: 100%;
    width: 100%;
    border: $white 1px solid;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $font-size-8;
    font-family: $title-font;
    position: relative;
    font-weight: $font-weight-2;
    overflow: hidden;

    &--img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__add {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    right: 0;
    bottom: 0;
    border: 1px solid $white;
    color: $black;
    background-color: $color-neon-blue;
    z-index: 10s;
    font-size: $font-size-4;
    font-weight: $font-weight-4;
    width: 20px;
    height: 20px;

    &--input {
      display: none;
    }

    &--icon {
      text-align: center;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      user-select: none;
    }
  }
}

.modal {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
  justify-content: center;
  align-items: center;
}

@media (max-width: 900px) {
  .logo {
    height: 100px;
    width: 100px;
    &__profile {
      &.card-format {
        height: 130px;
        width: 130px;
      }
    }
  }
}

@media (max-width: 950px) {
  .logo {
    &__profile {
      width: 100px;
      height: 100px;
    }
  }
}
</style>
