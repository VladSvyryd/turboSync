import * as winax from 'winax'
import { PowerShell } from 'node-powershell'

import { Patient } from './store'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { app } from 'electron'
const ps = new PowerShell({
  executableOptions: {
    '-ExecutionPolicy': 'Bypass',
    '-NoProfile': true
  }
})

export async function getPatientById(id: string) {
  const active = await canWorkWithPatient()
  if (!active)
    return {
      error: `(Turbomed aus/Aktiver Patient da?)`
    }

  return getCurrentPatient(id)
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

export const getCurrentPatient = async (id: String) => {
  const Turbomed = new winax.Object('TMMain.Application', { activate: true })

  try {
    const app = Turbomed
    const oPatient = app.Praxisgemeinschaft().PatientMitNummer(id)
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

// const getMaxPatientRows = (turbomed: any, id: string) => {
//   try {
//     const app = turbomed
//     const oPatient = app.Praxisgemeinschaft().PatientMitNummer(id)
//     const count = oPatient.Karteikarte().Zeilen().count()
//     return count
//   } catch (e) {
//     console.log(e)
//   }
// }

export async function initPatientImport(id: string) {
  const Turbomed = new winax.Object('TMMain.Application', { activate: true })
  try {
    const oPatient = Turbomed.Praxisgemeinschaft().PatientMitNummer(id)
    const patient = await getCurrentPatient(id)
    // const count = getMaxPatientRows(Turbomed, id)
    // ipcRenderer.send('setProgress', count)
    const rows: Array<Patient> = []
    for (let i = 0; i < 5; i++) {
      const art = oPatient.Karteikarte().Zeilen().Item(i).Eintrag().Id()
      const id = oPatient.Karteikarte().Zeilen().Item(i).PublicId()
      const lastChange = oPatient
        .Karteikarte()
        .Zeilen()
        .Item(i)
        .Properties()
        .Item('letzteAenderungZeitpunkt')
      const created = oPatient
        .Karteikarte()
        .Zeilen()
        .Item(i)
        .Properties()
        .Item('erstellungsZeitpunkt')
      const eintrag = oPatient.Karteikarte().Zeilen().Item(i).Eintrag().AsString()
      const autor = oPatient.Karteikarte().Zeilen().Item(i).Properties().Item('markierung')

      const row = {
        art,
        id,
        lastChange,
        created,
        eintrag,
        autor
      } as unknown as Patient
      rows.push(row)
    }
    const filePath = __dirname + '../../../../' + patient!.data!.id ?? 'bla' + '/'
    if (existsSync(filePath)) {
      mkdirSync(filePath, { recursive: true })
    }
    console.log(filePath, app.getPath('exe'), rows)

    writeFileSync(filePath + 'data.json', JSON.stringify({ ...patient.data, rows }, null, 2))
    return { data: rows }
  } catch (e) {
    console.log(e)
    return { error: '(Error?)' }
  } finally {
    winax.release(Turbomed)
  }
}

export const getPatientRow = async (id: String) => {
  const Turbomed = new winax.Object('TMMain.Application', { activate: true })

  try {
    const app = Turbomed
    const oPatient = app.Praxisgemeinschaft().PatientMitNummer(id)
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
