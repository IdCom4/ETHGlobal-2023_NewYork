<template>
  <div class="signup-page">
    <div class="image-section" :class="{ slide: slide }" :style="backgroundStyle"></div>
    <div v-if="showForm" class="form-section">
      <div class="go-back" @click="goBack">
        <fa :icon="['fas', 'arrow-left']" />
      </div>
      <p class="form-title">Créer un compte</p>

      <form>
        <vmc-input
          v-model="formValues.firstName"
          type="text"
          placeholder="Prénom"
          label="Prénom"
          :error="formErrors.firstName"
          error-grow
          required
          @input="setLocalStorage"
          @blur="checkFirstName"
        />
        <vmc-input
          v-model="formValues.lastName"
          type="text"
          placeholder="Nom"
          label="Nom"
          :error="formErrors.lastName"
          error-grow
          required
          @input="setLocalStorage"
          @blur="checkLastName"
        />
        <vmc-input
          v-model="formValues.email"
          type="text"
          placeholder="Email"
          label="Email"
          :error="formErrors.email"
          error-grow
          required
          @input="setLocalStorage"
          @blur="checkEmail"
        />
        <vmc-input
          v-model="formValues.phone"
          type="text"
          placeholder="Téléphone"
          label="Téléphone"
          :error="formErrors.phone"
          error-grow
          required
          @input="setLocalStorage"
          @blur="checkPhone"
        />
        <vmc-input
          v-model="formValues.password"
          :type="passwordData[0].type"
          placeholder="Mot de passe"
          label="Mot de passe"
          :error="formErrors.password"
          error-grow
          required
          :icon="passwordData[0].icon"
          @blur="checkPassword"
          @icon-click="() => show_password(0)"
        />
        <vmc-input
          v-model="formValues.confirmPassword"
          :type="passwordData[1].type"
          placeholder="Confirmez mot de passe"
          label="Confirmez mot de passe"
          :error="formErrors.confirmPassword"
          error-grow
          required
          :icon="passwordData[1].icon"
          @blur="checkConfirmPassword"
          @icon-click="() => show_password(1)"
        />
        <label class="checkbox-inp">
          <vmc-input
            v-model="formValues.termsAccepted"
            type="checkbox"
            :error="formErrors.termsAccepted"
            error-grow
            required
            @input="setLocalStorage"
          >
            <small>
              En cochant cette case, j'affirme que j'ai lu et accepté les
              <nuxt-link to="/">conditions générales d'utilisation</nuxt-link>
              et je m'engage à appliquer la
              <nuxt-link to="/">charte écologique</nuxt-link>
              du site valuemycar.fr
            </small>
          </vmc-input>
        </label>

        <!-- <div class="checkbox-inp">
          <vmc-input v-model="formValues.newlettre" type="checkbox" @input="setLocalStorage">
            <small>
              Recevez toutes nos actualités en vous inscrivant à notre Newsletter
            </small>
          </vmc-input>
        </div> -->

        <br />
        <div>
          <small
            >En enregistrant mon compte, j'accepte le
            <nuxt-link to="/">
              Contrat des services et le Contrat de compte connecté Stripe.
            </nuxt-link>
          </small>
        </div>

        <br />

        <button class="btn_call-to-action" :class="{ '--load': loading }" @click="checkFormular">
          <span v-if="!isProfessional" class="btn-font-weight">CREER UN COMPTE AUTOMOBILISTE</span>
          <span v-else class="btn-font-weight">COMPLÉTER MES INFORMATIONS</span>
        </button>
      </form>
    </div>
    <div v-else class="question-section">
      <p>Je suis un</p>
      <div class="choice-button-group">
        <div class="button-navigation">
          <button class="navigation btn_call-to-action" @click="selectOption(SPECIALISTE)">SPECIALISTE</button>
        </div>
        <div class="button-navigation">
          <button class="navigation btn_call-to-action" @click="selectOption(AUTOMOBILISTE)">AUTOMOBILISTE</button>
        </div>
      </div>
    </div>
    <!-- MODALE ONLY FOR PROFESSIONNAL-->
    <vmc-modal v-if="isProfessional" max-width="1200px" :is-open="professionalModal" @close="closeModal">
      <h3 class="pro-modale-title">ADRESSE PROFESSIONNELLE</h3>
      <p class="modal-p ">Indiquez l’adresse à laquelle vous souhaitez réaliser vos missions.</p>
      <p class="modal-p italic">
        Si vous êtes itinérant, renseignez l’adresse autour de laquelle vous souhaitez recevoir des missions.
      </p>
      <div class="vmc-input-address-wrapper">
        <vmc-input
          v-model="formValues.workAddress"
          type="address"
          placeholder="Adresse professionnelle"
          label="Adresse professionnelle"
          :error="formErrors.workAddress"
          modal-style
          error-grow
          required
          @blur="checkProfessionalAddress"
        />
      </div>
      <!-- skills -->
      <h3>COMPÉTENCES</h3>
      <div class="skillsList">
        <professional-skills-dropdown
          v-for="(category, index) of SkillCategories"
          :key="`skill-${index}`"
          v-model="selectedSkills"
          :skills="skillsByCategory[category]"
          :category="category"
        />
      </div>
      <p style="color: red">{{ formErrors.skills }}</p>
      <div class="btn-container">
        <button class="btn_call-to-action" :class="{ '--load': loading }" @click="checkAdditionalsInfos">
          CREER UN COMPTE SPÉCIALISTE
        </button>
      </div>
    </vmc-modal>
    <vmc-modal :is-open="confirmationModal" max-width="500px" @close="closeModal">
      <div class="confirmation-email">
        <p>
          Afin de finaliser votre inscription, veuillez confirmer votre adresse e-mail en cliquant sur le lien du mail que nous venons de vous
          envoyer.
        </p>
        <button class="btn_call-to-action" @click="useRouter().go(-1)">retour à l'accueil</button>
      </div>
    </vmc-modal>
  </div>
