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
import { GrScan } from 'react-icons/gr'

interface OwnProps {
  list: Array<string>
  onChange: (scanned: string) => void
  loading: boolean
  defaultValue: string | null
}

type Props = OwnProps

const ScannerSelectForm: FunctionComponent<Props> = ({ list, defaultValue, loading, onChange }) => {
  return (
    <>
      <Menu isLazy placement={'bottom-end'}>
        <MenuButton
          size={'sm'}
          as={IconButton}
          icon={
            <Stack pos={'relative'}>
              {loading && (
                <Box pos={'absolute'} top={-2} right={-1.5}>
                  <Spinner color={'teal'} size={'lg'} />
                </Box>
              )}
              <GrScan fontSize="1.2rem" />
            </Stack>
          }
        />
        <MenuList>
          <MenuOptionGroup
            value={defaultValue ?? 'Kein Sanner'}
            onChange={(v) => {
              const active = list.find((l) => l === v)
              if (active) onChange(active)
            }}
            title="Kein Scanner"
            type="radio"
          >
            {list.map((listItem) => (
              <MenuItemOption
                key={listItem}
                value={listItem}
                bg={listItem === defaultValue ? 'teal.50' : 'initial'}
                minH="48px"
              >
                <Stack>
                  <Stack direction={'row'}>
                    <Avatar
                      size={'sm'}
                      // bg="gray.300"
                      sx={{
                        path: {
                          stroke: 'white'
                        }
                      }}
                      icon={<GrScan fontSize="1.2rem" />}
                    >
                      <AvatarBadge boxSize="0.8rem" bg={'green.400'} />
                    </Avatar>
                    <Stack gap={0}>
                      <Text fontSize={'sm'}>{listItem}</Text>
                      <Text fontSize={'xs'}>{'Bereit'}</Text>
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

export default ScannerSelectForm
