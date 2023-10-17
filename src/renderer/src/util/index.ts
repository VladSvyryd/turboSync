import { SignType } from '../types'

export const getBlurColorBySignType = (signType: SignType | null | undefined) => {
  switch (signType) {
    case SignType.LINK: {
      const r = 245
      const g = 101
      const b = 101
      return {
        bg: `rgba(${r}, ${g}, ${b},0.12)}`,
        boxShadow: `rgba(${r}, ${g}, ${b},0.1) 0px 0px 0px 1px,rgba(${r}, ${g}, ${b},0.2) 0px 5px 10px,rgba(${r}, ${g}, ${b},0.4) 0px 0px 30px;`
      }
    }
    case SignType.SIGNPAD: {
      const r = 237
      const g = 137
      const b = 54
      return {
        bg: `rgba(${r}, ${g}, ${b},0.12)`,
        boxShadow: `rgba(${r}, ${g}, ${b},0.1) 0px 0px 0px 1px,rgba(${r}, ${g}, ${b},0.2) 0px 5px 10px,rgba(${r}, ${g}, ${b},0.4) 0px 0px 30px;`
      }
    }
    default:
      const r = 72
      const g = 187
      const b = 120
      return {
        bg: `rgba(${r}, ${g}, ${b},0.12)`,
        boxShadow: `rgba(${r}, ${g}, ${b},0.1) 0px 0px 0px 1px,rgba(${r}, ${g}, ${b},0.2) 0px 5px 10px,rgba(${r}, ${g}, ${b},0.4) 0px 0px 30px;`
      }
  }
}

export const templateTitleIsValid = (title: string) => {
  return String(title).trim().length !== 0
}
