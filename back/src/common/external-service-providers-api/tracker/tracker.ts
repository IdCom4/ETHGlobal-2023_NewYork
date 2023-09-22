import { TrackedEvent } from '@Common/enums/tracked-event.enum'
import { User } from '@Schemas/user'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventRequest, ServerEvent, UserData } from 'facebook-nodejs-business-sdk'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

/**
 * This interface outlines the necessary methods for sending data
 * to a tracking system (like Facebook Pixel). It allows for the collection of
 * statistics on various events such as account creation.
 */
export interface ITracker {
  /**
   * Method to send tracking data to the external tracking system
   *
   * @param {TrackedEvent} event The event to be tracked.
   * This could be anything from account creation, user login, page view, etc.
   * @param {User} user The user performing the event.
   * @param {String} [documentId] The document ID related to the performed the event.
   */
  sendEvent(event: TrackedEvent, user: User, documentId?: string): Promise<void>
}

/**
 * FacebookPixelTracker
 *
 * This class implements the ITracker interface and specifically provides
 * functionality for tracking events with the Facebook Pixel system.
 * It uses the ConfigService to obtain necessary configuration parameters like
 * the access token and pixel ID.
 */
@Injectable()
export class FacebookPixelTracker implements ITracker {
  private readonly accessToken: string
  private readonly pixelId: string

  constructor(private readonly configService: ConfigService) {
    this.accessToken = <string>this.configService.get('FB_ACCESS_TOKEN')
    this.pixelId = <string>this.configService.get('FB_PIXEL_ID')
  }

  async sendEvent(event: TrackedEvent, user: User): Promise<void> {
    const userData = new UserData(user.email, user.phone)
    const triggeredEvent = new ServerEvent(event)
    triggeredEvent.setEventTime(Math.floor(new Date().getTime() / 1000)).setUserData(userData)

    const eventRequest = new EventRequest(this.accessToken, this.pixelId, [triggeredEvent])

    try {
      await eventRequest.execute()
    } catch (e) {
      console.log(e)
    }
  }
}

/**
 * TiktokPixelTracker
 *
 * This class implements the ITracker interface and specifically provides
 * functionality for tracking events with the TikTok Pixel system.
 * It uses the ConfigService to obtain necessary configuration parameters like
 * the access token and pixel ID.
 */
@Injectable()
export class TiktokPixelTracker implements ITracker {
  private readonly accessToken: string
  private readonly pixelCode: string
  private readonly axiosInstance: AxiosInstance
  constructor(private readonly configService: ConfigService) {
    this.accessToken = <string>this.configService.get('TIKTOK_ACCESS_TOKEN')
    this.pixelCode = <string>this.configService.get('TIKTOK_PIXEL_CODE')
    this.axiosInstance = axios.create({
      baseURL: 'https://business-api.tiktok.com/open_api/v1.3',
    })
  }

  async sendEvent(event: TrackedEvent, user: User, documentId: string): Promise<void> {
    const header: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    }

    const body = {
      event_source: 'web',
      event_source_id: this.pixelCode,
      data: {
        event: event,
        event_time: Math.floor(Date.now() / 1000),
        event_id: `${user._id.toString()}_${documentId}`,
        user: {
          email: user.email,
          phone: user.phone,
        },
      },
    }
    try {
      await this.axiosInstance.post('/event/track/', body, header)
    } catch (e) {
      console.log(`Status Code: ${e.response.status}`)
      console.log(`Message: ${e.response.data.message}`)
    }
  }
}
