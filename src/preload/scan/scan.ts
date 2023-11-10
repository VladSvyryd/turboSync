import * as fs from 'fs'
import { WiaDeviceType, ImageIntent, WIAErrorCodes } from './constants'
import { FileFormat, ScannerProperties, ScannerOptions, WIAPropertyConstant } from './types'
import { WIAErrorCodeToString } from './errorCodeToString'
import { DeviceManager } from './deviceManager'

const INVALID_PARAM = -2147024809 // 0x80070057
const SCAN_FOLDER = 'scans/'

// This could be used to canncel the otherwise infinite scanAll loop
// var cancledScan = false;
// const callbackCancelScan = () => {
//   cancledScan = true;
// };

export const scanAll = (options: ScannerOptions) => {
  const { deviceId } = options
  if (!deviceId) {
    console.log('no DeviceId specified')
    return
  }

  const Device = DeviceManager.DeviceInfos(deviceId).Connect()

  setProperties(Device)

  try {
    // while (!cancledScan) {
    while (true) {
      doScan(Device, options.format)
    }
  } catch (e) {
    if (e.code === WIAErrorCodes.WIA_ERROR_PAPER_EMPTY) {
      console.log('Ignore this except if its the first time')
    }
    console.log(WIAErrorCodeToString(e.code))
  }
}

export const scanSingle = (options: ScannerOptions) => {
  const { deviceId } = options
  if (!deviceId) {
    console.log('no DeviceId specified')
    return
  }

  const Device = DeviceManager.DeviceInfos(deviceId).Connect()

  setProperties(Device, options.props)

  doScan(Device, options.format)
}

export const getAllScanners = (): Array<{ name: string; deviceId: string }> => {
  console.log(DeviceManager.DeviceInfos.Count)
  let Scanners = []
  for (let i = 1; i <= DeviceManager.DeviceInfos.Count; i++) {
    if (DeviceManager.DeviceInfos(i).Type != WiaDeviceType.ScannerDeviceType) {
      continue
    }
    Scanners.push({
      name: DeviceManager.DeviceInfos(i).Properties('Name').Value,
      deviceId: DeviceManager.DeviceInfos(i).DeviceID
    })
  }
  return Scanners
}

// https://learn.microsoft.com/en-us/previous-versions/windows/desktop/wiaaut/-wiaaut-consts-formatid
const doScan = (Device: any, FormatId: FileFormat) => {
  let FileExt
  switch (FormatId) {
    case FileFormat.BMP:
      FileExt = '.bmp'
      break
    case FileFormat.PNG:
      FileExt = '.png'
      break
    case FileFormat.GIF:
      FileExt = '.gif'
      break
    case FileFormat.JPEG:
      FileExt = '.jpeg'
      break
    case FileFormat.TIFF:
      FileExt = '.tiff'
      break
    default:
      // Use BMP as default
      FileExt = '.bmp'
      break
  }

  const img = Device.Items(1).Transfer(FormatId)

  let i = 0
  let targetFilename = SCAN_FOLDER + `img${('0000' + i).slice(-4)}${FileExt}`
  while (fs.existsSync(targetFilename)) {
    i++
    targetFilename = SCAN_FOLDER + `img${('0000' + i).slice(-4)}${FileExt}`
  }

  img.SaveFile(targetFilename)
  console.log('Created File: ' + targetFilename)
}

const setProperties = (Device: any, props?: ScannerProperties) => {
  const defaultDPI = 300
  const DPI = props?.DPI ?? defaultDPI
  const A4_WIDTH = 8.3 // inches
  const A4_HEIGHT = 11.7 // inches

  // Colors
  setProperty(
    Device,
    WIAPropertyConstant.CurrentIntent,
    props?.imageIntent ?? ImageIntent.IMAGE_TYPE_COLOR
  )
  // dots per inch/horizontal
  setProperty(Device, WIAPropertyConstant.HorizontalResolution, DPI)
  // dots per inch/vertical
  setProperty(Device, WIAPropertyConstant.VerticalResolution, DPI)
  // x point where to start scan
  if (props?.startPosHorizontal !== undefined) {
    setProperty(Device, WIAPropertyConstant.HorizontalStartPostion, props.startPosHorizontal)
  }
  // y point where to start scan
  if (props?.startPosVertical !== undefined) {
    setProperty(Device, WIAPropertyConstant.VerticalStartPosition, props?.startPosVertical)
  }
  // horizontal exent DPI x inches wide
  setProperty(Device, WIAPropertyConstant.HorizontalExtent, Math.ceil(DPI * A4_WIDTH))
  // vertical extent DPI x inches tall
  setProperty(Device, WIAPropertyConstant.VerticalExtent, Math.ceil(DPI * A4_HEIGHT))
}

const setProperty = (Device: any, prop: WIAPropertyConstant, value: any) => {
  const propString = Object.entries(WIAPropertyConstant).find(([_, v]) => {
    return prop === v
  })[0]

  if (Device.Items(1).Properties.Exists(prop)) {
    try {
      Device.Items(1).Properties(prop).Value = value
    } catch (e) {
      if (e.code === INVALID_PARAM) {
        console.log('Invalid Parameter for: ' + propString)
      }
      console.log('Error setting WIA property "' + propString + '".')
    }
  } else {
    console.log('Error: WIA property "' + propString + '" does not exist on Object.')
  }
}
