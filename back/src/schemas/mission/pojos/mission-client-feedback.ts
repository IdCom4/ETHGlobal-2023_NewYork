import { Review } from '@/schemas/common/pojos'
import { prop } from '@typegoose/typegoose'
import { Type } from 'class-transformer'

export class MissionClientFeedback {
  /* eslint-disable prettier/prettier */
  @prop({ required: true, _id: false })   @Type(() => Review) protected _reviewOfProfessional?: Review
  @prop({ required: false, _id: false })  @Type(() => Review) protected _reviewOfWebsite?: Review
  /* eslint-enable prettier/prettier */

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(reviewOfProfessional?: Review, reviewOfWebsite?: Review): MissionClientFeedback {
    const feedback = new MissionClientFeedback()

    feedback._reviewOfProfessional = reviewOfProfessional
    feedback._reviewOfWebsite = reviewOfWebsite

    return feedback
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  get reviewOfProfessional():  Review | undefined      { return this._reviewOfProfessional  }  
  get reviewOfWebsite():       Review | undefined      { return this._reviewOfWebsite       }
  /* eslint-enable prettier/prettier */
}

export abstract class MissionClientFeedbackBlueprint extends MissionClientFeedback {
  public _reviewOfProfessional?: Review
  public _reviewOfWebsite?: Review
}
