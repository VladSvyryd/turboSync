import { FunctionComponent, useRef, useState } from 'react'
import {
  Box,
  Button,
  List,
  ListItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text
} from '@chakra-ui/react'
import { SiGoogledocs } from 'react-icons/si'

interface OwnProps {
  title: string
  onClick: (title: string) => void
  loading: boolean
  contextMenuLinks: Array<{ title: string; onClick: () => void }>
}

type Props = OwnProps

const ListButton: FunctionComponent<Props> = ({ title, onClick, loading, contextMenuLinks }) => {
  const initialFocusRef = useRef<any>()
  const [contextMenu, setContextMenu] = useState<string | null>(null)
  const handleClose = () => {
    setContextMenu(null)
  }
  const handleContextMenu = (doc: string) => {
    setContextMenu(doc)
  }
  return (
    <Popover
      isOpen={Boolean(contextMenu === title)}
      onClose={handleClose}
      placement="bottom"
      initialFocusRef={initialFocusRef}
    >
      <PopoverTrigger>
        <Button
          variant={'ghost'}
          onContextMenu={() => handleContextMenu(title)}
          onClick={() => onClick(title)}
          leftIcon={<SiGoogledocs />}
          w={'100%'}
          justifyContent={'start'}
          borderRadius={0}
          isDisabled={loading}
          isLoading={loading}
          loadingText={`${title} (in Arbeit)`}
          isActive={Boolean(contextMenu === title)}
        >
          <Text noOfLines={1}>{title}</Text>
        </Button>
      </PopoverTrigger>
      {Boolean(contextMenu === title) && (
        <Box
          pos={'absolute'}
          top={0}
          left={0}
          width={'100%'}
          height={'100%'}
          // bg="blackAlpha.100"
          backdropFilter="blur(1px)"
          zIndex={1}
          onClick={handleClose}
        />
      )}
      <PopoverContent
        sx={{
          zIndex: 2,
          width: 150
        }}
      >
        <List spacing={1}>
          {contextMenuLinks.map((link) => (
            <ListItem key={link.title}>
              <Button
                onClick={link.onClick}
                ref={initialFocusRef}
                w={150}
                justifyContent={'start'}
                borderRadius={0}
                loadingText={`${title} (in Arbeit)`}
              >
                {link.title}
              </Button>
            </ListItem>
          ))}
        </List>
      </PopoverContent>
    </Popover>
  )
}

export default ListButton
