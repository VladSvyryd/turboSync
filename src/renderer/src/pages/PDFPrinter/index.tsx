import { FunctionComponent, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

interface OwnProps {}

type Props = OwnProps

const index: FunctionComponent<Props> = ({}) => {
  const [searchParams] = useSearchParams()
  const path = searchParams.get('path') ?? '404'
  const printRef = useRef<any>()

  useEffect(() => {}, [])
  return (
    <div ref={printRef}>
      <p>HTML</p>
      <webview style={{ width: '100%', height: '100%' }} src={path} />
      <iframe style={{ width: '100%', height: '100%' }} src={path} />
    </div>
  )
}

export default index