</template>

<script setup lang="ts">
import { InputTypes } from '@/types/constants'
import { SkillCategories } from '@/types/constants/models/skill'

const passwordData = ref<Array<{ icon: string; state: boolean; type: InputTypes }>>([
  { icon: 'fa-regular fa-eye', state: false, type: InputTypes.PASSWORD },
  { icon: 'fa-regular fa-eye', state: false, type: InputTypes.PASSWORD },
  { icon: 'fa-regular fa-eye', state: false, type: InputTypes.PASSWORD }
])

const show_password = (index: number) => {
  passwordData.value[index].state = !passwordData.value[index].state

  if (passwordData.value[index].state) {
    passwordData.value[index].type = InputTypes.TEXT
    passwordData.value[index].icon = 'fa-regular fa-eye-slash'
  } else {
    passwordData.value[index].icon = 'fa-regular fa-eye'
    passwordData.value[index].type = InputTypes.PASSWORD
  }
}

const SPECIALISTE = 'specialiste'
const AUTOMOBILISTE = 'automobiliste'

// Init states
const showForm = ref<boolean>(false)
const slide = ref<boolean>(false)
const isProfessional = ref<boolean>(false)
const isValid = ref<boolean>(true)
const loading = ref<boolean>(false)
const professionalModal = ref<boolean>(false)
const confirmationModal = ref<boolean>(false)

const allSkills = ref<ISkill[]>([])
const skillsByCategory = ref<Record<SkillCategories, ISkill[]>>({
  [SkillCategories.WASHING]: [],
  [SkillCategories.DETAILING]: [],
  [SkillCategories.MECANIC]: []
})
const selectedSkills = ref<ISkill[]>([])

// fields
interface IRegisterForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
  workAddress?: IStrictAddress
  skills: string[]
}

const formValues: IRegisterForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
  workAddress: undefined,
  skills: []
}

// Errors
const formErrors = reactive<Record<keyof IRegisterForm, string>>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  termsAccepted: '',
  workAddress: '',
  skills: ''
})
// background images
const backgroundImages: string[] = [
  'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Landings-pages_center/detailing/cars/IMG_4341.webp',
  'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Landings-pages_center/centre/SRYJE7679.webp',
  'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Landings-pages_center/centre/TVQBE7347.webp'
]
const backgroundStyle = computed(() => ({
  backgroundImage: `url(${getRandomImage()})`
}))

// Save fileds value in LocalStorage
const setLocalStorage = () => {
  const userValues = {
    firstName: formValues.firstName,
    lastName: formValues.lastName,
    email: formValues.email,
    phone: formValues.phone,
    termsAccepted: formValues.termsAccepted,
    isProfessional: isProfessional.value,
    workAddress: formValues.workAddress,
    skills: selectedSkills.value
  }

  localStorage.setItem('userValues', JSON.stringify(userValues))
}

// get fileds value from localStorage
onMounted(() => {
  const storedValues = JSON.parse(localStorage.getItem('userValues') || '{}')

  formValues.firstName = storedValues.firstName || ''
  formValues.lastName = storedValues.lastName || ''
  formValues.email = storedValues.email || ''
  formValues.phone = storedValues.phone || ''
  formValues.termsAccepted = storedValues.termsAccepted || false
  formValues.workAddress = storedValues.workAddress || ''

  selectedSkills.value = storedValues.skills || []
})

