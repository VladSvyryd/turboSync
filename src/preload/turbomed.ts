import { PowerShell } from 'node-powershell'
import * as winax from 'winax'
const executeOn = async (powershellCommand: string) => {
  const ps = new PowerShell()
  try {
    const res = await ps.invoke(powershellCommand)
    return { data: JSON.parse(res.raw.replaceAll("'", '"')) }
  } catch (error) {
    const err = error as any
    return { error: err?.message ?? error }
  } finally {
    await ps.dispose()
  }
}
export async function getActivePatient() {
  const isOnlineAndWithActivePatient = await getTurbomedIsOn()
  if (isOnlineAndWithActivePatient?.data?.error)
    return {
      error: `(Turbomed aus/Aktiver Patient da?)\n${isOnlineAndWithActivePatient?.data?.error}`
    }

  const cmd = PowerShell.command`
                [console]::OutputEncoding = New-Object System.Text.UTF8Encoding
                $progId = 'TMMain.Application';
                try {
                  $app            = [System.Runtime.InteropServices.Marshal]::GetActiveObject($progId)
                  $oPatient       = $app.AktiverPatient()
                  $nummer         = $oPatient.Nummer()
                  $namensdaten    = $oPatient.Namensdaten()
                  $geburtsdaten   = $oPatient.Geburtsdaten()
                  $vorname        = $namensdaten.Vorname()
                  $nachname       = $namensdaten.Nachname()
                  $adressdaten    = $oPatient.Adressdaten().Postanschrift("Privat", 1)
                  $ort            = $adressdaten.Ort()
                  $plz            = $adressdaten.Postleitzahl()
                  $strasse        = $adressdaten.Strasse()
                  $hausnummer     = $adressdaten.Hausnummer()
                  $geburtstag     = $geburtsdaten.datum()
                  $geschlecht     = $geburtsdaten.geschlecht()
                  $json          +=
                  "{'id': '$nummer',
                    'firstName': '$vorname',
                    'secondName': '$nachname',
                    'city': '$ort',
                    'zip': '$plz',
                    'street': '$strasse',
                    'houseNumber': '$hausnummer',
                    'birthday': '$geburtstag',
                    'gender': '$geschlecht'
                  }"
                  echo $json;
                  [System.GC]::Collect()
                }
                catch [System.Runtime.InteropServices.COMException] {
                  echo "{'error':'$_.Exception.Message'}";
                  [System.GC]::Collect()
                }

            `
  return await executeOn(cmd)
}

export const getTurbomed = () => {
  try {
    const app = new winax.Object('TMMain.Application', { activate: true })
    console.log(app)
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
      id: nummer,
      firstName: vorname,
      secondName: nachname,
      city: ort,
      zip: plz,
      street: strasse,
      houseNumber: hausnummer,
      birthday: geburtstag,
      gender: geschlecht
    }
    return patient
  } catch (e) {
    return undefined
    console.log(e)
  }
}

export async function getTurbomedIsOn() {
  const cmd = PowerShell.command`
   $progId = 'TMMain.Application';
    try {
       $app = [System.Runtime.InteropServices.Marshal]::GetActiveObject($progId);
       $p = $app.AktiverPatient()
       $nummer = $p.Nummer()
       echo "{'id':$nummer}";
       [System.GC]::Collect()
    }
    catch [System.Runtime.InteropServices.COMException] {
      echo "{'error':'$_.Exception.Message'}";
      [System.GC]::Collect()
    }
`
  return await executeOn(cmd)
}
