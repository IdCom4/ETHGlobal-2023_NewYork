export const useConfig = () => ({
  get: (varName: string): string => {
    const envVar = process.env.NODE_ENV === 'test' ? (import.meta.env[`VITE_${varName}`] as string) : useRuntimeConfig()[varName]
    if (!envVar) throw new Error('Environment variable does not exist')
    return envVar
  }
})
