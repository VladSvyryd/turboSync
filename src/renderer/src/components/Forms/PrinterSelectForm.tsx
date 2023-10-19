import { FunctionComponent } from 'react'
import {
  Avatar,
  AvatarBadge,
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Spinner,
  Stack,
  Text
} from '@chakra-ui/react'
import { BsPrinterFill } from 'react-icons/bs'
import { decodePrinterStatus, PrinterStatus } from '../../util'

interface OwnProps {
  list: Array<Electron.PrinterInfo>
  onChange: (template: Electron.PrinterInfo) => void
  loading: boolean
  defaultPrinter: Electron.PrinterInfo | null
}

type Props = OwnProps

const PrinterSelectForm: FunctionComponent<Props> = ({
  list,
  defaultPrinter,
  loading,
  onChange
}) => {
  const renderColor = (status: PrinterStatus) => {
    if (status === PrinterStatus.ERROR) {
      return 'red.400'
    }
    if (status === PrinterStatus.OFF || status === PrinterStatus.OFFLINE) {
      return 'orange.400'
    }
    return 'green.400'
  }

  return (
    <>
      <Menu isLazy placement={'bottom-start'}>
        <MenuButton
          as={IconButton}
          icon={
            <Stack pos={'relative'}>
              {loading && (
                <Box pos={'absolute'} top={-2} right={-1.5}>
                  <Spinner color={'teal'} size={'lg'} />
                </Box>
              )}
              <BsPrinterFill fontSize="1.2rem" />
            </Stack>
          }
        />
        <MenuList>
          <MenuOptionGroup
            value={defaultPrinter?.name}
            onChange={(v) => {
              const active = list.find((l) => l.name === v)
              if (active) onChange(active)
            }}
            title="Kein Drucker"
            type="radio"
          >
            {list.map((printer) => (
              <MenuItemOption
                value={printer.name}
                bg={printer.name == defaultPrinter?.name ? 'teal.50' : 'initial'}
                minH="48px"
              >
                <Stack>
                  <Stack direction={'row'}>
                    <Avatar size={'sm'} icon={<BsPrinterFill fontSize="1.2rem" />}>
                      <AvatarBadge boxSize="0.8rem" bg={renderColor(printer.status)} />
                    </Avatar>
                    <Stack gap={0}>
                      <Text fontSize={'sm'}>{printer.displayName}</Text>
                      <Text fontSize={'xs'}>{`${decodePrinterStatus(printer.status)}${
                        printer.isDefault ? ' (Standard)' : ''
                      }`}</Text>
                    </Stack>
                  </Stack>
                </Stack>
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </>
  )
}

export default PrinterSelectForm
