<template>
  <section class="professional-payment-info">
    <vmc-input v-model="dateOfBirth" modal-style type="date" label="Date de naissance"></vmc-input>
    <vmc-input v-model="iban" modal-style type="text" label="IBAN" placeholder="FR01234567890123456789"></vmc-input>
    <vmc-input v-model="selectedDocumentType" :select-options="documentTypes" modal-style type="select" label="Type de documents"></vmc-input>

    <div class="file-inputs">
      <vmc-file-upload title="Ajoutez la face avant" @update="handleFileUpload" />
      <vmc-file-upload
        v-if="[identityDocumentType.IDENTITY, identityDocumentType.DRIVE_LICENSE].includes(selectedDocumentType)"
        title="Ajoutez la face arrière"
        @update="(newFiles: File[]) => handleFileUpload(newFiles[0], true)"
      />
    </div>
    <div class="uploaded-files">
      <vmc-file-display :raw-files="identityFiles" @delete="removeFile(identityFiles, index)"></vmc-file-display>
    </div>
    <div class="terms-of-service">
      <vmc-input v-model="tosAccepted" type="checkbox" />
      <span>
        J'accepte les <a href="https://stripe.com/fr/legal/connect-account" target="_blank">termes et services</a> liés à l'utilisation de Stripe
      </span>
    </div>

    <p class="error-message">{{ errorMessage }}</p>
    <button class="btn_call-to-action" @click="updateAccount">Enregistrez</button>
  </section>
</template>

<script setup lang="ts">
import { SelectOptionStates } from '@/types/constants'

const iban = ref<string>('')
const dateOfBirth = ref<string>('')
const identityFiles = ref<File[]>([])
const selectedDocumentType = ref<string>('identity')
const errorMessage = ref<string>('')

let identityDocumentRecto: TBase64File | undefined
let identityDocumentVerso: TBase64File | undefined

const dateUtils = useUtils().dates

const documentTypes = ref<IInputSelectOptions<string>[]>([
  {
    value: 'identity',
    display: "Carte d'identité",
    state: SelectOptionStates.SELECTED
  }
])

const updateAccount = async () => {
  const formattedDateOfBirth = `${dateOfBirth.value} 12:00`
  const dateOfBirthDate = dateUtils.getDateFromStr(formattedDateOfBirth)
  if (!dateOfBirthDate) return

  const { data: accountToken, error } = await usePayment().createAccountToken({
    dateOfBirth: {
      day: dateOfBirthDate.getDate(),
      month: dateOfBirthDate.getMonth(),
      year: dateOfBirthDate.getFullYear()
    }
  })

  if (error || !accountToken) return

  await useAPI().payment.updateAccount(iban.value, accountToken, identityDocumentRecto, identityDocumentVerso)
}

function removeFile(filesArray: Array<unknown> | undefined, fileToRemoveIndex: number) {
  if (!filesArray) return
  filesArray.splice(fileToRemoveIndex, 1)
}

const handleFileUpload = async (files: File[], isDocumentVerso?: boolean) => {
  if (files.length < 1) return

  identityFiles.value.push(file)

  const { data: fileId } = await usePayment().uploadIdCard(file)

  if (!fileId) return
  if (isDocumentVerso) identityDocumentVerso = fileId
  else identityDocumentRecto = fileId
}
</script>

<style lang="scss" scoped>
.professional-payment-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;

  > button {
    margin: auto;
  }
}

.file-inputs {
  display: flex;
  justify-content: space-around;
  gap: 10px;
  > * {
    width: 100%;
  }
}
.uploaded-files {
  display: flex;
  gap: 10px;
}
.terms-of-service {
  display: flex;
  align-items: center;

  a {
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
