declare global {
  type GEOLOCALISATON_TYPE = 'country' | 'region' | 'postcode' | 'district' | 'place' | 'locality' | 'neighborhood' | 'address' | 'poi'
}

export const enum GEOLOCALISATON_TYPES {
  CONTRY = 'country',
  REGION = 'region',
  POSTCODE = 'postcode',
  DISTRICT = 'district',
  PLACE = 'place',
  LOCALITY = 'locality',
  NEIGHBORHOOD = 'neighborhood',
  ADDRESS = 'address',
  POI = 'poi'
}
