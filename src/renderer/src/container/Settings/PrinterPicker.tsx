import { FunctionComponent, useEffect, useState } from 'react'
import PrinterSelectForm from '../../components/Forms/PrinterSelectForm'
import { Button, Divider, Heading, Stack, Text, useToast } from '@chakra-ui/react'
import { useSettingsStore } from '../../store'
import useSWR from 'swr'
import { fetchPrintTextPath } from '../../types/variables'
import { fetcherQuery } from '../../api'

interface OwnProps {}

type Props = OwnProps

const PrinterPicker: FunctionComponent<Props> = ({}) => {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [printLoading, setPrintLoading] = useState(false)
  // const { data } = useSWR<Array<string>>('getPrinters', a, {})
  // console.log(data)
  const [printers, setPrinters] = useState<Array<Electron.PrinterInfo>>([])
  const { defaultPrinter, setDefaultPrinter } = useSettingsStore()
  const { data } = useSWR<{
    path: string
  }>(fetchPrintTextPath, fetcherQuery, {
    focusThrottleInterval: 0,
    onError: (err) => {
      console.log(err)
      toast({
        description: `Fehler beim Abrufen der Daten. (${err.message})`
      })
    }
  })
  const retrievePrinters = () => {
    setLoading(true)
    window.api.getPrinters()
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
            disabled={printLoading || !defaultPrinter}
            isDisabled={printLoading}
            isLoading={printLoading}
            size={'sm'}
            loadingText={'Druckt...'}
            onClick={() => {
              console.log({ data })
              if (data?.path && defaultPrinter)
                window.api.printFile({
                  path: data?.path,
                  defaultPrinter: defaultPrinter.name
                })
              setPrintLoading(true)
            }}
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
