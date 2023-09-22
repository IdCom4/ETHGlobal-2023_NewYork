<template>
  <section class="vehicle-invoice-input">
    <div class="new-invoice-content">
      <!-- DATE -->
      <vmc-input
        v-model="formValues.madeAt"
        error-grow
        modal-style
        type="date"
        label="Fait le"
        placeholder="Date"
        :error="formValidator.getErrorsOf('madeAt')[0]"
        @blur="formValidator.validateOne('madeAt')"
      />

      <!-- MILEAGE -->
      <vmc-input
        v-model="formValues.vehicleMileage"
        error-grow
        modal-style
        type="number"
        placeholder="Kilométrage"
        label="Kilométrage"
        :error="formValidator.getErrorsOf('vehicleMileage')[0]"
        @blur="formValidator.validateOne('vehicleMileage')"
        @input="formValidator.validateOne('vehicleMileage')"
      />

      <!-- INTERVENTIONS -->
      <autocomplete-input
        v-if="interventionsOptions.length"
        v-model="formValues.interventionIds"
        label="Travaux réalisés"
        :options="interventionsOptions"
      />

      <!-- PRICE -->
      <vmc-input
        v-model="formValues.totalTTC"
        error-grow
        modal-style
        type="number"
        placeholder="Total TTC"
        label="Total TTC"
        :error="formValidator.getErrorsOf('totalTTC')[0]"
        @blur="formValidator.validateOne('totalTTC')"
        @input="formValidator.validateOne('totalTTC')"
      />

      <!-- ADDING FILE -->
      <vmc-file-upload
        :error="formValidator.getErrorsOf('invoiceFile')[0]"
        :allowed-files="[FileTypes.PNG, FileTypes.JPEG, FileTypes.JPG, FileTypes.PDF]"
        @update="(files: TBase64File[]) => setFile(files[0])"
      />
    </div>

    <!-- BUTTONS -->
    <div class="btn-group">
      <button v-if="!isCreatingNewInvoice" class="btn_denied" :class="{ '--load': loading }" @click="deleteInvoice">Supprimer</button>
      <button v-else class="btn_denied" :class="{ '--load': loading }" @click="emit('cancel')">Annuler</button>
      <button class="btn_call-to-action" :class="{ '--load': loading }" @click="updateInvoice">Enregistrer</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ICreateVehicleInvoicePayload, IUpdateVehicleInvoicePayload } from '@/composables/resources/api-endpoints/invoices.endpoint'
import { FormValidator } from '@/composables/useValidator'
import { FileTypes } from '@/types/constants'

type TMandatoryVehicleInvoicePayload = Omit<ICreateVehicleInvoicePayload, 'interventionIds' | 'otherInterventions'>

const emit = defineEmits(['created', 'updated', 'deleted', 'cancel'])
const props = defineProps({
  selectedInvoice: { type: Object as () => IVehicleInvoice | null, default: null },
  vehicleId: { type: String, required: true }
})

// init
const isCreatingNewInvoice = ref<boolean>(!props.selectedInvoice)
const formValues = ref<ICreateVehicleInvoicePayload>(initFormValues())
const formValidator = ref<FormValidator<TMandatoryVehicleInvoicePayload>>(
  useValidator().createFormValidator<TMandatoryVehicleInvoicePayload>({
    vehicleId: {
      getter: () => formValues.value.vehicleId,
      validate: (vehicleId?: string) => (vehicleId ? [] : ["L'id du véhicule est requise"])
    },
    vehicleMileage: {
      getter: () => formValues.value.vehicleMileage,
      validate: (vehicleMileage?: number) =>
        vehicleMileage !== null && vehicleMileage !== undefined
          ? vehicleMileage >= 0
            ? []
            : ['Le kilométrage ne peut pas être négatif']
          : ["L'id du véhicule est requise"]
    },
    totalTTC: {
      getter: () => formValues.value.totalTTC,
      validate: (totalTTC?: number) =>
        totalTTC !== null && totalTTC !== undefined
          ? totalTTC > 0
            ? []
            : ['Le total TTC ne peut pas être inférieur ou égal à 0']
          : ['Vous devez indiquer le total TTC']
    },
    invoiceFile: {
      getter: () => formValues.value.invoiceFile,
      validate: (invoiceFile?: string) => (invoiceFile || !isCreatingNewInvoice.value ? [] : ['Vous devez renseigner une copie de la facture'])
    },
    madeAt: {
      getter: () => formValues.value.madeAt,
      validate: (madeAt?: string) => (madeAt && madeAt.trim() ? [] : ['Vous devez renseigner la date de la facture'])
    }
  })
)
const interventionsOptions = ref<IInputSelectOptions<string>[]>([])
const loading = ref<boolean>(false)

