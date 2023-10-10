import { FunctionComponent } from 'react'
import { Divider, Stack } from '@chakra-ui/react'
import DocList from '../../container/Template/DocList'
import DocFolderTitle from './DocFolderTitle'
import { DocFile, SignType } from '../../types'

interface OwnProps {
  folders: Array<{ name: SignType; files: Array<DocFile> }>
  loading: boolean
  onInteractionWithList: () => void
}

type Props = OwnProps

const FolderOrder = [SignType.LINK, SignType.SIGNPAD, SignType.PRINT]

const DocFolders: FunctionComponent<Props> = ({ onInteractionWithList, folders, loading }) => {
  return folders
    .sort(
      (a, b) => FolderOrder.indexOf(a.name as SignType) - FolderOrder.indexOf(b.name as SignType)
    )
    .map((folder) => (
      <Stack key={folder.name} py={2}>
        <DocFolderTitle title={folder.name} />
        <DocList
          listId={folder.name}
          onInteractionWithList={onInteractionWithList}
          files={folder.files}
          loading={loading}
        />
        <Divider />
      </Stack>
    ))
}

export default DocFolders
