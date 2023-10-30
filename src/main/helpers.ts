import { is } from '@electron-toolkit/utils'
import { format } from 'url'
import { join } from 'path'
import { BrowserWindow, screen, net } from 'electron'
import { mainWindow } from './index'
import * as winax from 'winax'

const Turbomed = new winax.Object('TMMain.Application', { activate: true })

export function isWithinDisplayBoundsX(pos: { x: number; display: BrowserWindow }) {
  const winBounds = pos.display.getBounds()
  const activeScreen = screen.getDisplayNearestPoint({ x: winBounds.x, y: winBounds.y })
  const area = activeScreen.workArea
  return pos.x >= area.x && pos.x < area.x + area.width
}
export function isWithinDisplayBoundsY(pos: { y: number; display: BrowserWindow }) {
  const winBounds = pos.display.getBounds()
  const activeScreen = screen.getDisplayNearestPoint({ x: winBounds.x, y: winBounds.y })
  const area = activeScreen.workArea
  return pos.y >= area.y && pos.y < area.y + area.height
}

export const openUrlDependingFromMode = async (
  currentBrowserWindow: BrowserWindow,
  path: string
) => {
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    return currentBrowserWindow.loadURL(`http://localhost:5173/${path}`)
  } else {
    const loadUrl = format({
      pathname: join(__dirname, `../renderer/index.html`),
      hash: `/${path}`,
      protocol: 'file:',
      slashes: true
    })
    return currentBrowserWindow.loadURL(loadUrl)
  }
}
export const getNewWindowPosition = (
  parentWindow: BrowserWindow,
  windowWidth: number,
  windowHeight: number
) => {
  const { x, y, width, height } = parentWindow.getBounds()
  let newWindowX = x - windowWidth
  let newWindowY = y
  const isWithinBoundsX = isWithinDisplayBoundsX({ x: newWindowX, display: parentWindow })
  const isWithinBoundsY = isWithinDisplayBoundsY({
    y: newWindowY + windowHeight,
    display: parentWindow
  })
  if (!isWithinBoundsX) newWindowX = x + width
  if (!isWithinBoundsY) newWindowY = y - windowHeight + height

  return { x: newWindowX, y: newWindowY }
}

export const creaeteWindowDragControl = (currentWindow: BrowserWindow) => {
  const WM_MOUSEMOVE = 0x0200 // https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-mousemove
  const WM_LBUTTONUP = 0x0202 // https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-lbuttonup

  const MK_LBUTTON = 0x0001
  let isDragging = false
  let initialPos = {
    x: 0,
    y: 0
  }

  currentWindow.hookWindowMessage(WM_LBUTTONUP, () => {
    isDragging = false

    currentWindow.webContents.send('onWindowIsDragged', { isDragged: isDragging })
  })
  currentWindow.hookWindowMessage(WM_MOUSEMOVE, (wParam, lParam) => {
    if (!currentWindow) {
      return
    }
    const wParamNumber: number = wParam.readInt16LE(0)
    if (!(wParamNumber & MK_LBUTTON)) {
      // <-- checking if left mouse button is pressed
      return
    }

    const x = lParam.readInt16LE(0)
    const y = lParam.readInt16LE(2)
    if (!isDragging) {
      isDragging = true
      initialPos.x = x
      initialPos.y = y
      return
    }
    currentWindow.setBounds({
      x: x + currentWindow.getPosition()[0] - initialPos.x,
      y: y + currentWindow.getPosition()[1] - initialPos.y
    })
    currentWindow.webContents.send('onWindowIsDragged', { isDragged: isDragging })
  })
}

export let popWindow: BrowserWindow

export const openNewWindow = async (path: string) => {
  if (popWindow) {
    popWindow.destroy()
  }
  let newWindowHeight = 800
  let newWindowWidth = 600
  const { x, y } = getNewWindowPosition(mainWindow, newWindowWidth, newWindowHeight)
  popWindow = new BrowserWindow({
    parent: mainWindow,
    height: newWindowHeight,
    width: newWindowWidth,
    show: false,
    x: x,
    y: y,
    // modal: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      plugins: true,
      sandbox: false
    }
  })

  popWindow.removeMenu()
  openUrlDependingFromMode(popWindow, path)
  popWindow.show()
}

export const startPollingStatus = async () => {
  await getTurbomed()
  setTimeout(() => {
    startPollingStatus()
  }, 5000)
}
const createUrlWithOption = (url: string, patient?: any) => {
  if (!patient) return url
  const linkWithPatient = new URL(url)
  linkWithPatient.searchParams.append('id', patient.id)
  linkWithPatient.searchParams.append('firstName', patient.firstName)
  linkWithPatient.searchParams.append('secondName', patient.secondName)
  linkWithPatient.searchParams.append('street', patient.street)
  linkWithPatient.searchParams.append('zip', patient.zip)
  linkWithPatient.searchParams.append('birthday', patient.birthday)
  linkWithPatient.searchParams.append('city', patient.city)
  linkWithPatient.searchParams.append('gender', patient.gender)
  linkWithPatient.searchParams.append('houseNumber', patient.houseNumber)
  return linkWithPatient.toString()
}
const fetchDocStatus = async (patient: any) => {
  try {
    const link = createUrlWithOption('http://192.168.185.59:3333/api/checkDocStatus', patient)
    const response = await net.fetch(link)

    if (response.ok) {
      const body = await response.json()
      // ... use the result.
      console.log({ body })
    }
    // const json = await request.json()
    console.log(response.status)
  } catch (e) {
    console.log(e)
  }
}

export const getTurbomed = async () => {
  try {
    const app = Turbomed
    const oPatient = app.AktiverPatient()
    const nummer = oPatient.Nummer()
    const namensdaten = oPatient.Namensdaten()
    const geburtsdaten = oPatient.Geburtsdaten()
    const vorname = namensdaten.Vorname()
    const nachname = namensdaten.Nachname()
    const adressdaten = oPatient.Adressdaten().Postanschrift('Privat', 1)
    const ort = adressdaten.Ort()
    const plz = adressdaten.Postleitzahl()
    const strasse = adressdaten.Strasse()
    const hausnummer = adressdaten.Hausnummer()
    const geburtstag = geburtsdaten.datum()
    const geschlecht = geburtsdaten.geschlecht()
    const patient = {
      id: String(nummer),
      firstName: vorname,
      secondName: nachname,
      city: ort,
      zip: plz,
      street: strasse,
      houseNumber: hausnummer,
      birthday: geburtstag,
      gender: geschlecht
    }
    await fetchDocStatus(patient)
    return { data: patient }
  } catch (e) {
    console.log(e)
    // winax.release(Turbomed)
    return { error: 'ERROR' }
  }
}
