import { FunctionComponent, ReactElement, useRef, useState } from 'react'
import { Box, Button, List, ListItem, Text } from '@chakra-ui/react'
import { SiGoogledocs } from 'react-icons/si'
import { FaChevronRight } from 'react-icons/fa'
import { usePopper } from 'react-popper'
import { VirtualElement } from '@popperjs/core'
import ListButtonWithContext from './ListButtonWithContext'
import { DocFile } from '../../types'

export type ContextMenu = Array<{
  title: string
  onClick: (title: string, handleClose: () => void) => void
  leftIcon?: ReactElement
  rightIcon?: ReactElement
  contextMenuLinks?: ContextMenu
}>
interface OwnProps {
  docFile: DocFile
  onClick: (file: DocFile) => void
  loading: boolean
  contextMenuLinks: ContextMenu
  placement?: 'bottom' | 'end'
  leftIcon?: ReactElement
  rightIcon?: ReactElement
}

type Props = OwnProps
function generateGetBoundingClientRect(x = 0, y = 0) {
  return () => ({
    width: 0,
    height: 0,
    top: y,
    right: x + 75,
    bottom: y,
    left: x + 75
  })
}

const ListButton: FunctionComponent<Props> = ({
  docFile,
  onClick,
  loading,
  contextMenuLinks,
  leftIcon,
  rightIcon
}) => {
  const [referenceElement, setReferenceElement] = useState<
    (VirtualElement & { contextMenu: string }) | null
  >(null)

  const [popperElement, setPopperElement] = useState<any>(null)
  // const [arrowElement, setArrowElement] = useState<any>(null)

  const { styles, attributes } = usePopper(referenceElement, popperElement)
  const initialFocusRef = useRef<any>()
  const handleClose = () => {
    setReferenceElement(null)
  }

  const handleContextMenu = (event: React.MouseEvent, doc: string) => {
    event.preventDefault()
    setReferenceElement({
      contextMenu: doc,
      getBoundingClientRect: generateGetBoundingClientRect(event.clientX, event.clientY) as any
    })
  }
  return (
    <>
      <Button
        variant={'ghost'}
        onContextMenu={(e) => handleContextMenu(e, docFile.name)}
        onClick={() => onClick(docFile)}
        leftIcon={leftIcon ?? <SiGoogledocs />}
        w={'100%'}
        justifyContent={'start'}
        borderRadius={0}
        isDisabled={loading}
        isLoading={loading}
        loadingText={`${docFile.name} (in Arbeit)`}
        isActive={Boolean(referenceElement?.contextMenu === docFile.name)}
        rightIcon={rightIcon}
      >
        <Text noOfLines={1}>{docFile.name}</Text>
      </Button>
      {Boolean(referenceElement?.contextMenu === docFile.name) && (
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
          onContextMenu={handleClose}
        />
      )}

      {Boolean(referenceElement?.contextMenu === docFile.name) && (
        <Box
          ref={setPopperElement}
          zIndex={101}
          bg={'white'}
          style={{ ...styles.popper }}
          {...attributes.popper}
        >
          <List>
            {contextMenuLinks.map((link) =>
              link.contextMenuLinks ? (
                <ListButtonWithContext
                  title={link.title}
                  onClick={() => link.onClick(docFile.name, handleClose)}
                  loading={false}
                  contextMenuLinks={link.contextMenuLinks}
                  placement={'end-start'}
                  leftIcon={link.leftIcon}
                  rightIcon={<FaChevronRight />}
                />
              ) : (
                <ListItem key={link.title}>
                  <Button
                    onClick={() => {
                      if (link.onClick) link.onClick(docFile.name, handleClose)
                    }}
                    width={'100%'}
                    ref={initialFocusRef}
                    justifyContent={'start'}
                    borderRadius={0}
                    loadingText={`${docFile.name} (in Arbeit)`}
                    leftIcon={link.leftIcon}
                    colorScheme={'teal'}
                  >
                    {link.title}
                  </Button>
                </ListItem>
              )
            )}
          </List>
        </Box>
      )}
    </>
  )
}

export default ListButton
