import { PowerShell } from 'node-powershell'

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { app, ipcRenderer } from 'electron'
const ps = new PowerShell({
  executableOptions: {
    '-ExecutionPolicy': 'Bypass',
    '-NoProfile': true
  }
})
export type Patient = {
  id: string
  firstName: string | undefined
  secondName: string | undefined
  city: string | undefined
  zip: string | undefined
  street: string | undefined
  houseNumber: string | undefined
  birthday: string //Date  | undefined
  gender: string //Date  | undefined
}
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
   [console]::OutputEncoding = New-Object System.Text.UTF8Encoding
      try {
       $app  = [System.Runtime.InteropServices.Marshal]::GetActiveObject("TMMain.Application")
       $oPatient = $app.AktiverPatient().Nummer()
       [System.GC]::Collect()
      }
      catch [System.Runtime.InteropServices.COMException] {
       echo "null";
      [System.GC]::Collect()
      }
      `
    await ps.invoke(c)
    return true
  } catch {
    return false
  }
}

export const getCurrentPatient = async (id: String) => {
  try {
    const cmd = PowerShell.command`
    [console]::OutputEncoding = New-Object System.Text.UTF8Encoding
    try{
                $app            = [System.Runtime.InteropServices.Marshal]::GetActiveObject("TMMain.Application")
                $oPatient       = $app.Praxisgemeinschaft().PatientMitNummer(${id})
                $nummer         = $oPatient.Nummer()
                $namensdaten    = $oPatient.Namensdaten()
                $vorname        = $namensdaten.Vorname()
                $nachname       = $namensdaten.Nachname()
                $adressdaten    = $oPatient.Adressdaten().Postanschrift("Privat", 1)
                $ort            = $adressdaten.Ort()
                $plz            = $adressdaten.Postleitzahl()
                $strasse        = $adressdaten.Strasse()
                $hausnummer     = $adressdaten.Hausnummer()
                $geburtsdaten   = $oPatient.Geburtsdaten()
                $geburtstag     = $geburtsdaten.datum()
                $geschlecht     = $geburtsdaten.geschlecht()
                $json           = "{'id': '$nummer', 'hausnummer': '$hausnummer', 'geburtstag': '$geburtstag', 'strasse': '$strasse', 'geschlecht': '$geschlecht', 'firstName': '$vorname', 'secondName': '$nachname', 'city': '$ort', 'zip' : '$plz'}"
                echo  $json

            [System.GC]::Collect()
                }

              catch [System.Runtime.InteropServices.COMException] {
       echo null;
      [System.GC]::Collect()
      }
    `
    const queryPatient = await ps.invoke(cmd)
    if (queryPatient.raw === 'null') return null
    console.log(queryPatient.raw.replaceAll("'", '"'))

    return JSON.parse(queryPatient.raw.replaceAll("'", '"'))
  } catch (e) {
    console.log('HERE', e)
    return { error: '(Aktiver Patient da?)' }
  } finally {
  }
}

const getMaxPatientRows = async (id: string) => {
  try {
    const cmd = PowerShell.command`
   [console]::OutputEncoding = New-Object System.Text.UTF8Encoding
      try {
       $app  = [System.Runtime.InteropServices.Marshal]::GetActiveObject("TMMain.Application")
       $oPatient = $app.Praxisgemeinschaft().PatientMitNummer(${id})
       $count = $oPatient.Karteikarte().Zeilen().count()
       echo $count
       [System.GC]::Collect()
        }
      catch [System.Runtime.InteropServices.COMException] {
       echo null;
      [System.GC]::Collect()
      }
    `
    const res = await ps.invoke(cmd)
    if (res.raw === 'null') return 0
    return Number(res.raw)
  } catch (e) {
    console.log(e)
    return 0
  }
}

export async function initPatientImport(id: string) {
  try {
    const patient = await getCurrentPatient(id)
    const count = await getMaxPatientRows(id)
    ipcRenderer.send('setProgress', count)

    const queryRows = [...new Array(20)].map((_, index) => getPatientRow(id, index))
    const rows = await Promise.all(queryRows)
    console.log({ rows })
    const filePath = app.getAppPath() + '/temp/export' + '/' + id
    if (!existsSync(filePath)) {
      mkdirSync(filePath, { recursive: true })
    }

    writeFileSync(filePath + '/data.json', JSON.stringify({ ...patient, rows }, null, 2))
    return { data: rows }
  } catch (e) {
    console.log('Error Bla', e)
    return { error: '(Error?)' }
  }
}

export const getPatientRow = async (id: String, index: number) => {
  const cmd = PowerShell.command`
   [console]::OutputEncoding = New-Object System.Text.UTF8Encoding
   $progId = 'TMMain.Application';
    try {
       $app = [System.Runtime.InteropServices.Marshal]::GetActiveObject($progId);
       $oPatient = $app.Praxisgemeinschaft().PatientMitNummer(${id})
       $art = $oPatient.Karteikarte().Zeilen().Item(${index}).Eintrag().Id()
       $id = $oPatient.Karteikarte().Zeilen().Item(${index}).PublicId()
       $lastChange = $oPatient.Karteikarte().Zeilen().Item(${index}).Properties().Item("letzteAenderungZeitpunkt")
       $created    = $oPatient.Karteikarte().Zeilen().Item(${index}).Properties().Item("erstellungsZeitpunkt")
       $eintrag    = $oPatient.Karteikarte().Zeilen().Item(${index}).Eintrag().AsString()
       $autor      = $oPatient.Karteikarte().Zeilen().Item(${index}).Properties().Item("markierung")
       echo "{'art': '$art', 'id': '$id', 'eintrag': '$eintrag', 'lastChange': '$lastChange', 'created': '$created', 'autor': '$autor' }";
       [System.GC]::Collect()
    }
    catch [System.Runtime.InteropServices.COMException] {
      echo "null";
      [System.GC]::Collect()
    }
  `

  try {
    const res = await ps.invoke(cmd)
    ipcRenderer.send('onProgressChanged', index)
    if (res.raw === 'null') return null
    return JSON.parse(res.raw.replaceAll("'", '"'))
  } catch (e) {
    console.log(e)
    return { error: '(Aktiver Patient da?)' }
  }
}
