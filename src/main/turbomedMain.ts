import { PowerShell } from 'node-powershell'

import { accessSync, existsSync, mkdirSync, writeFileSync } from 'fs'
import { app } from 'electron'
import IpcMainEvent = Electron.IpcMainEvent
import { writeFile, readFile } from 'fs/promises'
import * as path from 'path'
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
  rows: Array<PatientRow>
}
export type PatientRow = {
  art: string
  id: string
  gueltigkeitsZeitpunkt: string
  eintrag: string
  lastChange: string
  created: string
  autor: string
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

export async function initPatientImport(id: string, turboPath: string, render: IpcMainEvent) {
  try {
    const patient = await getCurrentPatient(id)
    const count = await getMaxPatientRows(id)
    render.sender.send('setProgress', count - 1)
    const queryRows = [...new Array(7)].map((_, index) =>
      getPatientRow(id, index, turboPath, render)
    )
    const rows = await Promise.all(queryRows)
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

export const getFileIfExists = async (id: string, index: number) => {
  const cmd = PowerShell.command`
   [console]::OutputEncoding = New-Object System.Text.UTF8Encoding
   $progId = 'TMMain.Application';
   $file = "false"
    try {
       $app = [System.Runtime.InteropServices.Marshal]::GetActiveObject($progId);
       $oPatient = $app.Praxisgemeinschaft().PatientMitNummer(${id})
       $datei = $oPatient.Karteikarte().Zeilen().Item(${index}).Eintrag().DateiLinkPfad()
       $file = $datei
       [System.GC]::Collect()
    }
    catch [System.Runtime.InteropServices.COMException] {
      $file = $datei
      [System.GC]::Collect()
    }
    echo $file;
  `
  try {
    const query = await ps.invoke(cmd)
    return query.raw
  } catch (e) {
    return null
  }
}

const readWriteFile = async (inPath: string, id: string, index: number) => {
  try {
    const fileBuffer = await readFile(inPath)
    const outputPath = app.getAppPath() + '/temp/export' + '/' + id + '/' + 'files'
    if (!existsSync(outputPath)) {
      mkdirSync(outputPath, { recursive: true })
    }
    await writeFile(outputPath + '/' + path.parse(inPath).base, fileBuffer)
    return '/' + path.parse(inPath).base
  } catch (e) {
    console.log('readWriteFile error', inPath, index)
    return null
  }
}

export const getPatientRow = async (
  id: string,
  index: number,
  turboPath: string,
  render: IpcMainEvent
) => {
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
       $gueltigkeitsZeitpunkt      = $oPatient.Karteikarte().Zeilen().Item(${index}).Properties().Item("gueltigkeitsZeitpunkt")
       echo "{'art': '$art', 'id': '$id','gueltigkeitsZeitpunkt': '$gueltigkeitsZeitpunkt', 'eintrag': '$eintrag', 'lastChange': '$lastChange', 'created': '$created', 'autor': '$autor' }";
       [System.GC]::Collect()
    }
    catch [System.Runtime.InteropServices.COMException] {
      echo null;
      [System.GC]::Collect()
    }
  `
  try {
    let newPath: null | string | undefined = undefined
    let filePath = await getFileIfExists(id, index)
    newPath = filePath
    if (filePath) {
      if (filePath.startsWith('$')) {
        filePath = filePath.replaceAll('$\\TurboMed', turboPath)
      }
      newPath = await readWriteFile(filePath, id, index)
    } else {
      newPath = null
    }

    const res = await ps.invoke(cmd)
    render.sender.send('onProgressChanged', index)
    console.log(res.raw.replaceAll("'", '"'))
    if (res.raw === 'null') return null
    const parsedRow = JSON.parse(res.raw.replaceAll("'", '"').replace(/(\r\n|\n|\r)/gm, ''))
    render.sender.send('onLogs', `${parsedRow.id}: Fertig`)
    return { ...parsedRow, filePath: newPath, originPath: filePath }
  } catch (e) {
    console.log(e)
    return { error: '(Aktiver Patient da?)' }
  }
}

export const setPatientRow = async (
  id: String,
  row: Patient['rows'][0],
  index: number,
  render: IpcMainEvent
) => {
  const { art, eintrag, lastChange, created, autor, gueltigkeitsZeitpunkt } = row
  const cmd = PowerShell.command`
   [console]::OutputEncoding = New-Object System.Text.UTF8Encoding
   $progId = 'TMMain.Application';
    try {
       $app = [System.Runtime.InteropServices.Marshal]::GetActiveObject($progId);
       $row = $app.Praxisgemeinschaft().PatientMitNummer(${id}).Karteikarte().NeuerTextEintrag(${autor},${eintrag})
       $row.Properties().Item("iD") = ${art}
       $row.EnthalteneZeile().Properties().Item("erstellungsZeitpunkt") = ${created}
       $row.EnthalteneZeile().Properties().Item("letzteAenderungZeitpunkt") = ${lastChange}
       $row.EnthalteneZeile().Properties().Item("gueltigkeitsZeitpunkt") = ${gueltigkeitsZeitpunkt}
       echo $row.PublicId()
       [System.GC]::Collect()
    }
    catch [System.Runtime.InteropServices.COMException] {
      echo false
      [System.GC]::Collect()
    }
  `

  try {
    const res = await ps.invoke(cmd)
    render.sender.send('onProgressChanged', index)
    if (res.raw === 'null') return null
    return JSON.parse(res.raw.replaceAll("'", '"'))
  } catch (e) {
    console.log(e)
    return null
  }
}
export const importToTurbomedById = async (id: string, data: Patient, render: IpcMainEvent) => {
  try {
    const mutateRows = data.rows.map((row, index) => setPatientRow(id, row, index, render))
    render.sender.send('setProgress', data.rows.length)

    const res = await Promise.all(mutateRows)
    console.log({ res })
  } catch (e) {
    console.log(e)
  }
}
