<template>
  <section class="vehicle-invoices-list">
    <table class="vehicle-invoices-table">
      <thead class="vehicle-invoices-table__thead">
        <tr class="vehicle-invoices-table__thead--tr-head">
          <th>Date</th>
          <th>Kilométrage</th>
          <th>Travaux réalisés</th>
          <th>Prix TTC</th>
          <th>Facture</th>
        </tr>
      </thead>
      <tbody v-if="invoices" class="vehicle-invoices-table__tbody">
        <tr v-for="invoice in invoices" :key="`invoice-${invoice._id}`" class="vehicle-invoices-table__tbody--tr-body invoice-line">
          <!-- DATE -->
          <td title="Cliquez pour éditer ou supprimer" @click="editInvoice(invoice)">{{ invoice.madeAt.split(' ')[0] }}</td>
          <!-- KILOMETRAGE -->
          <td title="Cliquez pour éditer ou supprimer" @click="editInvoice(invoice)">{{ invoice.vehicleMileage }} km</td>
          <!-- TRAVAUX REALISES -->
          <td title="Cliquez pour éditer ou supprimer" @click="editInvoice(invoice)">
            <p v-for="(intervention, index) in invoice.interventions" :key="`intervention-${index}`">{{ intervention.label }}</p>
          </td>
          <!-- PRIX -->
          <td title="Cliquez pour éditer ou supprimer" @click="editInvoice(invoice)">{{ invoice.totalTTC }} €</td>
          <!-- FACTURE -->
          <td v-if="invoice.fileReferenceId" class="download-invoice" @click="downloadInvoice(invoice._id)">
            <vmc-loader v-if="invoicesLoading[invoice._id]" :class="{ '--load': invoicesLoading[invoice._id] }" size-css="13px" />
            <fa v-else :icon="['far', 'file']" class="icon-download" />
          </td>
        </tr>
      </tbody>
    </table>

    <button title="Ajouter une facture" class="btn_functional add-invoice" @click="createNewInvoice()">
      <fa icon="fa-solid fa-pencil" :width="10" />Ajouter une facture
    </button>

    <!-- MODAL -->
    <vmc-modal :is-open="openInvoiceModal" max-width="500px" @close="openInvoiceModal = false">
      <vehicle-invoice-input
        :selected-invoice="selectedInvoice"
        :vehicle-id="vehicle._id"
        @created="closeModalAndRefreshInvoices"
        @updated="closeModalAndRefreshInvoices"
        @deleted="closeModalAndRefreshInvoices"
        @cancel="openInvoiceModal = false"
      />
    </vmc-modal>
  </section>
</template>

<script setup lang="ts">
import { FileTypes } from '@/types/constants'

const props = defineProps({ vehicle: { type: Object as PropType<IOwnerVehicle>, required: true } })

// Init
const invoices = ref<IPopulatedVehicleInvoice[]>([])
const invoicesLoading = ref<Record<string, boolean>>({})
const selectedInvoice = ref<IVehicleInvoice | null>(null)
const openInvoiceModal = ref<boolean>(false)
let interventions: IIntervention[] = []

fetchAndPopulateInvoices()

// Get invoices
async function fetchAndPopulateInvoices() {
  const invoicesResponse = await useAPI().invoices.getAllVehicleInvoices(props.vehicle._id)
  if (!invoicesResponse.data || invoicesResponse.error) return

  if (!interventions.length) {
    const interventionsResponse = await useAPI().interventions.getInterventions()
    if (!interventionsResponse.data || interventionsResponse.error) return

    interventions = interventionsResponse.data
  }

  invoices.value = invoicesResponse.data.map((invoice) => ({
    ...invoice,
    interventions: invoice.interventionIds
      .map((id) => interventions.find((intervention) => intervention._id === id))
      .filter((intervention): intervention is NonNullable<IIntervention> => !!intervention)
  }))
}

async function downloadInvoice(invoiceId: string) {
  invoicesLoading.value[invoiceId] = true
  const downloadResponse = await useAPI().invoices.downloadInvoice(invoiceId)
  invoicesLoading.value[invoiceId] = false

  if (!downloadResponse.data || downloadResponse.error) return

  const link = document.createElement('a')

  // Get only base64
  const binaryBase64 = window.atob(downloadResponse.data.split(',')[1])

  // Past binary data in array
  const byteArray = new Uint8Array(binaryBase64.length)
  for (let i = 0; i < binaryBase64.length; i++) {
    byteArray[i] = binaryBase64.charCodeAt(i)
  }

  // Create a blob
  const blob = new Blob([byteArray], { type: FileTypes.JPEG })

  // Create URL
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = 'facture.jpeg'

  // Generate click event to download
  link.click()

  // clear memory
  URL.revokeObjectURL(url)
}

function createNewInvoice() {
  selectedInvoice.value = null
  openInvoiceModal.value = true
}

// Edit invoice
function editInvoice(invoice: IVehicleInvoice) {
  selectedInvoice.value = invoice
  openInvoiceModal.value = true
}

function closeModalAndRefreshInvoices() {
  openInvoiceModal.value = false
  fetchAndPopulateInvoices()
}
</script>

<style lang="scss" scoped>
.vehicle-invoices-table {
  width: 100%;
  font-family: $title-font;
  border-top: 1px solid $color-grey;
  margin: $spacing-4 0 $spacing-2 0;
  &__thead {
    &--tr-head {
      border-bottom: 1px solid $color-grey;
      th {
        font-size: $font-size-3;
        padding: $spacing-3 0;
      }
    }
  }
  &__tbody {
    &--tr-body {
      cursor: pointer;
      transition: 0.3s;
      z-index: -99;
      &:hover {
        background-color: rgb(221, 221, 221);
      }
      td {
        text-align: center;
        padding: 7px 0;
        vertical-align: middle;
        font-size: $font-size-2;
        p {
          padding: 2px 0;
        }
      }
    }
  }
  .download-invoice {
    &:hover .icon-download {
      transform: scale(1.17);
    }
    a {
      display: inline-block;
      width: 100%;
      height: max-content;
      color: $black;
      .loader {
        width: 15px;
      }
      .icon-download {
        cursor: pointer;
        transition: 0.3s;
        z-index: 999;
        padding: 1px 5px;
      }
    }
  }
}
</style>