fetchInterventionsAndSetupOptions()

async function fetchInterventionsAndSetupOptions() {
  const { data, error } = await useAPI().interventions.getInterventions()
  if (!data || error) return

  interventionsOptions.value = data.map((intervention) => ({ value: intervention._id, display: intervention.label }))
}

function setFile(base64File: TBase64File) {
  formValues.value.invoiceFile = base64File
  formValidator.value.validateOne('invoiceFile')
}

// Send invoice
async function updateInvoice() {
  if (loading.value || !formValidator.value.validateForm()) return

  const payload: ICreateVehicleInvoicePayload | IUpdateVehicleInvoicePayload = {
    ...formValues.value,
    madeAt: `${formValues.value.madeAt} 00:00`,
    interventionIds: formValues.value.interventionIds.filter((id) => !!id),
    otherInterventions: formValues.value.otherInterventions.filter((id) => !!id),
    invoiceFile: formValues.value.invoiceFile || undefined
  }

  let response: IRequestResult<IVehicleInvoice> | null = null

  loading.value = true
  if (isCreatingNewInvoice.value) response = await useAPI().invoices.createNewVehicleInvoice(payload as ICreateVehicleInvoicePayload)
  else if (props.selectedInvoice) response = await useAPI().invoices.updateVehicleInvoice(props.selectedInvoice._id, payload)
  loading.value = false

  if (!response || !response.data || response.error) return

  emit(props.selectedInvoice ? 'updated' : 'created', response.data)
}

// Delete invoice
async function deleteInvoice() {
  if (loading.value || !props.selectedInvoice) return

  loading.value = true
  const { error } = await useAPI().invoices.deleteInvoice(props.selectedInvoice._id)
  loading.value = false
  if (error) return

  emit('deleted')
}

function initFormValues(): ICreateVehicleInvoicePayload {
  return props.selectedInvoice
    ? {
        vehicleId: props.selectedInvoice.vehicleId,
        vehicleMileage: props.selectedInvoice.vehicleMileage,
        interventionIds: props.selectedInvoice.interventionIds,
        otherInterventions: props.selectedInvoice.otherInterventions,
        totalTTC: props.selectedInvoice.totalTTC,
        invoiceFile: '',
        madeAt: props.selectedInvoice.madeAt.split(' ')[0]
      }
    : {
        vehicleId: props.vehicleId,
        vehicleMileage: 0,
        interventionIds: [],
        otherInterventions: [],
        totalTTC: 0,
        invoiceFile: '',
        madeAt: ''
      }
}

watch(
  () => props.selectedInvoice,
  () => {
    isCreatingNewInvoice.value = !props.selectedInvoice
    formValues.value = initFormValues()
  }
)
</script>

<style lang="scss" scoped>
.new-invoice-content {
  margin-bottom: 25px;

  .other-interventions-list {
    margin-top: $spacing-3;
    .subtitle {
      font-weight: bold;
      margin-bottom: $spacing-3;
    }
    .other-intervention + .other-intervention {
      margin-top: 20px;
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
  justify-content: center;
  gap: 10px;
  width: 100%;
  button {
    display: block;
  }
}

.add-intervention,
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
    user-select: none;
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
