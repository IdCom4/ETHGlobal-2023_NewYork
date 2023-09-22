import { StrictAddress } from '@/schemas/common/pojos'
import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'

export interface IMapAPI {
  /**
   * Returns the best distance estimation between 2 points
   *
   * @param start the coordinates of starting point
   * @param destination the coordinates of destination point
   * @returns the distance in kilometers
   */
  getDistanceBetweenCoordinates(start: [number, number], destination: [number, number]): Promise<number>

  /**
   * Returns the best distance estimation between 2 addresses
   *
   * @param start the coordinates of starting point
   * @param destination the coordinates of destination point
   * @returns the distance in kilometers
   */
  getDistanceBetweenStrictAddresses(start: StrictAddress, destination: StrictAddress): Promise<number>

  /**
   * Returns the best distance estimation as crows fly between 2 points
   *
   * @param start the coordinates of starting point
   * @param destination the coordinates of destination point
   * @returns the distance in kilometers
   */
  getCrowFlyDistanceBetweenCoordinates(start: [number, number], destination: [number, number]): Promise<number>
}

/* >==== COMMON METHODS ====> */
async function getCrowFlyDistanceBetweenCoordinates(start: [number, number], destination: [number, number]): Promise<number> {
  const [startLatitude, startLongitude] = start
  const [destLatitude, destLongitude] = destination

  const earthRadius = 6371 // Radius of the earth in km
  const latitudeDistance = degreeToRadius(destLatitude - startLatitude) // degreeToRadius below
  const longitudeDistance = degreeToRadius(destLongitude - startLongitude)
  const a =
    Math.sin(latitudeDistance / 2) * Math.sin(latitudeDistance / 2) +
    Math.cos(degreeToRadius(startLatitude)) *
      Math.cos(degreeToRadius(destLatitude)) *
      Math.sin(longitudeDistance / 2) *
      Math.sin(longitudeDistance / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = earthRadius * c // Distance in km

  return distance
}

function degreeToRadius(degree: number): number {
  return degree * (Math.PI / 180)
}

/* >==== IMPLEMENTATIONS ====> */

@Injectable()
export class LocalMapAPI implements IMapAPI {
  public async getDistanceBetweenCoordinates(start: [number, number], destination: [number, number]): Promise<number> {
    return this.getCrowFlyDistanceBetweenCoordinates(start, destination)
  }

  public async getDistanceBetweenStrictAddresses(start: StrictAddress, destination: StrictAddress): Promise<number> {
    return this.getDistanceBetweenCoordinates(start.coordinates, destination.coordinates)
  }

  public async getCrowFlyDistanceBetweenCoordinates(start: [number, number], destination: [number, number]): Promise<number> {
    return getCrowFlyDistanceBetweenCoordinates(start, destination)
  }
}

@Injectable()
export class MapBoxAPI implements IMapAPI {
  private readonly logger = new Logger(MapBoxAPI.name)

  private readonly MAPBOX_API: string
  private readonly MAPBOX_ACCESS_TOKEN: string

  private readonly config = {
    alternatives: false,
    geometries: 'geojson',
    notifications: false,
  }

  constructor(private readonly httpService: HttpService, configService: ConfigService) {
    this.MAPBOX_API = <string>configService.get('MAPBOX_API')
    this.MAPBOX_ACCESS_TOKEN = <string>configService.get('MAPBOX_ACCESS_TOKEN')
  }

  public async getDistanceBetweenCoordinates(start: [number, number], destination: [number, number]): Promise<number> {
    const startQuery = `${start[0]},${start[1]}`
    const destinationQuery = `${destination[0]},${destination[1]}`

    const queryConfig = Object.entries(this.config)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    const responseObservable = this.httpService.get(
      `${this.MAPBOX_API}/${startQuery};${destinationQuery}?${queryConfig}&access-token=${this.MAPBOX_ACCESS_TOKEN}`
    )

    try {
      // TODO: figure out if latency is not too big of price when this method is called often
      // TODO: solve 401 error
      // TODO: check returned data type to get distance only
      const { data, status } = await lastValueFrom(responseObservable)

      return status >= 200 && status <= 300 ? data : this.getCrowFlyDistanceBetweenCoordinates(start, destination)
    } catch (error) {
      this.logger.error(error)
    }

    return this.getCrowFlyDistanceBetweenCoordinates(start, destination)
  }

  public async getDistanceBetweenStrictAddresses(start: StrictAddress, destination: StrictAddress): Promise<number> {
    return await this.getDistanceBetweenCoordinates(start.coordinates, destination.coordinates)
  }

  public async getCrowFlyDistanceBetweenCoordinates(start: [number, number], destination: [number, number]): Promise<number> {
    return getCrowFlyDistanceBetweenCoordinates(start, destination)
  }
}
