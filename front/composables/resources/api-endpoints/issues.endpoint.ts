import { AlertModes } from '@/types/constants'

export const useIssuesEndpoint = () => {
  const _path = '/issues'
  return {
    getIssues: async (alert: IAlertControl = { mode: AlertModes.NONE }): Promise<IRequestResult<IIssue[]>> => {
      const response = await useRequest().get<IIssue[]>(_path, { alert })
      return response
    },
    getIssuesByIds: async (issueIds: string[], alert: IAlertControl = { mode: AlertModes.NONE }): Promise<IRequestResult<IIssue[]>> => {
      const response = await useRequest().post<IIssue[]>(_path + '/by-ids', { body: { issueIds }, alert })
      return response
    }
  }
}
