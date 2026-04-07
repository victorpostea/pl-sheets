describe('verifyPin', () => {
  beforeEach(() => {
    process.env.USER_1_NAME = 'Victor'
    process.env.USER_1_PIN = '1738'
    process.env.USER_1_SHEET_ID = 'sheet-id-victor'
    process.env.USER_2_NAME = 'Anthony'
    process.env.USER_2_PIN = '0009'
    process.env.USER_2_SHEET_ID = 'sheet-id-anthony'
  })

  it('returns Victor for PIN 1738', () => {
    const { verifyPin } = require('@/lib/auth')
    const user = verifyPin('1738')
    expect(user).toEqual({ name: 'Victor', sheetId: 'sheet-id-victor' })
  })

  it('returns Anthony for PIN 0009', () => {
    const { verifyPin } = require('@/lib/auth')
    const user = verifyPin('0009')
    expect(user).toEqual({ name: 'Anthony', sheetId: 'sheet-id-anthony' })
  })

  it('returns null for wrong PIN', () => {
    const { verifyPin } = require('@/lib/auth')
    expect(verifyPin('0000')).toBeNull()
  })

  it('returns null for partial match', () => {
    const { verifyPin } = require('@/lib/auth')
    expect(verifyPin('173')).toBeNull()
  })
})
