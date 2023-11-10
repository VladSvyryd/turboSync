// https://learn.microsoft.com/de-de/previous-versions/windows/desktop/wiaaut/-wiaaut-wiadevicetype
// WiaDeviceType enumeration
export const WiaDeviceType = {
  UnspecifiedDeviceType: 0,
  ScannerDeviceType: 1,
  CameraDeviceType: 2,
  VideoDeviceType: 3
}

// https://learn.microsoft.com/de-de/windows/win32/wia/-wia-imageintentconstants
// ImageIntent enumeration
export const ImageIntent = {
  IMAGE_TYPE_COLOR: 1,
  IMAGE_TYPE_GRAYSCALE: 2,
  IMAGE_TYPE_TEXT: 4
  // Setting MIN_SIZE or MAX_QUALITY will change previouly set DPI and possibly/likely other settings
  //   MINIMIZE_SIZE: 65536,
  //   MAXIMIZE_QUALITY: 131072,
  //   BEST_PREVIEW: 262144,
}

// https://learn.microsoft.com/en-us/windows/win32/wia/-wia-error-codes
// Error Codes (WIA)
export const WIAErrorCodes = {
  WIA_ERROR_BUSY: -2145320954,
  WIA_ERROR_COVER_OPEN: -2145320938,
  WIA_ERROR_DEVICE_COMMUNICATION: -2145320950,
  WIA_ERROR_DEVICE_LOCKED: -2145320947,
  WIA_ERROR_EXCEPTION_IN_DRIVER: -2145320946,
  WIA_ERROR_GENERAL_ERROR: -2145320959,
  WIA_ERROR_INCORRECT_HARDWARE_SETTING: -2145320948,
  WIA_ERROR_INVALID_COMMAND: -2145320949,
  WIA_ERROR_INVALID_DRIVER_RESPONSE: -2145320945,
  WIA_ERROR_ITEM_DELETED: -2145320951,
  WIA_ERROR_LAMP_OFF: -2145320937,
  WIA_ERROR_MAXIMUM_PRINTER_ENDORSER_COUNTER: -2145320927,
  WIA_ERROR_MULTI_FEED: -2145320928,
  WIA_ERROR_OFFLINE: -2145320955,
  WIA_ERROR_PAPER_EMPTY: -2145320957,
  WIA_ERROR_PAPER_JAM: -2145320958,
  WIA_ERROR_PAPER_PROBLEM: -2145320956,
  WIA_ERROR_WARMING_UP: -2145320953,
  WIA_ERROR_USER_INTERVENTION: -2145320952,
  WIA_S_NO_DEVICE_AVAILABLE: -2145320939
}
