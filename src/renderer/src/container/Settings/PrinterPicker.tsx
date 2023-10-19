import { FunctionComponent, useEffect, useState } from 'react'
import PrinterSelectForm from '../../components/Forms/PrinterSelectForm'
import { Button, Divider, Heading, Stack, Text, useToast } from '@chakra-ui/react'
import { useSettingsStore } from '../../store'

interface OwnProps {}

type Props = OwnProps

const PrinterPicker: FunctionComponent<Props> = ({}) => {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  // const { data } = useSWR<Array<string>>('getPrinters', a, {})
  // console.log(data)
  const [printers, setPrinters] = useState<Array<Electron.PrinterInfo>>([])
  const { defaultPrinter, setDefaultPrinter } = useSettingsStore()
  console.log(printers)
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
        <Stack direction={'row'}>
          <Text>Standard Drucker:</Text>
          <Text fontStyle={'italic'} color={!defaultPrinter ? 'red.400' : 'initial'}>
            {defaultPrinter ? defaultPrinter.displayName : 'Nicht ausgewählt'}
          </Text>
          <Button
            onClick={() => {
              window.api.print('')
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
