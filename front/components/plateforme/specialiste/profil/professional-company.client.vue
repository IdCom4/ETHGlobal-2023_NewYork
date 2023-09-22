<template>
  <section class="professional-profile-company">
    <h3 class="main-title">Votre entreprise</h3>
    <div class="has-company">
      <h5 class="sub-title" @click="click()">AVEZ-VOUS UNE ENTREPRISE ?</h5>
      <form class="form">
        <vmc-input v-model="hasCompany" type="toggle" @input="updateDataCompany()" />
      </form>
    </div>
    <div v-if="hasCompany">
      <div class="company-infos siret">
        <form>
          <vmc-input
            v-model="siretNumber"
            type="text"
            :icon="`fa-${inseeRequestError ? 'regular fa-circle-xmark' : 'solid fa-circle-check'}`"
            label="Siret"
            :error="errorMessage"
            @click.prevent="updateDataCompany()"
          />
        </form>
      </div>
      <div v-if="companyData && !inseeRequestError" class="information">
        <div class="company-infos test">
          <vmc-input v-model="companyData.legalForm" type="text" disabled label="Forme juridique" />
        </div>
        <div class="company-infos">
          <vmc-input v-model="companyData.naf" type="text" disabled label="Activité principale" />
        </div>
        <div class="company-infos">
          <vmc-input v-model="companyData.denomination" type="text" disabled label="Dénomination" />
        </div>
        <div class="company-infos">
          <vmc-input v-model="displayAdress" type="address" disabled label="Adresse" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { AlertStatuses, LEGAL_FORMS } from '@/types/constants'
import { useGeocoder } from '@/composables/useGeocoder'

/* Siret HBRECOVERY: 88209112700010 */

// this component is only meant to be used on the professional profile page
// as such, there is no fallback behavior if this component is rendered without a professional logged in
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const user = useSessionStore().getUser<IProfessionalUser>()!

const professionalProfile = reactive<IProfessionalProfile>(user.professionalProfile)
const companyData = ref<ICompany | null>(professionalProfile.company || null)
const hasCompany = ref(companyData.value ? true : false)
const siretNumber = ref(companyData.value?.siret || '')
const inseeRequestError = ref<boolean>(false)
const errorMessage = ref<string>('')
const displayAdress = ref<string>(
  `${professionalProfile.company?.legalAddress.street}, ${companyData.value?.legalAddress.city} ${companyData.value?.legalAddress.zipCode}`
)

const getCompanyData = async () => {
  const { data, error: inseeError } = await useRequest().get<InseeCompany>(`/entreprises/sirene/V3/siret/${siretNumber.value}`, {
    baseURL: 'https://api.insee.fr',
    headers: { authorization: 'Bearer ba201c33-574b-3ebe-a76c-610a7c528a1e' },
    alert: { mode: 'on-error', errorMsg: 'Numéro de Siret invalide' }
  })

  const geocoder = useGeocoder()
  if (data) {
    const {
      numeroVoieEtablissement,
      typeVoieEtablissement,
      libelleVoieEtablissement,
      libelleCommuneEtablissement,
      codeCommuneEtablissement
    } = data.etablissement.adresseEtablissement

    const addressString = `${numeroVoieEtablissement} ${typeVoieEtablissement} ${libelleVoieEtablissement}, ${codeCommuneEtablissement} ${libelleCommuneEtablissement}`

    const suggestions = await geocoder.getAddressSuggestionsFromGeocoderAPI(addressString, true, 'address')
    if (!data || inseeError) {
      inseeRequestError.value = true
      errorMessage.value = 'Ce numéro de siret est inconnu.'
      return
    } else inseeRequestError.value = false

    const uniteLegale = data.etablissement.uniteLegale

    const legalForm = LEGAL_FORMS.find(({ code }) => code === parseInt(uniteLegale.categorieJuridiqueUniteLegale)) || {
      name: 'Forme légale inconnue'
    }
    const company: ICompany = {
      siret: siretNumber.value,
      denomination: uniteLegale.denominationUniteLegale,
      naf: uniteLegale.activitePrincipaleUniteLegale,
      legalForm: legalForm.name,
      legalAddress: {
        street: `${numeroVoieEtablissement} ${typeVoieEtablissement} ${libelleVoieEtablissement}`,
        city: libelleCommuneEtablissement,
        zipCode: codeCommuneEtablissement,
        coordinates: suggestions[0].center
      }
    }

    const { error: updateError } = await useAPI().professionals.updateProfile(['company'], { company })
    if (updateError && !updateError.status) useAlertStore().sendAlert(AlertStatuses.ERROR, updateError.message)
    else companyData.value = company
  }
  displayAdress.value = `${companyData.value?.legalAddress.street}, ${companyData.value?.legalAddress.city} ${companyData.value?.legalAddress.zipCode}`
}

const deleteCompanyData = async () => {
  const { error: updateError } = await useAPI().professionals.updateProfile(['company'], {})
  if (updateError && !updateError.status) useAlertStore().sendAlert(AlertStatuses.ERROR, updateError.message)
}

const updateDataCompany = () => {
  if (!hasCompany.value) {
    deleteCompanyData()
  } else getCompanyData()
}

onMounted(async () => {
  if (siretNumber.value && hasCompany) {
    displayAdress.value = `${companyData.value?.legalAddress.street}, ${companyData.value?.legalAddress.city} ${companyData.value?.legalAddress.zipCode}`
  }
})

watch(
  () => professionalProfile,
  () => {
    if (professionalProfile) hasCompany.value = true
    else {
      hasCompany.value = false
      deleteCompanyData()
    }
  }
)
</script>

<style lang="scss" scoped>
.information {
  display: flex;
  flex-direction: column;
}

.professional-profile-company {
  border: 0.5px solid black;
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px;
  .company-infos {
    .info-title {
      font-weight: 700;
      font-size: 14px;
      line-height: 19px;
      margin-bottom: 5px;
    }
  }

  .has-company {
    margin-top: 20px;

    .sub-title {
      margin-bottom: 12px;
      font-weight: $font-weight-4;
    }
  }

  .main-title {
    display: flex;
    text-align: center;
    flex-direction: column;
    &::after,
    &::before {
      margin: 15px;
    }
  }

  p {
    font-weight: 400;
  }
}

form.form {
  width: 115px;
}

@media screen and (max-width: 900px) {
  .professional-profile-company {
    padding: 0;
    border: none;
    margin: 20px;
  }
}
</style>
