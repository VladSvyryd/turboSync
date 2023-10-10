import { shell } from 'electron'

export const openDoc = (filePath: string) => {
  shell.openPath(filePath)
}
