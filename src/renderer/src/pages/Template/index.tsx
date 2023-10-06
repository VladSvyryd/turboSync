import { FunctionComponent, MouseEventHandler, useRef, useState } from 'react'
import {
  Box,
  Button,
  List,
  ListItem,
  Modal,
  ModalContent,
  ModalOverlay,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  ScaleFade,
  Spinner,
  Stack,
  useToast
} from '@chakra-ui/react'
import { SiGoogledocs } from 'react-icons/si'
import useSWR from 'swr'
import { fetcherWithQuery } from '../../api'
import Error from '../../components/Alert/Error'
import DnD from '../../components/DnD'

interface OwnProps {}

type Props = OwnProps

const index: FunctionComponent<Props> = () => {
  const toast = useToast()
  const initialFocusRef = useRef<any>()
  const [contextMenu, setContextMenu] = useState<{
    docTitle: string
  } | null>(null)
  const [loadingProcessTemplate, setLoadingProcessTemplate] = useState<null | string>(null)
  const [error, setError] = useState<string | null>(null)
  const url = `http://192.168.185.59:3333/api/templates`
  const { data, isValidating, mutate } = useSWR<{ files: Array<string> }>(url, fetcherWithQuery, {
    onError: (err) => {
      console.log(err)
      toast({
        title: 'Ups! Problem.',
        description: err.message,
        status: 'error'
      })
    }
  })
  const handleContextMenu = (event: MouseEventHandler<HTMLButtonElement>, doc: string) => {
    // event.preventDefault()
    setContextMenu({
      docTitle: doc
    })
  }
  const handleClose = () => {
    setContextMenu(null)
  }
  const handleDocClick = async (docUniqTitle: string) => {
    if (Boolean(loadingProcessTemplate) || Boolean(contextMenu?.docTitle)) return
    try {
      setLoadingProcessTemplate(docUniqTitle)
      const activePatient = await window.api.getActivePatient()
      if (!Boolean(activePatient?.data?.id)) {
        setError(activePatient?.error)
        return
      }
      const processTemplate = await fetch(`http://192.168.185.59:3333/api/processTemplate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...activePatient.data,
          docTitle: docUniqTitle
        })
      })
      console.log('processTemplate', processTemplate)
    } catch (e) {
      console.log(e)
      setError(JSON.stringify(e))
    } finally {
      setLoadingProcessTemplate(null)
    }
  }

  const handleDeleteDoc = async (docUniqTitle: string) => {
    try {
      const deleteTemplate = await fetch(`http://192.168.185.59:3333/api/deleteTemplate`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          docTitle: docUniqTitle
        })
      })

      console.log('deleteTemplate', deleteTemplate)
    } catch (e) {
      console.log(e)
      setError(JSON.stringify(e))
    } finally {
      await mutate()
      handleClose()
    }
  }

  if (isValidating && !data) {
    return <Progress size="xs" isIndeterminate />
  }
  return (
    <>
      <Modal
        isCentered
        isOpen={Boolean(error)}
        onClose={() => {
          setError(null)
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <Error
            cause={'Sind Sie sicher, dass Turbomed an ist und einen Patient ausgewählt ist?'}
            moreInfo={error}
          />
        </ModalContent>
      </Modal>
      <DnD files={data?.files ?? []}>
        {Boolean(contextMenu?.docTitle) && (
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
        <List sx={{ py: 2 }} spacing={1}>
          {data?.files?.map((title) => (
            <ListItem key={title}>
              <Popover
                isOpen={Boolean(contextMenu?.docTitle === title)}
                onClose={handleClose}
                placement="bottom"
                initialFocusRef={initialFocusRef}
              >
                <PopoverTrigger>
                  <Button
                    onContextMenu={(e) => handleContextMenu(e, title)}
                    onClick={() => handleDocClick(title)}
                    leftIcon={<SiGoogledocs />}
                    w={'100%'}
                    justifyContent={'start'}
                    borderRadius={0}
                    isDisabled={Boolean(loadingProcessTemplate)}
                    isLoading={loadingProcessTemplate === title}
                    loadingText={`${title} (in Arbeit)`}
                    isActive={Boolean(contextMenu?.docTitle === title)}
                  >
                    {title}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  sx={{
                    zIndex: 2,
                    width: 150
                  }}
                >
                  <List spacing={1}>
                    <ListItem>
                      <Button
                        onClick={async () => {
                          await handleDeleteDoc(title)
                        }}
                        ref={initialFocusRef}
                        w={150}
                        justifyContent={'start'}
                        borderRadius={0}
                        isDisabled={Boolean(loadingProcessTemplate)}
                        isLoading={loadingProcessTemplate === title}
                        loadingText={`${title} (in Arbeit)`}
                      >
                        {'Löschen'}
                      </Button>
                    </ListItem>
                  </List>
                </PopoverContent>
              </Popover>
            </ListItem>
          ))}
          <Stack alignItems={'center'}>
            <ScaleFade
              initialScale={0.3}
              in={Boolean(isValidating && data)}
              transition={{
                enter: {
                  type: 'spring'
                }
              }}
            >
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </ScaleFade>
          </Stack>
        </List>
      </DnD>
    </>
  )
}

export default index
