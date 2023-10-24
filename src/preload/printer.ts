import * as winax from 'winax'

export const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const print = async (path: string) => {
  const app = new winax.Object('Word.Application', { activate: true })
  console.log(app)
  app.visible = false
  app.Documents.Open(path)
  app.ActivePrinter = 'Xerox Drucker (Name)'
  app.PrintOut()
  // console.log(methods)
}

export const scan = async () => {
  const app = new winax.Object('twain', { activate: true })
  console.log(app)

  // console.log(methods)
}