// Go back from formular to question
const goBack = () => {
  showForm.value = false
  slide.value = false

  nextTick(() => {
    backgroundStyle.value.backgroundImage = `url(${getRandomImage()})`
  })
}

// Change backgroundImage randomly
const getRandomImage = () => {
  return backgroundImages[Math.floor(Math.random() * backgroundImages.length)]
}

// Select if user or professional
const selectOption = (option: string) => {
  if (option === SPECIALISTE) {
    isProfessional.value = true
  } else {
    isProfessional.value = false
  }

  // slide effect to show formular
  showForm.value = !showForm.value
  slide.value = !slide.value

  nextTick(() => {
    backgroundStyle.value.backgroundImage = `url(${getRandomImage()})`
  })
}

// Check each filed
const checkFirstName = () => {
  if (!formValues.firstName || formValues.firstName.trim() === '') {
    formErrors.firstName = 'Veuillez saisir votre prénom'
    return false
  } else {
    formErrors.firstName = ''
    return true
  }
}
const checkLastName = () => {
  if (!formValues.lastName || formValues.lastName.trim() === '') {
    formErrors.lastName = 'Veuillez saisir votre nom'
    return false
  } else {
    formErrors.lastName = ''
    return true
  }
}
const checkEmail = () => {
  if (!formValues.email || formValues.email.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
    formErrors.email = 'Veuillez saisir une adresse email valide'
    return false
  } else {
    formErrors.email = ''
    return true
  }
}
const checkPhone = () => {
  if (!/^(?:\+33|0)[1-9](?:\d{2}){4}$/.test(formValues.phone)) {
    formErrors.phone = 'Veuillez saisir un numéro de téléphone valide'
    return false
  } else {
    formErrors.phone = ''
    return true
  }
}
const checkPassword = () => {
  if (!formValues.password || formValues.password.trim() === '' || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/.test(formValues.password)) {
    formErrors.password =
      'Vérifiez que votre mot de passe comprend au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial. Les caractères spéciaux autorisés sont @, $, !, %, *, ? et &.'
    return false
  } else {
    formErrors.password = ''
    return true
  }
}

const checkConfirmPassword = () => {
  if (!formValues.confirmPassword || formValues.confirmPassword.trim() === '' || formValues.confirmPassword !== formValues.password) {
    formErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    return false
  } else {
    formErrors.confirmPassword = ''
    return true
  }
}

const checkTermsAccepted = () => {
  if (!formValues.termsAccepted) {
    formErrors.termsAccepted = "Vous devez accepter les conditions générales d'utilisations"
    return false
  } else {
    formErrors.termsAccepted = ''
    return true
  }
}

// Check Formular before submition
const checkFormular = (e: Event) => {
  e.preventDefault()

  if (validateFormular() && isValid.value) {
    isProfessional.value ? openProfessionalModal() : submitionForm(e)
  }
}
// Validations of every functions of formular
const validationsFormular = [checkFirstName, checkLastName, checkEmail, checkPhone, checkPassword, checkConfirmPassword, checkTermsAccepted]
const validateFormular = () => {
  let isFormValid = true

  // Check each fields are valid
  for (const validation of validationsFormular) {
    !validation() && (isFormValid = false)
  }

  isValid.value = isFormValid

  return isFormValid
}

/* ONLY FOR PROFESSIONAL */
// Get skills
const fetchSkills = async () => {
  const { data } = await useAPI().skills.getSkills()
  if (!data) return

  allSkills.value = data
  const allCategories = Object.values(SkillCategories)
  for (const category of allCategories) {
    skillsByCategory.value[category] = allSkills.value.filter((skill) => skill.categories.includes(category))
  }
}
// Open modal
const openProfessionalModal = async () => {
  await fetchSkills()
  professionalModal.value = true
}

const closeModal = () => {
  professionalModal.value = false
  confirmationModal.value = false
}
// Check each filed on blur
const checkProfessionalAddress = () => {
  if (!formValues.workAddress) {
    formErrors.workAddress = 'Vous devez renseigner une adresse professionnelle'
    return false
  } else {
    formErrors.workAddress = ''
    return true
  }
}
const checkSkills = () => {
  if (selectedSkills.value.length <= 0) {
    formErrors.skills = 'Vous devez sélectionner au moins 1 compétence'
    return false
  } else {
    formErrors.skills = ''
    return true
  }
}
// Check additional infos before submition
const checkAdditionalsInfos = async (e: Event) => {
  e.preventDefault()
  const validate = validateAdditional() && isValid.value

  if (validate) submitionForm(e)
}
// Validations of addionals informations
const validationsAdditionals = [checkProfessionalAddress, checkSkills]
const validateAdditional = () => {
  let isFormValid = true

  // Check each fileds are valid
  for (const validation of validationsAdditionals) {
    !validation() && (isFormValid = false)
  }

  isValid.value = isFormValid

  return isFormValid
}

