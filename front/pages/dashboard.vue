<template>
  <section id="dashboard-page">
    <h2>Dashboard</h2>
    <div class="inputs">
      <eth-input
        v-model="sourceType"
        type="select"
        label="Data source"
        :select-options="[
          { display: 'Select your data source', value: null, state: SelectOptionStates.DISABLED },
          ...Object.keys(formTree.sourceTypes).map((value) => ({ display: value.toLowerCase(), value }))
        ]"
        modal-style
        theme="dark"
        background-color="#555555"
        :disabled="!!datas"
      />

      <eth-input
        v-model="sourceDataType"
        type="select"
        label="Data type"
        :select-options="[{ display: 'Select your data type', value: null, state: SelectOptionStates.DISABLED }, ...availableDataType]"
        modal-style
        theme="dark"
        background-color="#555555"
        :disabled="!!datas"
      />

      <div v-if="sourceType && sourceDataType" class="additional">
        <eth-input
          v-for="additionalValue of requiredAdditionalValues"
          :key="`values-${additionalValue.label}`"
          v-model="additionalValue.value"
          type="text"
          :placeholder="additionalValue.label"
          :label="additionalValue.label"
          modal-style
          theme="dark"
          background-color="#555555"
          :disabled="!!datas"
        />
      </div>

      <button class="btn_call-to-action --inverted" :class="{ btn_disabled: !allAdditionalValueAreFilled() }" @click="search">Search</button>
      <p style="cursor: pointer; text-decoration: underline;" @click="clearInputs">Clear research</p>
    </div>

    <div v-if="sourceType && sourceDataType && datas !== null && datas !== undefined" class="data-wrapper">
      <h2>{{ requiredAdditionalValues[0].value }}</h2>

      <div v-if="DataTypes[sourceDataType] === `${DataTypes.APP_CONTRIBUTIONS}`" class="data">
        <div
          v-for="(assetId, index) of Object.keys(datas as Record<TAssetId, Record<TContributorEntry, TProportion>>)"
          :key="`data-${index}`"
          class="data-display"
        >
          <h4 class="title">{{ assetId }}</h4>
          <doughnut-chart class="graph" :chart-data="graphData[assetId]" />
        </div>
      </div>

      <div v-if="DataTypes[sourceDataType] === `${DataTypes.CONTRIBUTOR_CONTRIBUTIONS}`" class="data">
        <table>
          <tr>
            <th>Asset ID</th>
            <th>Contributor Entry</th>
          </tr>
          <tr v-for="(contribution, index) of (graphData as Record<string, string>[])" :key="`data-prop-${index}`">
            <td>{{ Object.keys(contribution)[0] }}</td>
            <td>{{ Object.values(contribution)[0] }}</td>
          </tr>
        </table>
      </div>

      <div v-if="DataTypes[sourceDataType] === `${DataTypes.CONTRIBUTOR_APP_CONTRIBUTIONS}`" class="data">
        <table>
          <tr>
            <th>Asset ID</th>
            <th>Contributor Entry</th>
          </tr>
          <tr v-for="(contribution, index) of (graphData as Record<string, string>[])" :key="`data-prop-${index}`">
            <td>{{ Object.keys(contribution)[0] }}</td>
            <td>{{ Object.values(contribution)[0] }}</td>
          </tr>
        </table>
      </div>

      <div v-if="DataTypes[sourceDataType] === `${DataTypes.CONTRIBUTOR_APP_REPUTATION}`" class="data">
        <p>Reputation:</p>
        <h3 style="width: 100%;">{{ graphData }}</h3>
      </div>

      <div v-if="DataTypes[sourceDataType] === `${DataTypes.APP_CONTRIBUTORS_REPUTATION}`" class="data">
        <table>
          <tr>
            <th>Contributor Address</th>
            <th>Contributor Reputation</th>
          </tr>
          <tr v-for="([address, reputation], index) of Object.entries(graphData as Record<string, number>)" :key="`data-prop-${index}`">
            <td>{{ address }}</td>
            <td>{{ reputation }}</td>
          </tr>
        </table>
      </div>

      <div v-if="DataTypes[sourceDataType] === `${DataTypes.ASSET_CONTRIBUTIONS}`" class="data">
        <div class="data-display --solo">
          <h4 class="title">{{ requiredAdditionalValues[0].value }}</h4>
          <doughnut-chart class="graph" :chart-data="graphData" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { SelectOptionStates, Wisdom } from '@/assets/ts'
import { DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { GraphHelper } from '@/assets/ts/classes/graph.class'

Chart.register(...registerables)

enum DataTypes {
  CONTRIBUTOR_CONTRIBUTIONS = 'CONTRIBUTOR_CONTRIBUTIONS',
  CONTRIBUTOR_APP_CONTRIBUTIONS = 'CONTRIBUTOR_APP_CONTRIBUTIONS',
  CONTRIBUTOR_APP_REPUTATION = 'CONTRIBUTOR_APP_REPUTATION',
  ASSET_CONTRIBUTIONS = 'ASSET_CONTRIBUTIONS',
  APP_CONTRIBUTIONS = 'APP_CONTRIBUTIONS',
  APP_CONTRIBUTORS_REPUTATION = 'APP_CONTRIBUTORS_REPUTATION'
}

const formTree = ref({
  sourceTypes: {
    CONTRIBUTOR: {
      dataTypes: {
        CONTRIBUTOR_CONTRIBUTIONS: {
          label: 'Contributor entries',
          additionalValues: [{ label: "Contributor's address", value: '' }],
          searchMethod: Wisdom.fetchContributorContributions,
          graphMethod: (value: unknown) => value
        },
        CONTRIBUTOR_APP_CONTRIBUTIONS: {
          label: 'Contributor entries by App',
          additionalValues: [
            { label: "Contributor's address", value: '' },
            { label: 'App address', value: '' }
          ],
          searchMethod: Wisdom.fetchContributorAppContributions,
          graphMethod: (value: unknown) => value
        },
        CONTRIBUTOR_APP_REPUTATION: {
          label: 'Contributor App reputation',
          additionalValues: [
            { label: "Contributor's address", value: '' },
            { label: 'App address', value: '' }
          ],
          searchMethod: Wisdom.fetchContributorAppReputation,
          graphMethod: (value: unknown) => value
        }
      }
    },
    APP: {
      dataTypes: {
        APP_CONTRIBUTIONS: {
          label: 'App entries',
          additionalValues: [{ label: 'App address', value: '' }],
          searchMethod: Wisdom.fetchAppContributions,
          graphMethod: GraphHelper.fromAppContributions
        },
        APP_CONTRIBUTORS_REPUTATION: {
          label: "All app contributors's reputation",
          additionalValues: [{ label: 'App address', value: '' }],
          searchMethod: Wisdom.fetchAppContributorsReputation,
          graphMethod: (value: unknown) => value
        }
      }
    },
    ASSET: {
      dataTypes: {
        ASSET_CONTRIBUTIONS: {
          label: 'Asset entries',
          additionalValues: [{ label: 'Asset ID', value: '' }],
          searchMethod: Wisdom.fetchAssetContributions,
          graphMethod: (value: Record<TContributorEntry, TProportion>) => GraphHelper.fromAssetContributions(value)
        }
      }
    }
  }
})

const sourceType = ref<string | null>(null)
const sourceDataType = ref<DataTypes | null>(null)

const availableDataType = computed<IInputSelectOptions[]>(() => {
  if (!sourceType.value) return []
  // @ts-ignore
  return Object.entries(formTree.value.sourceTypes[sourceType.value].dataTypes).map(([key, value]) => ({
    // @ts-ignore
    display: value.label as string,
    // @ts-ignore
    value: key as string
  }))
})

const requiredAdditionalValues = computed(() => {
  if (!sourceType.value || !sourceDataType.value) return []
  // @ts-ignore
  return formTree.value.sourceTypes[sourceType.value].dataTypes[sourceDataType.value].additionalValues
})

const datas = ref<unknown>()

const graphData = computed(() => {
  if (!sourceType.value || !sourceDataType.value || datas.value === null || datas.value === undefined) return {}

  // @ts-ignore
  const tmp = formTree.value.sourceTypes[sourceType.value].dataTypes[sourceDataType.value].graphMethod(datas.value)
  return tmp
})

function allAdditionalValueAreFilled() {
  // @ts-ignore
  return requiredAdditionalValues.value.length && !requiredAdditionalValues.value.some((additional) => !additional.value)
}

async function search() {
  if (!sourceType.value || !sourceDataType.value) return

  // @ts-ignore
  const data = await formTree.value.sourceTypes[sourceType.value].dataTypes[sourceDataType.value].searchMethod.apply(
    null,
    // @ts-ignore
    requiredAdditionalValues.value.map((required) => required.value)
  )

  datas.value = data
}

function clearInputs() {
  if (sourceType.value) {
    // @ts-ignore
    formTree.value.sourceTypes[sourceType.value].dataTypes[sourceDataType.value].additionalValues.forEach((val) => (val.value = ''))
  }
  sourceType.value = null
  sourceDataType.value = null
}

watch([sourceType, sourceDataType, formTree], () => {
  if (datas.value) datas.value = null
})
</script>

<style lang="scss" scoped>
#dashboard-page {
  background-color: #555555;
  min-height: calc(100vh - 60px);
  padding: 100px;

  .inputs {
    margin-top: $spacing-4;
    display: flex;
    gap: $spacing-2;
    align-items: center;

    .eth-input {
      margin: 0;

      &::deep(.modal-label) {
        background-color: #555555 !important;
      }
    }

    .additional {
      display: flex;
      gap: $spacing-2;
    }

    button.btn_disabled {
      color: gray !important;
    }
  }

  .data-wrapper {
    margin-top: $spacing-5;

    .data {
      margin-top: $spacing-4;
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-3;

      .data-display {
        padding: $spacing-3;
        border-radius: 10px;
        width: calc(100% / 4 - $spacing-3);
        background-color: #999999;
        box-shadow: 5px 5px 6px rgba(0, 0, 0, 0.5);
        transition: 0.2s;
        .title {
          width: 100%;
        }
        .graph {
          margin-top: $spacing-2;
          width: 100%;
        }

        &.--solo {
          width: 100%;
        }

        &:hover {
          cursor: pointer;
          transform: translateY(-10px);
        }
      }

      table {
        width: 100%;
        tr {
          background-color: #333333;

          &:nth-child(2) {
            background-color: #353535;
          }

          & + tr {
            border-top: solid 1px black;
          }

          th,
          td {
            padding: 3px 5px;
            border-right: solid 1px black;
            border-left: solid 1px black;

            &:first-child {
              border-left: none;
            }

            &:last-child {
              border-right: none;
            }
          }
          th {
            font-family: 'Nunito';
            text-transform: uppercase;
            border-bottom: solid 1px black;
            background-color: #444444;

            &:nth-child(2) {
              background-color: #666666;
            }
          }
          td {
            font-family: 'Montserrat';
            font-size: 12px;
          }

          .inner-data {
            width: 100%;
            display: flex;
            flex-direction: column;

            .--head {
              display: flex;
              width: 100%;

              & > * {
                width: 100%;
                text-align: center;
                font-weight: bold;
                background-color: #777777;
                padding: 5px 0;
              }
            }

            .--content {
              width: 100%;
              display: flex;

              & + .--content {
                border-top: solid 1px gray;
              }
              & > * {
                width: 100%;
                padding: 5px;

                border-right: solid 1px grey;
                border-left: solid 1px grey;

                &:first-child {
                  border-left: none;
                }

                &:last-child {
                  border-right: none;
                }
              }
            }
          }
        }
      }
    }
  }

  * {
    color: white;
  }
}
</style>
