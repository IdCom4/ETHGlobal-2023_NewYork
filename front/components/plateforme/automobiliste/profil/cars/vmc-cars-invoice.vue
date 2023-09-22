<template>
  <div>
    <table class="car__invoices">
      <thead>
        <tr>
          <th>Date</th>
          <th>Kilométrage</th>
          <th>Traveaux réalisés</th>
          <th>Facture</th>
        </tr>
      </thead>
      <tbody v-if="invoices">
        <tr
          v-for="invoice in invoices"
          :key="invoice._id"
          class="invoice-line"
          title="Cliquez pour éditer ou supprimer"
          @click="editInvoice(invoice._id)"
        >
          <td>{{ invoice.issuedAt }}</td>
          <td>{{ invoice.mileage.toLocaleString() }} km</td>
          <td>
            <p v-for="(intervention, i) in invoice.interventions" :key="`intervention-${i}`">{{ intervention.label }}</p>
          </td>
          <td><fa v-if="invoice.hostedFileReferenceId" title="Télecharger" :icon="['far', 'file']" class="icon-download" /></td>
        </tr>
      </tbody>
    </table>

    <button class="btn_functional add-invoice" @click="openInvoiceModal = true">
      <fa icon="fa-solid fa-pencil" :width="10" />Ajouter une facture
    </button>

    <!-- MODAL -->
    <add-invoice
      :is-open-modal="openInvoiceModal"
      :is-editing="isEditing"
      :selected-invoice="selectedInvoice"
      :invoices="invoices"
      @close-modal="closeModal"
      @delete-invoice="deleteInvoice"
    />
  </div>
</template>

<script setup lang="ts">
import { vehicleInvoices } from '@/tests/mockups/data/vehicleInvoices.mockup'

// Init
const invoices = ref<IVehicleInvoice[]>([])
const selectedInvoice = ref<IVehicleInvoice | null>(null)
const isEditing = ref<boolean>(false)
const openInvoiceModal = ref<boolean>(false)

const props = defineProps({
  userId: {
    type: [String, Array],
    default: '0',
    required: true
  },
  index: {
    type: Number,
    default: 0,
    required: true
  },
  invoicesIds: {
    type: Array,
    default: () => [],
    required: true
  }
})

onMounted(() => {
  fetchInvoices()
})

// Get invoices
const fetchInvoices = async () => {
  /* get invoices from api */
  // const { data } = await useAPI().invoice.getInvoice()
  // if (!data) return
  // invoices.value = data.filter((invoice) => props.invoicesIds.includes(invoice._id))

  /* MOCK */
  invoices.value = vehicleInvoices.filter((invoice) => props.invoicesIds.includes(invoice._id))
}

// Edit invoice
const editInvoice = (invoiceId: string) => {
  // sendInvoice()
  selectedInvoice.value = invoices.value.find((invoice: IVehicleInvoice) => invoice._id === invoiceId) || null
  isEditing.value = true
  openInvoiceModal.value = true
}

// Delete invoice
const deleteInvoice = (invoiceToDelete: IVehicleInvoice) => {
  // sendInvoice()
  const index = invoices.value.findIndex((invoice) => invoice._id === invoiceToDelete._id)
  if (index !== -1) {
    invoices.value.splice(index, 1)
  }
}

// Close modal
const closeModal = (newInvoice: IVehicleInvoice) => {
  // sendInvoice()
  openInvoiceModal.value = false
  isEditing.value = false

  if (newInvoice) {
    const index = invoices.value.findIndex((invoice) => invoice._id === newInvoice._id)
    if (index !== -1) {
      invoices.value.splice(index, 1, newInvoice)
    } else {
      invoices.value.push(newInvoice)
    }
  }
}
</script>

<style lang="scss" scoped>
.car__invoices {
  width: 100%;
  font-family: $title-font;
  border-top: 1px solid $color-grey;
  margin: $spacing-4 0 $spacing-2 0;
}

.invoice-line {
  cursor: pointer;
  transition: 0.3s;
  z-index: -99;
  &:hover {
    background-color: rgb(221, 221, 221);
  }
}
thead tr:first-child {
  border-bottom: 1px solid $color-grey;
}

th {
  font-size: $font-size-3;
  padding: $spacing-3 0;
}

td {
  text-align: center;
  padding: $spacing-2 0;
  font-size: $font-size-2;
}
.icon-download {
  cursor: pointer;
  transition: 0.3s;
  z-index: 999;
  &:hover {
    transform: scale(1.1);
  }
}
</style>