/* Submit formular */
const submitionForm = async (e: Event) => {
  e.preventDefault()

  if (await registerAccount()) {
    professionalModal.value = false
    confirmationModal.value = true
    localStorage.clear()
  }
}

const registerAccount = async (): Promise<boolean> => {
  // register the user with the account token
  loading.value = true
  const { data, error } = await useAPI().auth.register(
    formValues.firstName,
    formValues.lastName,
    formValues.phone,
    formValues.email,
    formValues.password,
    isProfessional.value
      ? {
          skillIds: selectedSkills.value.map((skill) => skill._id),
          workAddress: formValues.workAddress
        }
      : undefined
  )
  loading.value = false

  return !!data && !error
}
</script>

<style lang="scss">
.signup-page {
  position: relative;
  min-height: 100vh;
  margin: 0;
  .image-section {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: transform 0.5s ease-out;
    &.slide {
      transform: translateX(-100%);
    }
  }

  .question-section {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    width: 50%;
    height: 100%;
    transition: transform 0.5s ease-out;
    animation: fadeInSection 1.5s;
    p {
      margin-bottom: 40px;
      font-family: 'Montserrat';
      font-size: 30px;
      font-weight: bold;
    }
    .choice-button-group {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      width: 90%;
      .button-navigation {
        width: 40%;
        button {
          width: 100%;
          font-size: clamp(12px, 1vw, 27px);
        }
      }
    }
    &.slide {
      transform: translateX(-100%);
    }
  }

  .form-section {
    position: relative;
    padding: 25px 0;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    transform: translateX(100%);
    transition: 1s ease-out;
    animation: fadeInSection 3s;
    .go-back {
      position: absolute;
      top: 25px;
      left: 5%;
      cursor: pointer;
    }
    .form-title {
      font-size: 35px;
      margin-bottom: 15px;
    }
    form {
      text-align: center;
      margin: 0 calc(20px + clamp(0px, 5vw, 80px));
      input {
        width: 100%;
      }
      .checkbox-inp {
        display: flex;
        cursor: pointer;
        small {
          text-align: left;
        }
      }
      small {
        font-size: 15px;
      }
      input[type='submit'] {
        width: auto;
        border: none;
        margin: 0;
        font-family: 'Montserrat';
        font-weight: 700;
        font-style: italic;
        font-size: 12px;
        padding: 10px 15px;
        background-color: $color-neon-blue;
      }
    }
  }

  .vmc-input-address-wrapper {
    max-width: 550px;
    margin: 50px auto;
  }
}
.skillsList {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  justify-items: center;
  grid-gap: $spacing-2;
  margin-top: 50px;
}
.confirmation-email {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  gap: 25px;
  width: 80%;
  margin: 10px auto;
  p {
    width: 100%;
    text-align: center;
    font-size: 18px;
  }
}
.modal-p {
  text-align: center;
  margin: 25px auto;
  &.italic {
    font-style: italic;
  }
}

.skillsList {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  justify-items: center;
  grid-gap: $spacing-2;
  margin-top: 50px;
}

.btn-container {
  display: flex;
  justify-content: center;
}

/* TABLETTE */
@media (max-width: 875px) {
  .question-section {
    .choice-button-group {
      flex-direction: column;
      .button-navigation {
        width: 75%;
        button {
          margin: 10px 0;
        }
      }
    }
  }
}

/* MOBILE */
@media (max-width: 800px) {
  .image-section {
    display: none;
  }
  .signup-page {
    height: auto;
  }
  .question-section {
    width: 100% !important;
  }
  .form-section {
    padding: 20px 0;
    width: 100% !important;
    height: auto !important;
    translate: -100%;
    .form-title {
      margin-top: 0;
      margin-bottom: 22px;
    }
  }
  .go-back {
    top: 20px !important;
  }
}

@media screen and (max-width: 670px) {
  .skillsList {
    justify-content: center;
  }
}
@media screen and (max-width: 600px) {
  .pro-modale-title {
    font-size: 15px;
  }
}

.btn-font-weight {
  font-weight: 800;
}
</style>
