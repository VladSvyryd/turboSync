import { FunctionComponent } from 'react'
import { Divider, Stack } from '@chakra-ui/react'
import DocList from '../../container/Template/DocList'
import DocFolderTitle from './DocFolderTitle'
import { ResponseFolder, SignType } from '../../types'

interface OwnProps {
  folders: Array<ResponseFolder>
  loading: boolean
}

type Props = OwnProps

const FolderOrder = [SignType.LINK, SignType.SIGNPAD, SignType.PRINT]

const DocFolders: FunctionComponent<Props> = ({ folders, loading }) => {
  return folders
    .sort((a, b) => FolderOrder.indexOf(a.signType) - FolderOrder.indexOf(b.signType))
    .map((folder) => (
      <Stack key={folder.signType} py={2}>
        <DocFolderTitle title={folder.signType} />
        <DocList listId={folder.signType} files={folder.templates} loading={loading} />
        <Divider />
      </Stack>
    ))
}

export default DocFolders
