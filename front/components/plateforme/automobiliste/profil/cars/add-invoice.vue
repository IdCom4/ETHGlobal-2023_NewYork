<template>
  <div>
    <vmc-modal
      :title="isEditing ? 'Modifier la facture' : 'Nouvelle facture'"
      :is-open="props.isOpenModal"
      max-width="500px"
      @close="emit('close-modal')"
    >
      <div class="new-invoice-content">
        <!-- DATE -->
        <vmc-input
          v-model="formValues.issuedAt"
          type="date"
          label="Date"
          :error="formErrors.issuedAt"
          :error-grow="true"
          :required="true"
          placeholder="Date"
          modal-style
          @blur="checkDate"
        />

        <!-- KILOMETERS -->
        <vmc-input
          v-model="formValues.mileage"
          :value="formValues.mileage === 0 ? null : formValues.mileage"
          type="number"
          placeholder="Kilomètrage"
          label="Kilomètrage"
          :error="formErrors.mileage"
          :error-grow="true"
          :required="true"
          modal-style
          @blur="checkMileage"
        />

        <!-- WORKS -->
        <div v-for="(work, i) in works" :key="`work-${i}`" class="works-line">
          <vmc-input
            :id="`work-${work._id}`"
            v-model="work.label"
            type="text"
            placeholder="Travaux réalisé"
            :label="`Travaux réalisés ${i + 1}`"
            :error="formErrors.interventions"
            :required="true"
            modal-style
            @blur="checkInterventions"
          />
          <button class="icon">
            <fa :icon="['far', 'circle-xmark']" @click="deleteWorksLine(i)" />
          </button>
        </div>
        <button class="btn_functional add-works" @click="addWorksLine">
          <fa icon="fa-solid fa-plus" class="icon" :width="10" />Ajoutez des travaux réalisés
        </button>

        <!-- ADDING FILE -->
        <input type="file" class="custom-file-input" @change="handleFile" />
        <p v-if="isFile" class="file-message">
          <span v-if="fileError" class="file-message__error">{{ fileError }}</span>
          <span v-else class="file-message__name">
            {{ filename }}
            <button class="icon">
              <fa :icon="['far', 'circle-xmark']" @click="deleteFile()" />
            </button>
          </span>
        </p>
      </div>

      <!-- BUTTONS -->
      <div class="btn-group">
        <button class="btn_call-to-action" @click="saveNewInvoice">{{ isEditing ? 'Modifiez' : 'Enregistrez' }}</button>
        <button v-if="isEditing" class="btn_denied" @click="deleteInvoice">Supprimer</button>
      </div>
    </vmc-modal>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close-modal', 'delete-invoice'])
const props = defineProps({
  isOpenModal: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  selectedInvoice: {
    type: Object as () => IVehicleInvoice | null,
    default: null
  },
  invoices: {
    type: Array as () => IVehicleInvoice[],
    default: () => []
  }
})

const generateRandomId = () => {
  return Math.random()
    .toString(36)
    .substr(2, 10)
}

// init
const isFile = ref<boolean>(false)
const filename = ref<string>('')
const fileError = ref<string>('')
const works = ref<IVehicleIntervention[]>([{ _id: generateRandomId(), label: '', category: '' }])
const isValid = ref<boolean>(true)

let formValues: IVehicleInvoice = reactive({
  _id: generateRandomId(),
  issuedAt: '',
  /* The value must be check */
  mileage: 0,
  interventions: works.value,
  hostedFileReferenceId: ''
})

const formErrors = reactive<Record<keyof IVehicleInvoice, string>>({
  _id: '',
  issuedAt: '',
  mileage: '',
  interventions: '',
  hostedFileReferenceId: ''
})

// Is an edition
const formValueToEdit = () => {
  const selectedInvoice = props.selectedInvoice
  if (props.isEditing && selectedInvoice) {
    works.value = selectedInvoice.interventions.map((intervention) => {
      return { _id: intervention._id, label: intervention.label, category: '' }
    })
    formValues.interventions = works.value
    formValues = { ...selectedInvoice }
  }
}

watch(
  () => props.isEditing,
  (newValue) => (newValue ? formValueToEdit() : resetModal())
)

watch(
  () => props.selectedInvoice,
  () => {
    props.isEditing && formValueToEdit()
  }
)

// Update interventions values
const updateInterventions = () => {
  formValues.interventions = works.value
}

