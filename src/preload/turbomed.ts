import * as winax from 'winax'
import { PowerShell } from 'node-powershell'
const ps = new PowerShell({
  debug: true,
  executableOptions: {
    '-ExecutionPolicy': 'Bypass',
    '-NoProfile': true
  }
})
export async function getActivePatient() {
  const active = await canWorkWithPatient()
  if (!active)
    return {
      error: `(Turbomed aus/Aktiver Patient da?)`
    }

  return getCurrentPatient()
}

export async function canWorkWithPatient() {
  try {
    const c = PowerShell.command`
       $app  = [System.Runtime.InteropServices.Marshal]::GetActiveObject("TMMain.Application")
       $oPatient = $app.AktiverPatient().Nummer()
       [System.GC]::Collect()
    `
    await ps.invoke(c)
    return true
  } catch {
    return false
  }
}
export async function getTurbomedIsOn() {
  const Turbomed = new winax.Object('TMMain.Application', { activate: true })

  try {
    const oPatient = Turbomed.AktiverPatient()
    const nummer = oPatient.Nummer()
    return { id: nummer }
  } catch (e: any) {
    return { error: e?.message ?? 'Turbomed Error' }
  }
}

export const getCurrentPatient = async () => {
  const Turbomed = new winax.Object('TMMain.Application', { activate: true })

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
    return { data: patient }
  } catch (e) {
    console.log(e)
    return { error: '(Aktiver Patient da?)' }
  } finally {
    winax.release(Turbomed)
  }
}
