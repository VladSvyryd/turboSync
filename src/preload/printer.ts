import * as winax from 'winax'

export const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let printerApp = new winax.Object('Word.Application', { activate: true })

export const createPrintOrder = (path: string, printer: string) => {
  printerApp = new winax.Object('Word.Application', { activate: true })
  printerApp.Visible = false
  printerApp.ActivePrinter = printer
  printerApp.Documents.Open(path)
  printerApp?.PrintOut(true)
  printerApp?.Quit()
  winax.release(printerApp)
}
