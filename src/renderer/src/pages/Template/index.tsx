import { FunctionComponent, useState } from 'react'
import {
  Button,
  List,
  ListItem,
  Modal,
  ModalContent,
  ModalOverlay,
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
interface OwnProps {}

type Props = OwnProps

const index: FunctionComponent<Props> = () => {
  const toast = useToast()
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

  const handleDocClick = async (docUniqTitle: string) => {
    try {
      setLoadingProcessTemplate(docUniqTitle)
      const activePatient = await window.api.getActivePatient()
      console.log(activePatient?.data?.id, !Boolean(activePatient?.data?.id))
      if (!Boolean(activePatient?.data?.id)) {
        setError(activePatient?.error)
        return
      }
      // const processTemplate = await fetcherWithQuery(
      //   `http://192.168.185.59:3333/api/processTemplate`,
      //   {
      //     method: 'POST',
      //     body: JSON.stringify({
      //       ...activePatient?.data,
      //       docTitle: docUniqTitle
      //     })
      //   }
      // )
      // console.log('processTemplate', processTemplate)
    } catch (e) {
      console.log(e)
      setError(JSON.stringify(e))
    } finally {
      setLoadingProcessTemplate(null)
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
      <List sx={{ py: 2 }} spacing={1}>
        {data?.files?.map((title) => (
          <ListItem key={title}>
            <Button
              onClick={() => handleDocClick(title)}
              leftIcon={<SiGoogledocs />}
              w={'100%'}
              justifyContent={'start'}
              borderRadius={0}
              disabled={Boolean(loadingProcessTemplate)}
              isLoading={loadingProcessTemplate === title}
              loadingText={`${title} (in Arbeit)`}
            >
              {title}
            </Button>
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
        <Button onClick={() => mutate()}>CLICK</Button>
      </List>
    </>
  )
}

export default index
