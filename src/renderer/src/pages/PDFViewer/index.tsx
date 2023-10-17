import { FunctionComponent, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { deleteTemplatePdfPreview } from '../../api'

interface OwnProps {}

type Props = OwnProps

const index: FunctionComponent<Props> = ({}) => {
  const [searchParams] = useSearchParams()
  const path = searchParams.get('path') ?? '404'

  useEffect(() => {
    // get event from MainProcess about closing the window and execute the delete PDF Preview
    window.api.onPDFWindowClose(() => {
      deleteTemplatePdfPreview(path)
    })
  }, [])
  return (
    <>
      <webview style={{ width: '100%', height: '100%' }} src={path} />
    </>
  )
}

export default index
