// https://learn.microsoft.com/en-us/previous-versions/windows/desktop/wiaaut/-wiaaut-consts-formatid
// FormatID Constants
export enum FileFormat {
  BMP = '{B96B3CAB-0728-11D3-9D7B-0000F81EF32E}',
  PNG = '{B96B3CAF-0728-11D3-9D7B-0000F81EF32E}',
  GIF = '{B96B3CB0-0728-11D3-9D7B-0000F81EF32E}',
  JPEG = '{B96B3CAE-0728-11D3-9D7B-0000F81EF32E}',
  TIFF = '{B96B3CB1-0728-11D3-9D7B-0000F81EF32E}'
}

// https://learn.microsoft.com/en-us/windows/win32/wia/-wia-wia-property-constant-definitions
// WIA Property Constants
export enum WIAPropertyConstant {
  CurrentIntent = '6146',
  HorizontalResolution = '6147',
  VerticalResolution = '6148',
  HorizontalStartPostion = '6149',
  VerticalStartPosition = '6150',
  HorizontalExtent = '6151',
  VerticalExtent = '6152'
}

export type ScannerProperties = {
  imageIntent?: number // Should only be allowed to be one of the values of ImageIntent
  DPI?: number
  startPosHorizontal?: number
  startPosVertical?: number
}

export type ScannerOptions = {
  deviceId: string // Value aquired from getAllScanners
  format?: FileFormat // default BMP
  props?: ScannerProperties
}
