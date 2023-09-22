<template>
  <marged-page id="mission-demand">
    <mission-header />
    <form>
      <mission-issues
        v-model="formValues.issues"
        :error="formValidator.getErrorsOf('issues')[0]"
        @input="saveFormValuesToLocalStorage"
        @validate="formValidator.validateOne('issues')"
      />
      <mission-date
        v-model="formValues.date"
        :form-error="formValidator.getErrorsOf('date')[0]"
        @input="saveFormValuesToLocalStorage"
        @validate="formValidator.validateOne('date')"
      />
      <mission-address
        v-model="formValues.address"
        :form-error="formValidator.getErrorsOf('address')[0]"
        @input="saveFormValuesToLocalStorage"
        @validate="formValidator.validateOne('address')"
      />
      <mission-max-distance
        v-model="formValues.maxDistance"
        :issue-ids="formValues.issues.map((issue) => issue._id)"
        :pickup-address="formValues.address"
        :form-error="formValidator.getErrorsOf('maxDistance')[0]"
        @input="saveFormValuesToLocalStorage"
        @validate="formValidator.validateOne('maxDistance')"
      />
      <mission-vehicle
        v-model="formValues.vehicle"
        :form-error="formValidator.getErrorsOf('vehicle')[0]"
        @input="saveFormValuesToLocalStorage"
        @validate="formValidator.validateOne('vehicle')"
      />
      <mission-spare-parts
        v-model="formValues.hasSpareParts"
        :form-error="formValidator.getErrorsOf('hasSpareParts')[0]"
        @input="saveFormValuesToLocalStorage"
      />
      <mission-description
        v-model="formValues.description"
        :form-error="formValidator.getErrorsOf('description')[0]"
        @input="saveFormValuesToLocalStorage"
        @validate="formValidator.validateOne('description')"
      />
      <mission-files v-model="formValues.files" :form-error="formValidator.getErrorsOf('files')[0]" @validate="formValidator.validateOne('files')" />
      <mission-validate :loading="loading" @validate="submitForm" />
    </form>
  </marged-page>
</template>

<script setup lang="ts">
import { GlobalEventTypes } from '@/types/constants'

interface IMissionDemandForm {
  address: IStrictAddress | null
  date: string
  description: string
  files: TBase64File[]
  hasSpareParts: boolean
  maxDistance: number
  issues: IIssue[]
  vehicle: IOwnerVehicle | null
}

import { FormValidator } from '@/composables/useValidator'

const loading = ref<boolean>(false)
const formValues = ref<IMissionDemandForm>({
  address: null,
  date: '',
  description: '',
  hasSpareParts: false,
  maxDistance: 50,
  issues: [],
  files: [],
  vehicle: null
})
const formValidator = reactive<FormValidator<IMissionDemandForm>>(
  useValidator().createFormValidator<IMissionDemandForm>({
    address: {
      getter: () => formValues.value.address,
      validate: (address?: IStrictAddress | null) => (!address || Object.keys(address).length === 0 ? ['Veuillez saisir une adresse'] : [])
    },
    date: {
      getter: () => formValues.value.date,
      validate: (date?: string) => (!date || !date.trim() ? ['Veuillez cocher une date'] : [])
    },
    hasSpareParts: {
      getter: () => formValues.value.hasSpareParts,
      validate: () => []
    },
    maxDistance: {
      getter: () => formValues.value.maxDistance,
      validate: (maxDistance?: number) => (maxDistance == null || maxDistance < 0 ? ['Veuillez rentrer une distance maximum valide'] : [])
    },
    issues: {
      getter: () => formValues.value.issues,
      validate: (issues?: IIssue[]) => (!issues || !issues.length ? ['Veuillez ajouter au moins un problème'] : [])
    },
    files: {
      getter: () => formValues.value.files,
      validate: (files?: TBase64File[]) => (!files ? ['Veuillez sélectionner une image ou vidéo'] : [])
    },
    vehicle: {
      getter: () => formValues.value.vehicle,
      validate: (vehicle?: IOwnerVehicle | null) => (!vehicle || Object.keys(vehicle).length === 0 ? ['Veuillez renseigner un véhicule'] : [])
    },
    description: {
      getter: () => formValues.value.description,
      validate: (description?: string) => {
        if (!description) return ['Vous devez renseigner une description de votre besoin']
        if (description.length < 10) return ['Votre description doit faire au moins 10 caractères']
        if (description.length > 10000) return ['Votre description ne doit pas dépasser 10 000 caractères']

        return []
      }
    }
  })
)

onMounted(() => {
  useGlobalEvents().emitEvent(GlobalEventTypes.UPDATE_FOOTER_THEME, 'dark')
  loadFormValuesFromLocalStorage()
})

// get form value from localStorage
function loadFormValuesFromLocalStorage() {
  const storedValues = localStorage.getItem('missionRequestFormValue')

  // if local storage contains data, it means that this page already loaded at least once and stored data
  if (storedValues) {
    const parsedValues = JSON.parse(storedValues) as IMissionDemandForm

    formValues.value.address = parsedValues.address
    formValues.value.description = parsedValues.description
    formValues.value.date = parsedValues.date
    formValues.value.maxDistance = parsedValues.maxDistance
    formValues.value.files = parsedValues.files
    formValues.value.issues = parsedValues.issues
    formValues.value.vehicle = parsedValues.vehicle
    formValues.value.hasSpareParts = parsedValues.hasSpareParts
  }
  // else it means that this uis the first load of this page, and as such we need to load the pre-form data
  // (issues && address)
  else {
    const storedAddress = localStorage.getItem('mission-demand/address')
    if (storedAddress) formValues.value.address = JSON.parse(storedAddress)

    const storedIssues = localStorage.getItem('mission-demand/issues')
    if (storedIssues) formValues.value.issues = JSON.parse(storedIssues)

    // remove pre-form values form localStorage
    localStorage.removeItem('mission-demand/address')
    localStorage.removeItem('mission-demand/issues')

    // and store them as part of the form values
    saveFormValuesToLocalStorage()
  }
}

// Save form value in LocalStorage
const saveFormValuesToLocalStorage = () => {
  localStorage.setItem('missionRequestFormValue', JSON.stringify(formValues.value))
}

function cleanLocalStorage() {
  localStorage.removeItem('missionRequestFormValue')
}

async function submitForm() {
  if (!formValidator.validateForm()) return
  if (!formValues.value.vehicle || !formValues.value.address) return

  loading.value = true
  const { data: mission, error } = await useAPI().missions.createMission({
    vehicleId: formValues.value.vehicle?._id,
    issueIds: formValues.value.issues.map((issue) => issue._id),
    description: formValues.value.description,
    idealStartingMoment: formValues.value.date,
    idealPickupAddress: formValues.value.address,
    maxDistance: formValues.value.maxDistance,
    hasSpareParts: formValues.value.hasSpareParts,
    attachments: formValues.value.files
  })
  loading.value = false

  if (!mission || error) return

  cleanLocalStorage()
  useRouter().push(`/plateforme/automobiliste/mes-demandes/${mission._id}`)
}
</script>
