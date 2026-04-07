import { google } from 'googleapis'

function getAuth() {
  const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!)
  return new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

export async function getSheetTabs(sheetId: string): Promise<string[]> {
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  const res = await sheets.spreadsheets.get({ spreadsheetId: sheetId })
  return (
    res.data.sheets
      ?.map(s => s.properties?.title ?? '')
      .filter(Boolean) ?? []
  )
}

export async function getSheetData(sheetId: string, tabName: string): Promise<string[][]> {
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `'${tabName}'`,
  })
  return (res.data.values ?? []) as string[][]
}

export async function writeCell(
  sheetId: string,
  tabName: string,
  cell: string,
  value: string,
): Promise<void> {
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `'${tabName}'!${cell}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[value]] },
  })
}
