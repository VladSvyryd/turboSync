import { FunctionComponent } from 'react'
import {
  Heading,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack
} from '@chakra-ui/react'
import { FaInfo } from 'react-icons/fa'
import { SignType } from '../../types'
import { useListStore } from '../../store/ListStore'

interface OwnProps {
  title: SignType
}

type Props = OwnProps

const explanations: { [key in SignType]: string } = {
  [SignType.LINK]:
    'Dieses Dokument kann per E-Mail-Link unterschrieben werden. Höchste Beschränkungsstufe.',

  [SignType.SIGNPAD]:
    'Dieses Dokument kann mit SignPad oder Link (QR-Code) unterzeichnet werden. Mittlere Beschränkungsstufe.',

  [SignType.PRINT]:
    'Dieses Dokument kann sowohl mit SignPad, als auch per Link (QR-Code) und ausgedruckt unterschrieben werden.' +
    ' Niedrigste' +
    ' Beschränkungsstufe.'
}

const DocFolderTitle: FunctionComponent<Props> = ({ title }) => {
  const { titles, setActiveTitle, activeTitle, changeTitle } = useListStore()
  const handleChangeName = (v: string) => {
    const castV = v as SignType
    changeTitle(title, castV)
    setActiveTitle(null)
  }
  return (
    <Stack flexDir={'row'} alignItems={'center'} justifyContent={'space-between'} px={4}>
      {title !== activeTitle ? (
        <Heading size={'10px'} onClick={() => setActiveTitle(title)}>
          {titles[title]}
        </Heading>
      ) : (
        <Input
          autoFocus
          size={'xs'}
          defaultValue={titles[activeTitle]}
          onBlur={(e) => {
            handleChangeName(e.target.value)
          }}
        />
      )}
      <Popover>
        <PopoverTrigger>
          <IconButton
            isRound={true}
            variant="solid"
            colorScheme="teal"
            aria-label="Done"
            fontSize="10px"
            sx={{ width: 17, height: 17 }}
            icon={<FaInfo />}
          />
        </PopoverTrigger>
        <PopoverContent bg="teal.500" color={'white'}>
          <PopoverArrow bg={'teal.500'} />
          <PopoverCloseButton />
          <PopoverHeader>Hilfe</PopoverHeader>
          <PopoverBody>{explanations[title as SignType]}</PopoverBody>
        </PopoverContent>
      </Popover>
    </Stack>
  )
}

export default DocFolderTitle
