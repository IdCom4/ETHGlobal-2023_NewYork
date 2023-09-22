import { Injectable } from '@nestjs/common'
import { FacebookPixelTracker, ITracker, TiktokPixelTracker } from '@Common/external-service-providers-api/tracker/tracker'
import { TrackedEvent } from '@Common/enums'
import { ConfigService } from '@nestjs/config'
import { User } from '@Schemas/user'

/**
 * TrackerDispatcher
 *
 * This service is responsible for managing and dispatching events to multiple tracking services
 * (implemented as ITracker). It serves as an abstraction layer between the event sources and
 * the different tracking services.
 *
 * Use cases:
 * This service is ideal for scenarios where multiple tracking services are used,
 * and we need to handle which events get sent to which tracking service. The TrackerDispatcher
 * abstracts the dispatching logic and provides a single entry point for managing tracking.
 *
 */
@Injectable()
export class TrackerDispatcher {
  private readonly trackerMap: Map<ITracker, TrackedEvent[]> = new Map<ITracker, TrackedEvent[]>()

  constructor(configService: ConfigService) {
    this.trackerMap.set(new FacebookPixelTracker(configService), [
      TrackedEvent.USER_REGISTER,
      TrackedEvent.USER_DELETE,
      TrackedEvent.USER_SEARCH,
      TrackedEvent.BOX_RESERVATION,
      TrackedEvent.MISSION_CREATED,
    ])
    this.trackerMap.set(new TiktokPixelTracker(configService), [
      TrackedEvent.USER_REGISTER,
      TrackedEvent.USER_DELETE,
      TrackedEvent.USER_SEARCH,
      TrackedEvent.BOX_RESERVATION,
      TrackedEvent.MISSION_CREATED,
    ])
  }

  /**
   * Send events to all trackers that are configured to receive them.
   *
   * @param {TrackedEvent} event The event to be tracked.
   * @param {User} user The user performing the event.
   */
  public async sendEvents(event: TrackedEvent, user: User): Promise<void> {
    for (const [tracker, events] of this.trackerMap.entries()) {
      if (events.includes(event)) {
        await tracker.sendEvent(event, user)
      }
    }
  }
}
