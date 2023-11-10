import { FunctionComponent, useEffect, useState } from 'react'
import { Button, Divider, Heading, Stack, Text, useToast } from '@chakra-ui/react'
import { useSettingsStore } from '../../store'
import { getTestPrintFile } from '../../api'
import ScannerSelectForm from '../../components/Forms/ScannerSelectForm'
interface OwnProps {}

type Props = OwnProps

const ScannerPicker: FunctionComponent<Props> = ({}) => {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [printLoading, setPrintLoading] = useState(false)
  // const { data } = useSWR<Array<string>>('getPrinters', a, {})
  // console.log(data)
  const [scanners, setScanners] = useState<Array<{ name: string; deviceId: string }>>([])
  const { defaultScanner, setDefaultScanner, apiBaseUrl } = useSettingsStore()
  console.log(Boolean(apiBaseUrl))

  const retrievePrinters = async () => {
    setLoading(true)
    try {
      const p = await window.api.getScanners()
      console.log({ p })
      setScanners(p)
    } catch (e) {
      toast({
        title: 'Drucker',
        description: 'Drucker wurden nicht erfolgreich abgerufen.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePrintTestFile = async () => {
    return
    setPrintLoading(true)

    const printFile = await getTestPrintFile()
    console.log({ printFile })
    if (!printFile?.path || !defaultScanner) {
      toast({
        title: 'Drucker',
        description: 'Drucker wurden nicht erfolgreich abgerufen.'
      })
      return
    }
    try {
      const printResult = await window.api.printFileByPath({
        path: printFile?.path ?? '',
        defaultPrinter: defaultScanner ?? ''
      })
      if (!printResult?.printFile) {
        toast({
          description: `Fehler beim Drucken.`
        })
        return
      }
      toast({
        status: 'success',
        title: 'Drucker',
        description: 'Druckauftrag wurde erfolgreich gestartet.'
      })
    } catch (e) {
      console.log(e)
      toast({
        description: `Fehler beim Drucken.`
      })
    } finally {
      setPrintLoading(false)
    }
  }

  useEffect(() => {
    retrievePrinters()
  }, [])
  return (
    <Stack px={4}>
      <Stack direction={'row'} spacing={3}>
        <Heading size={'sm'}>Scanner</Heading>
        <Button
          isDisabled={printLoading || !defaultScanner}
          isLoading={printLoading}
          size={'xs'}
          loadingText={'Druckt...'}
          onClick={handlePrintTestFile}
          colorScheme={'cyan'}
        >
          Test Scanner
        </Button>
      </Stack>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        flexWrap={'nowrap'}
      >
        <Stack direction={'row'} alignItems={'center'}>
          <Text>Standard Scanner:</Text>
          <Text fontStyle={'italic'} color={!defaultScanner ? 'red.400' : 'initial'}>
            {defaultScanner ? defaultScanner : 'Nicht ausgewählt'}
          </Text>
        </Stack>
        <ScannerSelectForm
          defaultValue={defaultScanner}
          list={scanners.map((s) => s.name)}
          onChange={(printer) => {
            setDefaultScanner(printer)
          }}
          loading={loading}
        />
      </Stack>
      <Divider />
    </Stack>
  )
}

export default ScannerPicker
