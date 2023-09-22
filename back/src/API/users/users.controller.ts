import { Body, Controller, Delete, Get, HttpStatus, Patch, Request, SerializeOptions, UseGuards } from '@nestjs/common'
import { UsersService } from '@Api/users/users.service'
import { UpdateUserAccountRequest } from '@/API/users/requests/update-user-account.dto'
import { JwtAuthGuard } from '@Common/auth/guards/jwt/jwt-auth.guard'
import { MessageResponse } from '@Common/request-io/responses-dto/message.dto'
import { UserGroups } from '@/common/enums'
import { User } from '@/schemas/user'
import { AdminJwtAuthGuard } from '@/common/auth/guards/jwt'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthApiDecorators } from '@Common/decorators/swagger.decorator'
import { AuthType } from '@Common/enums/auth-type.enum'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieves the logged user profile.
   * @param loggedUser The logged user, resolved by the guard.
   * @return {User}    The logged user profile.
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération du profil utilisateur', type: User })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  async getLoggedUserProfile(@Request() { user: loggedUser }: RequestWithLoggedUser): Promise<User> {
    return loggedUser
  }

  /**
   * Retrieves all the users with admin permission.
   * @return {User[]} The list of all the users with the admin permission.
   *
   * @remarks This route is only accessible by the admin users.
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération des utilisateurs', type: Array<User> })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(AdminJwtAuthGuard)
  @Get('admins')
  @SerializeOptions({ groups: [UserGroups.ADMIN_REQUEST] })
  async getAdminUsers(): Promise<User[]> {
    return await this.usersService.getAllAdminUsers()
  }

  /**
   * Update the logged user account.
   * @param loggedUser                             The logged user, resolved by the guard.
   * @param {UpdateUserAccountRequest} requestBody The sent request with needed and validated information.
   * @return {User}                                The updated user account.
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Mise à jour du compte', type: MessageResponse })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(JwtAuthGuard)
  @Patch('update-account')
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  async updateUserAccount(@Request() { user: loggedUser }: RequestWithLoggedUser, @Body() requestBody: UpdateUserAccountRequest): Promise<User> {
    return await this.usersService.updateUserAccount(loggedUser, requestBody)
  }

  /**
   * Delete the logged user account.
   * It is a soft deletion, the account is not deleted from the database but is disabled.
   * @param loggedUser The logged user, resolved by the guard.
   * @return {MessageResponse} Response given for the deletion.
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Désactivation du compte', type: MessageResponse })
  @AuthApiDecorators(AuthType.JWT)
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteProfile(@Request() { user: loggedUser }: RequestWithLoggedUser): Promise<MessageResponse> {
    await this.usersService.disableAccount(loggedUser)
    return new MessageResponse(HttpStatus.OK, 'Le compte a été désactivé')
  }
}