// Checking fields
const checkDate = () => {
  if (!formValues.issuedAt || formValues.issuedAt.trim() === '' || formValues.issuedAt.length === 0) {
    formErrors.issuedAt = 'Vous devez renseigner la date'
    return false
  } else {
    formErrors.issuedAt = ''
    return true
  }
}
const checkMileage = () => {
  if (!formValues.mileage || formValues.mileage === 0) {
    formErrors.mileage = 'Vous devez renseigner le kilomètrage'
    return false
  } else {
    formErrors.mileage = ''
    return true
  }
}
const checkInterventions = () => {
  if (
    !formValues.interventions ||
    formValues.interventions.length === 0 ||
    (formValues.interventions.length === 1 && formValues.interventions[0].label.trim() === '')
  ) {
    formErrors.interventions = 'Vous devez renseigner au moins un travail réalisé'
    return false
  } else {
    formErrors.interventions = ''
    return true
  }
}

const validateInputs = [checkDate, checkMileage, checkInterventions]
const checkFiles = (): boolean => {
  let isValidFiled = true

  for (const validate of validateInputs) {
    !validate() && (isValidFiled = false)
  }

  isValid.value = isValidFiled

  return isValidFiled
}

// Send invoice
const saveNewInvoice = async (e: Event) => {
  e.preventDefault()

  updateInterventions()

  if (checkFiles() && isValid.value) {
    emit('close-modal', JSON.parse(JSON.stringify(formValues)))
    resetModal()
  }
}

// Handle works lines
const deleteWorksLine = (index: number) => {
  if (works.value.length === 1 && index === 0) {
    formErrors.interventions = 'Vous devez renseigner au moins un travail réalisé'
  } else {
    works.value.splice(index, 1)
  }
}

const addWorksLine = () => {
  const newWork: IVehicleIntervention = {
    _id: generateRandomId(),
    label: '',
    category: ''
  }
  works.value.push(newWork)
}

// Handle file
const handleFile = async (e: Event) => {
  const fileInput = e.target as HTMLInputElement

  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0]
    const allowedFormats = ['pdf', 'jpeg', 'jpg', 'png']
    const fileFormat = file.name
      .split('.')
      .pop()
      ?.toLowerCase()

    if (fileFormat && allowedFormats.includes(fileFormat)) {
      const fileBase64 = await useUtils().files.getFileAsBase64(file)

      if (!fileBase64) return
      formValues.hostedFileReferenceId = fileBase64.toString()

      fileError.value = ''
      filename.value = file.name
      isFile.value = true
    } else {
      filename.value = ''
      fileError.value = "Le format de fichier n'est pas autorisé(PDF, JPEG, JPG ou PNG)."
      formValues.hostedFileReferenceId = ''
      isFile.value = true
    }
  }
}

const deleteFile = () => {
  formValues.hostedFileReferenceId = ''
  isFile.value = false
}

// Delete invoice
const deleteInvoice = () => {
  if (props.isEditing && props.selectedInvoice !== null) {
    const invoiceIndex = props.invoices.findIndex((invoice) => invoice._id === props.selectedInvoice?._id)
    if (invoiceIndex !== -1) {
      const deletedInvoice = props.invoices[invoiceIndex]
      const updatedInvoices = [...props.invoices]

      updatedInvoices.splice(invoiceIndex, 1)

      emit('delete-invoice', deletedInvoice)
    }
  }
  emit('close-modal')
  resetModal()
}

// Reset modal
const resetModal = () => {
  works.value = [{ _id: generateRandomId(), label: '', category: '' }]
  formValues._id = ''
  formValues.issuedAt = ''
  formValues.mileage = 0
  formValues.interventions = works.value
  formValues.hostedFileReferenceId = ''
}
</script>

<style lang="scss" scoped>
.new-invoice-content {
  margin-bottom: 25px;

  .works-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: -7px 0;
    :first-child {
      width: 100%;
    }
    .icon {
      margin: 0 10px 0 15px;
      color: #7b7979;
      transition: 0.3s;
      :hover {
        color: #000;
      }
    }
  }
  .file-message {
    margin-top: 7px;
    font-size: 10px;
    font-style: italic;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    &__error {
      color: $color-error;
    }
  }
}
.btn-group {
  display: flex;
  width: 100%;
  button {
    display: block;
    margin: auto;
  }
}

.add-works,
.add-invoice {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.custom-file-input {
  color: transparent;
  max-width: 145px;
  &::before {
    content: 'Ajoutez une facture';
    display: inline-block;
    width: auto;
    padding: 5px 8px;
    white-space: nowrap;
    font-weight: 700;
    font-size: 13px;
    color: black;
    background: -webkit-linear-gradient(top, #f9f9f9, #dfdfdf);
    outline: none;
    text-shadow: 1px 1px #fff;
    border: 1px solid #999;
    cursor: pointer;
    transition: 0.3s;
    -webkit-user-select: none;
  }
  &:hover::before {
    border-color: black;
  }
  &:active {
    outline: 0;
  }
  &::-webkit-file-upload-button {
    visibility: hidden;
  }
}
</style>
