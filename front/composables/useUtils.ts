import DatesUtils from './resources/utils-functions/dates'
import FilesUtils from './resources/utils-functions/files'
import ObjectsUtils from './resources/utils-functions/objects'
import TimesUtils from './resources/utils-functions/times'
import TypesUtils from './resources/utils-functions/types'
import UsersUtils from './resources/utils-functions/users'
import MathUtils from './resources/utils-functions/math'
import UUIDUtils from './resources/utils-functions/uuid'
import AddressUtils from './resources/utils-functions/address'
import MissionsUtils from './resources/utils-functions/missions.utils'

// excepted DatesUtils,
// all utils classes are static and thus don't require instantiation
export const useUtils = () => {
  return {
    // data types
    dates: DatesUtils,
    times: TimesUtils,
    files: FilesUtils,
    objects: ObjectsUtils,
    types: TypesUtils,
    math: MathUtils,
    uuid: UUIDUtils,
    // API models
    users: UsersUtils,
    missions: MissionsUtils,
    address: AddressUtils
  }
}
