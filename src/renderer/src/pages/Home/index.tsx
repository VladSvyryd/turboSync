import { FunctionComponent } from 'react'
// import Versions from "../../components/Versions";

import imgUrl from '../../assets/home.svg'
interface OwnProps {}

type Props = OwnProps

const index: FunctionComponent<Props> = () => {
  return (
    <div className="" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/*<Versions></Versions>*/}

      <button
        onClick={async () => {
          // window.api.ping()
          // const res =  await window.api.getActivePatient()
          //  console.log(res)
          window.api.open()
        }}
        style={{
          maxWidth: 300
          // margin:10
        }}
      >
        <img src={imgUrl} alt={'home'} style={{ width: '100%', height: 'auto' }} />
      </button>
    </div>
  )
}

export default index
