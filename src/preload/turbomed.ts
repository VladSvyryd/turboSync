import * as winax from 'winax'

const Turbomed = new winax.Object('TMMain.Application', { activate: true })

export async function getActivePatient() {
  const isOnlineAndWithActivePatient = await getTurbomedIsOn()
  if (isOnlineAndWithActivePatient?.error)
    return {
      error: `(Turbomed aus/Aktiver Patient da?)\n${isOnlineAndWithActivePatient?.error}`
    }

  return getCurrentPatient()
}

export async function getTurbomedIsOn() {
  const app = Turbomed
  try {
    const oPatient = app.AktiverPatient()
    const nummer = oPatient.Nummer()
    return { id: nummer }
  } catch (e: any) {
    return { error: e?.message ?? 'Turbomed Error' }
  }
}

export const getCurrentPatient = async () => {
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
    // winax.release(Turbomed)
    return { error: 'ERROR' }
  }
}
