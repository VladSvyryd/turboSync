import { FunctionComponent, ReactElement, useRef, useState } from 'react'
import {
  Button,
  List,
  ListItem,
  PlacementWithLogical,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text
} from '@chakra-ui/react'
import { SiGoogledocs } from 'react-icons/si'
import { FaChevronRight } from 'react-icons/fa'
import { ContextMenu } from './ListButton'

interface OwnProps {
  title: string
  onClick?: (title: string, onClickCallback: () => void) => void
  loading: boolean
  contextMenuLinks: ContextMenu
  placement?: PlacementWithLogical
  leftIcon?: ReactElement
  rightIcon?: ReactElement
}

type Props = OwnProps

const ListButton: FunctionComponent<Props> = ({
  title,
  loading,
  contextMenuLinks,
  leftIcon,
  rightIcon,
  placement
}) => {
  const [contextMenu, setContextMenu] = useState<string | null>(null)

  const initialFocusRef = useRef<any>()
  const handleClose = () => {
    setContextMenu(null)
  }

  return (
    <Popover
      isOpen={Boolean(contextMenu === title)}
      onClose={handleClose}
      placement={placement}
      initialFocusRef={initialFocusRef}
      offset={[0, 0]}
    >
      <PopoverTrigger>
        <Button
          onClick={() => setContextMenu(title)}
          leftIcon={leftIcon ?? <SiGoogledocs />}
          justifyContent={'start'}
          borderRadius={0}
          isDisabled={loading}
          isLoading={loading}
          loadingText={`${title} (in Arbeit)`}
          isActive={Boolean(contextMenu === title)}
          rightIcon={rightIcon}
          colorScheme={'teal'}
        >
          <Text noOfLines={1}>{title}</Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sx={{
          zIndex: 2,
          width: 150
        }}
      >
        <List>
          {contextMenuLinks.map((link) => (
            <ListItem key={link.title}>
              <Button
                onClick={() => {
                  if (link.onClick) link.onClick(link.title, handleClose)
                }}
                ref={initialFocusRef}
                w={150}
                justifyContent={'start'}
                borderRadius={0}
                loadingText={`${title} (in Arbeit)`}
                leftIcon={link.leftIcon}
                rightIcon={link.contextMenuLinks ? <FaChevronRight /> : undefined}
                color={'teal.600'}
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
