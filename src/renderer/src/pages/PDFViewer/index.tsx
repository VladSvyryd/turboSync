import { FunctionComponent } from 'react'
import { useSearchParams } from 'react-router-dom'

interface OwnProps {}

type Props = OwnProps

const index: FunctionComponent<Props> = ({}) => {
  const [searchParams] = useSearchParams()
  const path = searchParams.get('path') ?? '404'

  return (
    <>
      <webview style={{ width: '100%', height: '100%' }} src={path} />
    </>
  )
}

export default index
