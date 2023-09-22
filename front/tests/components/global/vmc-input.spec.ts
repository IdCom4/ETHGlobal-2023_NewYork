import { describe, it, beforeEach, expect, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import VmcInputClient from '@/components/global/vmc-input/vmc-input.client.vue'
import VmcInputDropdownClient from '@/components/global/vmc-input/vmc-input-dropdown.client.vue'
import { InputTypes, KeyNames, SelectOptionStates } from '@/types/constants'
import * as useGeocoderExport from '@/composables/useGeocoder'
import { mabpboxFeatureMock } from '@/tests/mockups/data/mapboxFeature.mockup'
import { MapboxFeature } from '@/assets/ts/classes/external-apis/geocoder'
import '@/types/constants/browser-events.d.ts'

Object.values(InputTypes).forEach((type) => {
  describe(`When using the VMC-input Component with input type ${type}`, () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.spyOn(useGeocoderExport, 'useGeocoder').mockReturnValue({
        getAddressSuggestionsFromGeocoderAPI: async () => {
          return new Promise((resolve) => resolve(mabpboxFeatureMock.map((feature) => new MapboxFeature(feature))))
        }
      })

      wrapper = mount(VmcInputClient, {
        attachTo: document.body,
        global: {
          components: {
            VmcInputDropdown: VmcInputDropdownClient
          },
          stubs: {
            Fa: true
          }
        },
        props: {
          type // Set the input type for each test iterations
        }
      })
    })

    it('should exists', async () => {
      expect(wrapper.exists()).toBe(true)
    })

    it(`should set the input type ${type}`, async () => {
      if (type !== InputTypes.TEXTAREA && type !== InputTypes.TOGGLE) {
        expect(wrapper.find('input').element.getAttribute('type')).toBe(`${type}`)
      } else if (type === InputTypes.TEXTAREA) {
        const textareaClass = wrapper.find('.editable-text-container')
        expect(textareaClass.exists()).toBe(true)
      } else if (type === InputTypes.TOGGLE) {
        const toggleWrapper = wrapper.find('label')
        expect(toggleWrapper.exists()).toBe(true)
        const toggleInput = toggleWrapper.find('input[type="checkbox"]')
        expect(toggleInput.exists()).toBe(true)
        const toggleId = toggleInput.attributes('id')
        expect(toggleId).toMatch(/^vmc-input_id-.+_toggle$/)
        const yesText = toggleWrapper.find('.text--yes')
        expect(yesText.exists()).toBe(true)
        expect(yesText.text()).toBe('Oui')

        const noText = toggleWrapper.find('.text--no')
        expect(noText.exists()).toBe(true)
        expect(noText.text()).toBe('Non')
      }
    })

    it('should display the label', async () => {
      const label = 'Adresse'
      await wrapper.setProps({ label })
      if (type !== InputTypes.TOGGLE) {
        expect(wrapper.find('label').text()).toBe(label)
      }
    })

    it('should display the error message', async () => {
      const error = 'Ceci est une erreur'
      wrapper.setProps({ error })
      await wrapper.setProps({ error })
      expect(wrapper.text()).toContain(error)
    })

    it('should set the input required attributes', async () => {
      const required = true
      await wrapper.setProps({ required })
      if (type !== InputTypes.TEXTAREA && type !== InputTypes.TOGGLE) {
        expect(wrapper.find('input').element.hasAttribute('required')).toBe(true)
      }
    })

    it('should set the input disabled attributes', async () => {
      const disabled = true
      await wrapper.setProps({ disabled })
      if (type !== InputTypes.TEXTAREA && type !== InputTypes.TOGGLE) {
        expect(wrapper.find('input').element.hasAttribute('disabled')).toBe(true)
      } else if (type === InputTypes.TEXTAREA) {
        const disabledSpan = wrapper.find('span.disabled')
        expect(disabledSpan.exists()).toBe(true)
        const label = wrapper.find('label')
        expect(label.classes()).toContain('disabled')
      } else if (type === InputTypes.TOGGLE) {
        const disabledLabel = wrapper.find('label.disabled')
        expect(disabledLabel.exists()).toBe(true)
      }
    })

    it('should display the modal-input-wrapper div when modal-style prop is enabled', async () => {
      const modalStyle = true
      await wrapper.setProps({ modalStyle })
      if (type !== InputTypes.TOGGLE) {
        expect(wrapper.find('.modal-input-wrapper').exists()).toBe(true)
      }
    })

    it('should display the input-wrapper div when modal-style prop is disabled', async () => {
      const modalStyle = false
      await wrapper.setProps({ modalStyle })
      if (type !== InputTypes.TEXTAREA && type !== InputTypes.TOGGLE) {
        expect(wrapper.find('.input-wrapper').exists()).toBe(true)
      }
    })

    it('should set the input value', async () => {
      const input = wrapper.find('input')
      let inputValue: string | boolean | Date = ''
      if (type === InputTypes.NUMBER) {
        inputValue = '5'
      } else if (type === InputTypes.TEXT || type === InputTypes.EMAIL || type === InputTypes.PASSWORD || type === InputTypes.URL) {
        inputValue = 'Some text'
      } else if (type === InputTypes.CHECKBOX || type === InputTypes.TOGGLE) {
        inputValue = true
      } else if (type === InputTypes.TEL) {
        inputValue = '+33600000000'
      } else if (type === InputTypes.DATE) {
        inputValue = '07/07/2023'
      } else if (type === InputTypes.TIME) {
        inputValue = '09:00:00'
      }
      if (type === InputTypes.TEXTAREA) {
        return
      }

      await input.setValue(inputValue)

      if (type === InputTypes.CHECKBOX || type === InputTypes.TOGGLE) {
        expect(input.element.checked).toBe(inputValue)
      } else if (type === InputTypes.DATE) {
        return
      } else {
        expect(input.element.value).toBe(inputValue)
      }
    })

    it('should display the unit span and have the input-unit class when unit prop is provided', async () => {
      const unit = 'km'
      await wrapper.setProps({ unit })

      if (type !== InputTypes.TEXTAREA && type !== InputTypes.TOGGLE && type !== InputTypes.CHECKBOX) {
        const unitSpan = wrapper.find(`.${type}-unit`)
        expect(unitSpan.exists()).toBe(true)
        expect(unitSpan.text()).toBe(unit)

        const input = wrapper.find('input')
        expect(input.classes()).toContain('input-unit')
      }
    })

    it('should display the icon div and have the icon-input class when icon prop is provided', async () => {
      const icon = 'fa-solid fa-chevron-down'
      await wrapper.setProps({ icon })

      if (
        type !== InputTypes.TEXTAREA &&
        type !== InputTypes.TOGGLE &&
        type !== InputTypes.DATE &&
        type !== InputTypes.TIME &&
        type !== InputTypes.SELECT
      ) {
        const input = wrapper.find('input')
        expect(input.classes()).toContain('icon-input')
      }
    })

    if (`${type}` === 'number') {
      it('should set the step attribute', async () => {
        const step = 2
        await wrapper.setProps({ step })

        expect(wrapper.find('input').element.getAttribute('step')).toBe(`${step}`)

        const input = wrapper.find('input')
        const startValue = 10
        await input.setValue(startValue)
        const incrementEvent = new Event('input')
        input.element.stepUp()
        input.element.dispatchEvent(incrementEvent)
        await wrapper.vm.$nextTick()

        expect(parseFloat(input.element.value)).toBe(startValue + step)
      })

      it('should set the min attribute', async () => {
        const min = 2
        await wrapper.setProps({ min })

        expect(wrapper.find('input').element.getAttribute('min')).toBe(`${min}`)

        const input = wrapper.find('input')
        const inputValue = 0
        await input.setValue(inputValue)
        await wrapper.find('.vmc-input-wrapper').trigger('focusout')
        await wrapper.vm.$nextTick()

        expect(parseFloat(input.element.value)).toBe(min)
      })

      it('should set the max attribute', async () => {
        const max = 2
        await wrapper.setProps({ max })

        expect(wrapper.find('input').element.getAttribute('max')).toBe(`${max}`)

        const input = wrapper.find('input')
        const inputValue = 4
        await input.setValue(inputValue)
        await wrapper.find('.vmc-input-wrapper').trigger('focusout')
        await wrapper.vm.$nextTick()

        expect(parseFloat(input.element.value)).toBe(max)
      })
    }
    if (`${type}` === 'time') {
      it('should set the min attribute', async () => {
        const min = '08:00:00'

        await wrapper.setProps({ min })
        const minAttributeValue = wrapper.find('input').element.getAttribute('min')
        expect(minAttributeValue).toBe(`${min}`)

        const current = '05:00:00'
        const input = wrapper.find('input')
        const inputValue = current

        await input.setValue(inputValue)

        await wrapper.find('.vmc-input-wrapper').trigger('focusout')
        await wrapper.vm.$nextTick()
        expect(input.element.value).toBe(minAttributeValue)
      })

      it('should set the min attribute on enter keydown', async () => {
        const min = '08:00:00'

        await wrapper.setProps({ min })
        const minAttributeValue = wrapper.find('input').element.getAttribute('min')
        expect(minAttributeValue).toBe(`${min}`)

        const current = '05:00:00'
        const input = wrapper.find('input')
        const inputValue = current

        await input.setValue(inputValue)

        // Uncomment the trigger call, it should be there
        await wrapper.trigger('keydown', { key: KeyNames.ENTER })
        await wrapper.vm.$nextTick()
        expect(input.element.value).toBe(minAttributeValue)
      })

      it('should set the max attribute', async () => {
        const max = '18:00:00'

        await wrapper.setProps({ max })
        const maxAttributeValue = wrapper.find('input').element.getAttribute('max')
        expect(maxAttributeValue).toBe(`${max}`)

        const current = '20:00:00'
        const input = wrapper.find('input')
        const inputValue = current

        await input.setValue(inputValue)
        await wrapper.find('.vmc-input-wrapper').trigger('focusout')
        await wrapper.vm.$nextTick()

        expect(input.element.value).toBe(maxAttributeValue)
      })

      it('should set the step attribute', async () => {
        const step = '60'

        await wrapper.setProps({ step })
        const stepAttribute = wrapper.find('input').element.getAttribute('step')
        expect(stepAttribute).toBe(step)
      })
    }

    if (`${type}` === 'date') {
      it('should set the value on blur event', async () => {
        const input = wrapper.find('input')

        const inputValue = '01/01/2023'
        const inputValueFormatted = useUtils().dates.formatStrDate(inputValue.toString(), 'dd/MM/yyyy', 'yyyy-MM-dd')
        await input.setValue(inputValueFormatted)
        await input.trigger('blur')
        await wrapper.vm.$nextTick()

        const outputValue = useUtils().dates.formatStrDate(input.element.value, 'yyyy-MM-dd', 'dd/MM/yyyy')
        expect(outputValue).toBe(inputValue)
      })

      it('should set the value on press Enter key', async () => {
        const input = wrapper.find('input')

        const inputValue = '01/01/2023'
        const inputValueFormatted = useUtils().dates.formatStrDate(inputValue.toString(), 'dd/MM/yyyy', 'yyyy-MM-dd')
        await input.setValue(inputValueFormatted)
        await wrapper.trigger('keydown', { key: KeyNames.ENTER })
        await wrapper.vm.$nextTick()

        const outputValue = useUtils().dates.formatStrDate(input.element.value, 'yyyy-MM-dd', 'dd/MM/yyyy')
        expect(outputValue).toBe(inputValue)
      })

      it('should set the min attribute', async () => {
        const min = '01/01/1970'

        await wrapper.setProps({ min })
        const minAttributeValue = wrapper.find('input').element.getAttribute('min')
        expect(minAttributeValue).toBe(`${useUtils().dates.formatStrDate(min, 'dd/MM/yyyy', 'yyyy-MM-dd')}`)

        const current = '07/07/1900'
        const input = wrapper.find('input')
        const inputValue = useUtils().dates.formatStrDate(current, 'dd/MM/yyyy', 'yyyy-MM-dd')

        await input.setValue(inputValue)
        await wrapper.find('.vmc-input-wrapper').trigger('focusout')
        await wrapper.vm.$nextTick()

        expect(input.element.value).toBe(minAttributeValue)
      })

      it('should set the max attribute', async () => {
        const max = '31/12/2030'

        await wrapper.setProps({ max })
        const maxAttributeValue = wrapper.find('input').element.getAttribute('max')
        expect(maxAttributeValue).toBe(`${useUtils().dates.formatStrDate(max, 'dd/MM/yyyy', 'yyyy-MM-dd')}`)

        const current = '01/01/2040'
        const input = wrapper.find('input')
        const inputValue = useUtils().dates.formatStrDate(current, 'dd/MM/yyyy', 'yyyy-MM-dd')

        await input.setValue(inputValue)

        await wrapper.find('.vmc-input-wrapper').trigger('focusout')
        await wrapper.vm.$nextTick()

        expect(input.element.value).toBe(maxAttributeValue)
      })
    }

    if (type === InputTypes.CHECKBOX) {
      it('should display the slot content', () => {
        const slotContent = 'Custom slot content'
        wrapper = mount(VmcInputClient, {
          slots: {
            default: slotContent
          }
        })

        // Check if the slot content is present in the component
        expect(wrapper.text()).toContain(slotContent)
      })
    }

    if (type === InputTypes.TEXTAREA) {
      it('should set the input value', async () => {
        // Simulate user typing into the input field
        const textarea = wrapper.find('span[role="textbox"]')
        const inputValue = 'Some text'
        textarea.element.textContent = inputValue
        await wrapper.trigger('input')

        expect(textarea.element.textContent).toBe(inputValue)
      })
    }

    if (type === InputTypes.SELECT) {
      const selectOptions: IInputSelectOptions<string>[] = [
        {
          value: 'coucou',
          display: 'coucou',
          state: SelectOptionStates.DISABLED
        },
        {
          value: 'tout',
          display: 'tout',
          state: SelectOptionStates.SELECTED
        },
        {
          value: 'le',
          display: 'le'
        },
        {
          value: 'monde',
          display: 'monde'
        }
      ]

      it('should open dropdown when icon is clicked', async () => {
        await wrapper.setProps({ selectOptions })

        const icon = wrapper.find('.icon-select')

        icon.trigger('click')

        await wrapper.vm.$nextTick()

        const dropdown = wrapper.find('.vmc-input-dropdown')
        expect(dropdown.exists()).toBe(true)
      })

      it('should select the first option when clicked and set the value', async () => {
        const input = wrapper.find('input')

        await wrapper.setProps({ selectOptions })

        const icon = wrapper.find('.icon-select')
        icon.trigger('click')

        await wrapper.vm.$nextTick()

        const options = wrapper.findAll('.vmc-input-dropdown li')
        options[2].trigger('click')
        await wrapper.vm.$nextTick()
        expect(input.element.value).toBe(selectOptions[2].value)
      })

      it('should navigate through options with arrow keys and select an option with enter', async () => {
        const input = wrapper.find('input')
        await wrapper.setProps({ selectOptions })

        const icon = wrapper.find('.icon-select')
        icon.trigger('click')
        await wrapper.vm.$nextTick()

        // verify dropdown has open
        expect(wrapper.find('.vmc-input-dropdown').exists()).toBe(true)
        const vmcInputDropdownElement = wrapper.findComponent(VmcInputDropdownClient)

        await vmcInputDropdownElement.trigger('keydown', { key: KeyNames.ENTER })
        await vmcInputDropdownElement.trigger('keydown', { key: KeyNames.ARROW_DOWN })
        await vmcInputDropdownElement.trigger('keydown', { key: KeyNames.ARROW_DOWN })
        await vmcInputDropdownElement.trigger('keydown', { key: KeyNames.ENTER })
        await wrapper.vm.$nextTick()

        expect(input.element.value).toBe(selectOptions[2].value)
      })
      it('should navigate through options with arrow keys at length + 1', async () => {
        const input = wrapper.find('input')
        await wrapper.setProps({ selectOptions })

        const icon = wrapper.find('.icon-select')
        icon.trigger('click')
        await wrapper.vm.$nextTick()

        // verify dropdown has open
        expect(wrapper.find('.vmc-input-dropdown').exists()).toBe(true)
        const vmcInputDropdownElement = wrapper.findComponent(VmcInputDropdownClient)

        const optionSelectedByDefault = selectOptions.find((option) => option.state === 'selected') || selectOptions[0]

        expect(input.element.value).toBe(optionSelectedByDefault.value)

        await vmcInputDropdownElement.trigger('keydown', { key: KeyNames.ENTER })
        await vmcInputDropdownElement.trigger('keydown', { key: KeyNames.ARROW_DOWN })
        await vmcInputDropdownElement.trigger('keydown', { key: KeyNames.ARROW_DOWN })
        await vmcInputDropdownElement.trigger('keydown', { key: KeyNames.ARROW_DOWN })
        await vmcInputDropdownElement.trigger('keydown', { key: KeyNames.ARROW_DOWN })
        await vmcInputDropdownElement.trigger('keydown', { key: KeyNames.ENTER })
        await wrapper.vm.$nextTick()

        expect(input.element.value).toBe(selectOptions[1].value)

        await wrapper.setProps({ selectOptions })

        icon.trigger('click')
        await wrapper.vm.$nextTick()

        // verify dropdown has open
        expect(wrapper.find('.vmc-input-dropdown').exists()).toBe(true)

        await vmcInputDropdownElement.trigger('keydown', { key: KeyNames.ARROW_UP })
        await vmcInputDropdownElement.trigger('keydown', { key: KeyNames.ARROW_UP })
        await vmcInputDropdownElement.trigger('keydown', { key: KeyNames.ARROW_UP })
        await vmcInputDropdownElement.trigger('keydown', { key: KeyNames.ARROW_UP })
        await vmcInputDropdownElement.trigger('keydown', { key: KeyNames.ENTER })
        await wrapper.vm.$nextTick()

        expect(input.element.value).toBe(selectOptions[3].value)
      })
    }
  })
})
