import { DaysOfWeek } from '@/common/enums/time'
import { IllegalArgumentException } from '@/common/exceptions/illegal-argument.exception'
import { Center, WeekOpeningHours } from '@/schemas/center'
import { StrictAddress, TimeRange } from '@/schemas/common/pojos'

describe('When testing Center schema', () => {
  describe('When instantiating', () => {
    const validParameters = {
      name: 'My Cool Center',
      location: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0] as [number, number]),
    }
    const invalidParameters = { ...validParameters, name: '' }

    test.each([
      {
        name: 'With valid parameters',
        givenValue: validParameters,
        expectedOutput: { error: null, ...validParameters },
      },
      {
        name: 'With invalid parameters',
        givenValue: invalidParameters,
        expectedOutput: { error: IllegalArgumentException, ...invalidParameters },
      },
    ])('$name', ({ givenValue, expectedOutput }) => {
      const getter = (): Center => Center.of(givenValue.name, givenValue.location)

      if (expectedOutput.error) expect(getter).toThrowError(expectedOutput.error)
      else {
        const center = getter()

        expect(center).toBeDefined()
        expect(center.name).toEqual(expectedOutput.name)
        expect(center.location).toEqual(expectedOutput.location)
        expect(center.openingHours).toEqual(WeekOpeningHours.createEmpty())
        expect(center.deletedAt).toBeFalsy()
      }
    })
  })

  describe('When updating', () => {
    const defaultParameters = {
      name: 'My Cool Center',
      location: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0] as [number, number]),
      openingHours: WeekOpeningHours.createEmpty(),
    }

    const validParameters = {
      name: 'My New Cool Name',
      location: StrictAddress.of('1 chemin des Fougères', 'Thuré', '86540', [0, 0] as [number, number]),
      openingHours: WeekOpeningHours.createEmpty().setDaysOfWeekOpeningHours({ [DaysOfWeek.FRIDAY]: TimeRange.of('08:00', '19:30') }),
    }

    test.each([
      { name: 'With all valid parameters', givenValue: validParameters, expectedOutput: validParameters },
      {
        name: 'With all valid parameters & deleted as extra',
        givenValue: { ...validParameters, deleted: new Date() },
        expectedOutput: validParameters,
      },
      {
        name: 'With only name',
        givenValue: { name: validParameters.name },
        expectedOutput: { ...defaultParameters, name: validParameters.name },
      },
      {
        name: 'With only location',
        givenValue: { location: validParameters.location },
        expectedOutput: { ...defaultParameters, location: validParameters.location },
      },
      {
        name: 'With only openingHours',
        givenValue: { openingHours: validParameters.openingHours },
        expectedOutput: { ...defaultParameters, openingHours: validParameters.openingHours },
      },
      {
        name: 'With only deleted',
        givenValue: { deleted: new Date() },
        expectedOutput: defaultParameters,
      },
    ])('$name', ({ givenValue, expectedOutput }) => {
      const center = Center.of(defaultParameters.name, defaultParameters.location)

      center.update({ name: givenValue.name, location: givenValue.location, openingHours: givenValue.openingHours })

      expect(center.name).toEqual(expectedOutput.name)
      expect(center.location).toEqual(expectedOutput.location)
      expect(center.openingHours).toEqual(expectedOutput.openingHours)
      expect(center.deletedAt).toBeFalsy()
    })
  })

  test('When deleting', () => {
    const defaultParameters = {
      name: 'My Cool Center',
      location: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0] as [number, number]),
      openingHours: WeekOpeningHours.createEmpty(),
    }

    const center = Center.of(defaultParameters.name, defaultParameters.location)

    expect(center.deletedAt).toBeFalsy()
    center.softDelete()
    expect(center.deletedAt).toBeTruthy()
  })
})
