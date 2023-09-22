<template>
  <section class="quote-summary">
    <div class="toggle">
      <h4>ÊTES VOUS ASSUJETTI À LA TVA ?</h4>
      <vmc-input v-model="hasTVA" type="toggle" />
    </div>

    <ul class="product-summary item-summary">
      <li>
        <p class="largest">Main d'oeuvre</p>
        <p class="largest">{{ useEuroUnit(workForceSum) }}</p>
      </li>
      <li>
        <p class="largest">Pièces et Produits</p>
        <p class="largest">{{ useEuroUnit(consumableSum) }}</p>
      </li>
      <li>
        <p class="largest">Location de lieu et de matériels</p>
        <p class="largest">{{ useEuroUnit(rentalSum) }}</p>
      </li>
      <li class="total-ttc">
        <p class="largest">Total HT</p>
        <p class="largest">{{ useEuroUnit(totalHT) }}</p>
      </li>
    </ul>

    <ul class="price-summary item-summary">
      <li class="tva-rate">
        <p class="largest">TVA ( {{ tvaRate * 100 }} %)</p>
        <p class="largest">{{ useEuroUnit(totalHT * tvaRate) }}</p>
      </li>
      <li>
        <p class="largest">TOTAL TTC à payer par le client</p>
        <p class="largest">{{ useEuroUnit(totalTTC) }}</p>
      </li>
      <li>
        <p class="largest">Frais de service ValueMyCarTTC</p>
        <p class="largest">{{ useEuroUnit(vmcFees) }}</p>
      </li>
      <li>
        <p class="largest">Vous recevrez (TTC)</p>
        <p class="largest">{{ useEuroUnit(totalTTC - vmcFees) }}</p>
      </li>
    </ul>

    <button class="btn_call-to-action" :class="{ '--load': isQuoteUpdateLoading }" @click="emit('submitQuote')">Envoyer</button>
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits(['submitQuote', 'update:tvaRate'])

const props = defineProps({
  workforces: {
    type: Array as PropType<IMissionQuoteProduct[]>,
    default: () => []
  },
  consumables: {
    type: Array as PropType<IMissionQuoteProduct[]>,
    default: () => []
  },
  rental: {
    type: Array as PropType<IMissionQuoteProduct[]>,
    default: () => []
  },
  tvaRate: {
    type: Number,
    default: 0.2
  },
  vmcFeesRate: {
    type: Number,
    default: 0.2
  },
  isQuoteUpdateLoading: {
    type: Boolean,
    default: false
  }
})

const hasTVA = ref<boolean>(props.tvaRate > 0)
const isQuoteUpdateLoading = toRef(props, 'isQuoteUpdateLoading')

const workForceSum = computed<number>(() => props.workforces.reduce(reduceSummarize, 0))
const consumableSum = computed<number>(() => props.consumables.reduce(reduceSummarize, 0))
const rentalSum = computed<number>(() => props.rental.reduce(reduceSummarize, 0))
const tvaRate = computed<number>(() => (hasTVA.value ? 0.2 : 0))
const totalHT = computed<number>(() => workForceSum.value + consumableSum.value + rentalSum.value)
const totalTTC = computed<number>(() => totalHT.value * (1 + tvaRate.value))
const vmcFees = computed<number>(() => totalTTC.value * props.vmcFeesRate)

watch(
  () => props.tvaRate,
  () => {
    hasTVA.value = props.tvaRate > 0
  }
)

watch(tvaRate, () => {
  emit('update:tvaRate', tvaRate.value)
})

function reduceSummarize(accumulator: number, product: IMissionQuoteProduct) {
  return accumulator + product.quantity * product.unitPriceHT
}
</script>

<style lang="scss" scoped>
.quote-summary {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-bottom: 40px;
  .toggle {
    h4 {
      text-transform: uppercase;
      font-weight: 700;
    }
    :nth-child(2) {
      width: 120px;
    }
  }

  > button {
    width: 100%;
  }
}

.item-summary {
  display: flex;
  flex-direction: column;
  gap: 20px;

  > li {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
}

.product-summary {
  background-color: #ebebeb;
  padding: 10px;

  .total-ttc {
    margin-top: 20px;
  }
}

.price-summary {
  .tva-rate p {
    font-weight: 700;
  }

  > li {
    padding: 10px;

    &:nth-child(2n) {
      background-color: $color-dark-blue;
      color: $white;

      p:nth-last-child(1) {
        color: $color-neon-blue;
      }
    }
  }
}
</style>
