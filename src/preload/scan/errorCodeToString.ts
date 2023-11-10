import { WIAErrorCodes } from './constants'

export const WIAErrorCodeToString = (WIAErrorCode: number): string => {
  switch (WIAErrorCode) {
    case WIAErrorCodes.WIA_ERROR_BUSY:
      return 'Das Gerät ist ausgelastet. Schließen Sie alle Apps, die dieses Gerät verwenden, oder warten Sie, bis es abgeschlossen ist, und versuchen Sie es dann erneut.'
    case WIAErrorCodes.WIA_ERROR_COVER_OPEN:
      return 'Mindestens eine Abdeckung des Geräts ist geöffnet.'
    case WIAErrorCodes.WIA_ERROR_DEVICE_COMMUNICATION:
      return 'Fehler bei der Kommunikation mit dem WIA-Gerät. Stellen Sie sicher, dass das Gerät eingeschaltet und mit dem PC verbunden ist. Wenn das Problem weiterhin besteht, trennen Sie das Gerät, und verbinden Sie es erneut.'
    case WIAErrorCodes.WIA_ERROR_DEVICE_LOCKED:
      return 'Das Gerät ist gesperrt. Schließen Sie alle Apps, die dieses Gerät verwenden, oder warten Sie, bis es abgeschlossen ist, und versuchen Sie es dann erneut.'
    case WIAErrorCodes.WIA_ERROR_EXCEPTION_IN_DRIVER:
      return 'Ser Gerätetreiber hat eine Ausnahme ausgelöst.'
    case WIAErrorCodes.WIA_ERROR_GENERAL_ERROR:
      return 'Beim WIA-Gerät ist ein unbekannter Fehler aufgetreten.'
    case WIAErrorCodes.WIA_ERROR_INCORRECT_HARDWARE_SETTING:
      return 'Es gibt eine falsche Einstellung auf dem WIA-Gerät.'
    case WIAErrorCodes.WIA_ERROR_INVALID_COMMAND:
      return 'Das Gerät unterstützt diesen Befehl nicht.'
    case WIAErrorCodes.WIA_ERROR_INVALID_DRIVER_RESPONSE:
      return 'Die Antwort des Treibers ist ungültig.'
    case WIAErrorCodes.WIA_ERROR_ITEM_DELETED:
      return 'Das WIA-Gerät wurde gelöscht. Es ist nicht mehr verfügbar.'
    case WIAErrorCodes.WIA_ERROR_LAMP_OFF:
      return 'Die Lampe des Scanners ist ausgeschaltet.'
    case WIAErrorCodes.WIA_ERROR_MAXIMUM_PRINTER_ENDORSER_COUNTER:
      return 'Ein Scanauftrag wurde unterbrochen, weil ein Imprinter/Endorser-Element den maximal gültigen Wert für WIA_IPS_PRINTER_ENDORSER_COUNTER erreichte und auf 0 zurückgesetzt wurde.'
    case WIAErrorCodes.WIA_ERROR_MULTI_FEED:
      return 'Ein Überprüfungsfehler ist aufgrund einer Bedingung für mehrere Seitenfeeds aufgetreten.'
    case WIAErrorCodes.WIA_ERROR_OFFLINE:
      return 'Das Gerät ist offline. Stellen Sie sicher, dass das Gerät eingeschaltet und mit dem PC verbunden ist.'
    case WIAErrorCodes.WIA_ERROR_PAPER_EMPTY:
      return 'Der Dokumenteinschub enthält keine Dokumente.'
    case WIAErrorCodes.WIA_ERROR_PAPER_JAM:
      return 'Papier ist im Dokumenteneinzug des Scanners eingeklemmt.'
    case WIAErrorCodes.WIA_ERROR_PAPER_PROBLEM:
      return 'Es ist ein nicht angegebenes Problem mit dem Dokumenteinzug des Scanners aufgetreten.'
    case WIAErrorCodes.WIA_ERROR_WARMING_UP:
      return 'Das Gerät wird aufgewärmt.'
    case WIAErrorCodes.WIA_ERROR_USER_INTERVENTION:
      return 'Es liegt ein Problem mit dem WIA-Gerät vor. Stellen Sie sicher, dass das Gerät eingeschaltet, online und alle Kabel ordnungsgemäß angeschlossen sind.'
    case WIAErrorCodes.WIA_S_NO_DEVICE_AVAILABLE:
      return 'Es wurde kein Scannergerät gefunden. Stellen Sie sicher, dass das Gerät online ist, mit dem PC verbunden ist und der richtige Treiber auf dem PC installiert ist.'

    default:
      return 'Unbekannter Fehlercode'
  }
}
