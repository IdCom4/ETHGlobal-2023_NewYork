export {}

declare global {
  interface IMissionClientRequest {
    client: ILiteUser
    vehicle: IGuestVehicle
    issueIds: string[]
    description: string
    idealStartingMoment: string
    idealPickupAddress: IStrictAddress
    maxDistance: number
    hadSpareParts: boolean
    attachments: IPublicFile[]
  }

  //Front only
  interface IPopulatedMissionClientRequest extends IMissionClientRequest {
    issues: IIssue[]
  }
}
