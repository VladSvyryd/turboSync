import * as winax from 'winax'

export const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let app = new winax.Object('Word.Application', { activate: true })

export const sendPrintOrder = (path: string, printer: string) => {
  app = new winax.Object('Word.Application', { activate: true })
  app.Visible = false
  app.ActivePrinter = printer
  app.Documents.Open(path)
  app?.PrintOut(true)
  app?.Quit()
  winax.release(app)
}
