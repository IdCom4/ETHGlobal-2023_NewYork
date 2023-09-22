import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { Issue } from '@Schemas/issue/issue.schema'
import { IssuesController } from '@Api/issues/issues.controller'
import { IssuesService } from '@Api/issues/issues.service'
import { IssueRepository } from '@/repositories/issue.repository'

@Module({
  imports: [TypegooseModule.forFeature([Issue])],
  exports: [IssuesService, IssueRepository],
  providers: [IssuesService, IssueRepository],
  controllers: [IssuesController],
})
export class IssuesModule {}
