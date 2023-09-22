export const useSkillsEndpoint = () => {
  const _path = '/skills'

  return {
    getSkills: async (): Promise<IRequestResult<ISkill[]>> => {
      return await useRequest().get<ISkill[]>(_path)
    }
  }
}
