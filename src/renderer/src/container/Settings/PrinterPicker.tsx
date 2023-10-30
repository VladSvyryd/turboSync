import { FunctionComponent, useEffect, useState } from 'react'
import PrinterSelectForm from '../../components/Forms/PrinterSelectForm'
import { Button, Divider, Heading, Stack, Text, useToast } from '@chakra-ui/react'
import { useSettingsStore } from '../../store'
import { getTestPrintFile } from '../../api'

interface OwnProps {}

type Props = OwnProps

const PrinterPicker: FunctionComponent<Props> = ({}) => {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [printLoading, setPrintLoading] = useState(false)
  // const { data } = useSWR<Array<string>>('getPrinters', a, {})
  // console.log(data)
  const [printers, setPrinters] = useState<Array<Electron.PrinterInfo>>([])
  const { defaultPrinter, setDefaultPrinter, apiBaseUrl } = useSettingsStore()
  console.log(Boolean(apiBaseUrl))

  const retrievePrinters = async () => {
    setLoading(true)
    try {
      const p = await window.api.getPrinters()
      setPrinters(p)
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
    setPrintLoading(true)

    const printFile = await getTestPrintFile()
    console.log({ printFile })
    if (!printFile?.path || !defaultPrinter) {
      toast({
        title: 'Drucker',
        description: 'Drucker wurden nicht erfolgreich abgerufen.'
      })
      return
    }
    try {
      const printResult = await window.api.printFileByPath({
        path: printFile?.path,
        defaultPrinter: defaultPrinter.name
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
      <Heading size={'sm'}>Drucker</Heading>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        flexWrap={'nowrap'}
      >
        <Stack direction={'row'} alignItems={'center'}>
          <Text>Standard Drucker:</Text>
          <Text fontStyle={'italic'} color={!defaultPrinter ? 'red.400' : 'initial'}>
            {defaultPrinter ? defaultPrinter.displayName : 'Nicht ausgewählt'}
          </Text>
          <Button
            isDisabled={printLoading || !defaultPrinter}
            isLoading={printLoading}
            size={'sm'}
            loadingText={'Druckt...'}
            onClick={handlePrintTestFile}
          >
            Test Print
          </Button>
        </Stack>
        <PrinterSelectForm
          defaultPrinter={defaultPrinter}
          list={printers}
          onChange={(printer) => {
            setDefaultPrinter(printer)
          }}
          loading={loading}
        />
      </Stack>
      <Divider />
    </Stack>
  )
}

export default PrinterPicker
