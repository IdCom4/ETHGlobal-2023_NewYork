import { MapboxFeature } from '@/assets/ts/classes/external-apis'

export const useGeocoder = () => ({
  getAddressSuggestionsFromGeocoderAPI: async (
    currentSearchValue: string,
    isPreciseAddressRequested: boolean,
    geolocalisationType: string
  ): Promise<MapboxFeature[]> => {
    const { MAPBOX_ACCESS_TOKEN } = useRuntimeConfig().public

    const encodedSearch = encodeURIComponent(currentSearchValue)
    const geocoderURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedSearch}.json?language=fr&country=fr&types=${geolocalisationType}&access_token=${MAPBOX_ACCESS_TOKEN}`

    const { data, error } = await useRequest().get<IGeocoderData>(geocoderURL)

    if (!data || error) {
      alert(`Erreur requête: ${error}`)
      return []
    }

    const features = data.features.map((feature) => new MapboxFeature(feature))
    return isPreciseAddressRequested ? features.filter((feature) => feature.isStrict()) : features
  }
})
