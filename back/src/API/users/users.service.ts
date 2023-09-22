import { Injectable, Logger } from '@nestjs/common'
import { User } from '@Schemas/user'
import { UserRepository } from '@/repositories/user.repository'
import { HostedFilesService } from '@Api/hosted-files/hosted-files.service'
import { LenientAddress, StrictAddress } from '@Schemas/common/pojos'
import { UserNotFoundException } from '@/common/exceptions/schemas/user'

@Injectable()
export class UsersService {
  protected readonly logger = new Logger(UsersService.name)

  constructor(private readonly userRepository: UserRepository, private readonly hostedFilesService: HostedFilesService) {}

  /**
   * Retrieves a user by its id.
   * @param userId The user id.
   * @param options The options to apply to the query.
   * @param options.activesOnly If true, it will query only the active users.
   * @return {User} The retrieved user.
   * @throws {UserNotFoundException} If the user is not found.
   */
  async getUserById(userId: string, options: { activesOnly: boolean }): Promise<User> {
    const user = await this.userRepository.findById(userId).getOrThrow(new UserNotFoundException())

    if (options.activesOnly && user.isSoftDeleted()) throw new UserNotFoundException()

    return user
  }

  /**
   * Update the user account.
   *
   * @param user The user to update.
   * @param updateUserAccountData The request with the new information.
   * @return {User} The updated user.
   */
  async updateUserAccount(user: User, updateUserAccountData: TUpdateUserAccountData): Promise<User> {
    if (!!updateUserAccountData.name) user.name = updateUserAccountData.name
    if (!!updateUserAccountData.lastName) user.lastName = updateUserAccountData.lastName
    if (!!updateUserAccountData.phone) user.phone = updateUserAccountData.phone
    if (!!updateUserAccountData.sex) user.sex = updateUserAccountData.sex
    if (!!updateUserAccountData.birthday) user.birthday = updateUserAccountData.birthday
    if (!!updateUserAccountData.picture) {
      const newPictureFile = await this.hostedFilesService.replaceFile(
        user.picture?.fileReferenceId || null,
        { content: updateUserAccountData.picture, name: `profile-picture-${user._id.toString()}` },
        user._id.toString(),
        false
      )

      user.picture = newPictureFile.toPublicFile()
    }
    if (!!updateUserAccountData.billingAddress) user.billingAddress = LenientAddress.fromRequest(updateUserAccountData.billingAddress)
    if (!!updateUserAccountData.homeAddress) user.homeAddress = StrictAddress.fromRequest(updateUserAccountData.homeAddress)

    await this.userRepository.updateAsIs(user)

    return user
  }

  /**
   * Disable the user account.
   * Disabling is a soft delete, the user is not deleted from the database.
   *
   * @param user The user to disable.
   */
  async disableAccount(user: User): Promise<void> {
    user.softDelete()
    await this.userRepository.updateAsIs(user)
  }

  /**
   * Retrieves all the users with admin permission.
   *
   * @return {User[]} The list of all the users with the admin permission.
   */
  async getAllAdminUsers(): Promise<User[]> {
    return await this.userRepository.findMany({ _isAdmin: true }).getOr([])
  }
}
