import { shell } from 'electron'

export const openDoc = async (filePath: string) => {
  await shell.openPath(filePath)
}
