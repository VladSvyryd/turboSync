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

  const retrievePrinters = () => {
    setLoading(true)
    window.api.getPrinters()
  }

  const handlePrintTestFile = async () => {
    const printFile = await getTestPrintFile()
    console.log({ printFile })
    if (printFile?.path && defaultPrinter)
      window.api.printFile({
        path: printFile?.path,
        defaultPrinter: defaultPrinter.name
      })
    setPrintLoading(true)
  }

  useEffect(() => {
    const wait = setTimeout(() => {
      setLoading(false)
      toast({
        title: 'Drucker',
        description: 'Drucker wurden nicht erfolgreich abgerufen.'
      })
    }, 6000)
    window.api.onReceivePrinters((_, list) => {
      setPrinters(list)
      setLoading(false)
      clearTimeout(wait)
    })
    window.api.onPrintFileResult((_, res) => {
      console.log({ res })
      if (!res?.printFile) {
        toast({
          description: `Fehler beim Drucken.`
        })
      }
      setPrintLoading(false)
    })
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
