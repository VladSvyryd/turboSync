import { FunctionComponent, ReactElement } from 'react'
import { Button, ButtonGroup, IconButton, Stack, Text } from '@chakra-ui/react'

import { Patient } from '../../../types'
import { IoMdPerson } from 'react-icons/io'
import { MdDelete } from 'react-icons/md'

export type ContextMenu = Array<{
  title: string
  onClick: (title: string, handleClose: () => void) => void
  leftIcon?: ReactElement
  rightIcon?: ReactElement
  contextMenuLinks?: ContextMenu
}>
interface OwnProps {
  patient: Patient
  active?: boolean
  onClick: () => void
  loading: boolean
  placement?: 'bottom' | 'end'
  leftIcon?: ReactElement
  rightIcon?: ReactElement
  onDelete?: (p: Patient) => void
}

type Props = OwnProps

const ListButton: FunctionComponent<Props> = ({
  patient,
  onDelete,
  loading,
  leftIcon,
  rightIcon,
  active,
  onClick
}) => {
  // const [arrowElement, setArrowElement] = useState<any>(null)

  const renderButton = () => {
    return (
      <ButtonGroup size="sm" w={'100%'} isAttached variant="outline">
        <Button
          variant={active ? 'solid' : 'ghost'}
          colorScheme={'blue'}
          onClick={onClick}
          leftIcon={leftIcon ?? <IoMdPerson />}
          justifyContent={'start'}
          borderRadius={0}
          isDisabled={loading}
          isLoading={loading}
          // loadingText={`${patient.title} (in Arbeit)`}
          // isActive={Boolean(activeTemplate?.uuid === patient.uuid)}
          rightIcon={rightIcon}
          whiteSpace={'initial'}
          w={'100%'}
          // color={renderColor(patient)}
        >
          <Stack flex={1} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Text textAlign={'left'} flex={1} noOfLines={1}>
              {`${patient.id} - ${patient.firstName} ${patient.secondName}`}
            </Text>
            {/*{(lastDocDate || noData) && (*/}
            {/*  <Stack direction={'row'}>*/}
            {/*    {lastDocDate && (*/}
            {/*      <Text noOfLines={1} fontSize={'xs'} title={`Versendet am ${date}`}>*/}
            {/*        {date}*/}
            {/*      </Text>*/}
            {/*    )}*/}
            {/*    {noData && (*/}
            {/*      <Text noOfLines={1} fontSize={'xs'}>*/}
            {/*        {noData}*/}
            {/*      </Text>*/}
            {/*    )}*/}
            {/*  </Stack>*/}
            {/*)}*/}
          </Stack>
        </Button>
        {onDelete && (
          <IconButton
            variant={'ghost'}
            aria-label={'Löschen'}
            size={'sm'}
            onClick={() => onDelete(patient)}
            icon={<MdDelete />}
          />
        )}
      </ButtonGroup>
    )
  }
  return <>{renderButton()}</>
}

export default ListButton
