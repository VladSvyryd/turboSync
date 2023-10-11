import { FunctionComponent, ReactNode } from 'react'
import { Box, Button, Modal, ModalContent, ModalOverlay, Stack, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import theme from '../../theme'
import { SignType } from '../../types'

interface OwnProps {
  isOpen: boolean
  onClose: () => void
  onPick: (signType: SignType) => void
  signTypeButtons: Array<{
    id: SignType
    header: ReactNode
    title: ReactNode
    disabled?: boolean
  }>
}
const buttonVariants = {
  initial: {
    backgroundColor: '#319795'
  },
  hover: {
    backgroundColor: 'hsl(240, 100, 50)'
  }
}

type Props = OwnProps

const contentVariants = [
  {
    left: '15%',
    top: '30%'
  },
  {
    right: '15%',
    top: '30%'
  },
  {
    bottom: '18%',
    left: '32%'
  }
]

const backgroundButton = [
  {
    transform: 'rotate(0deg) skewY(30deg)',
    backgroundColor: '#319795',
    hoverBackgroundColor: theme.colors.orange[400]
  },
  {
    transform: 'rotate(120deg) skewY(30deg)',
    backgroundColor: '#319795',
    hoverBackgroundColor: theme.colors.green[400]
  },
  {
    transform: 'rotate(240deg) skewY(30deg)',
    backgroundColor: '#319795',
    hoverBackgroundColor: theme.colors.red[400]
  }
]

const SignTypePicker: FunctionComponent<Props> = ({ isOpen, signTypeButtons, onClose, onPick }) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay bg={'transparent'} backdropFilter="blur(1px)" />
      <ModalContent bg={'transparent'} shadow={'none'}>
        <Box
          bg={'teal'}
          zIndex={39999}
          color={'white'}
          pos={'relative'}
          padding={0}
          m={'1em auto'}
          width={430}
          height={430}
          borderRadius={'50%'}
          overflow={'hidden'}
        >
          <Box
            pos={'absolute'}
            p={0}
            m={'1em auto'}
            width={'134%'}
            height={'134%'}
            borderRadius={'50%'}
            overflow={'hidden'}
            left={-70}
            top={-95}
          >
            {signTypeButtons.map(({ title, header, id, disabled }, index) => (
              <Box key={id}>
                <Stack
                  style={{ pointerEvents: 'none', ...contentVariants[index] }}
                  pos={'absolute'}
                  zIndex={30}
                  width={'35%'}
                  height={'100px'}
                  textAlign={'center'}
                >
                  {header}
                  <Text mt={'auto'}>{title}</Text>
                </Stack>
                <Button
                  border={'1px solid white'}
                  borderRadius={0}
                  tabIndex={-1}
                  as={motion.button}
                  whileHover={
                    disabled
                      ? { cursor: 'auto' }
                      : { backgroundColor: backgroundButton[index].hoverBackgroundColor }
                  }
                  initial={'initial'}
                  variants={buttonVariants}
                  className="background"
                  overflow={'hidden'}
                  position={'absolute'}
                  top={0}
                  right={0}
                  width={'50%'}
                  height={'50%'}
                  transformOrigin={'0% 100%'}
                  bg={backgroundButton[index].backgroundColor}
                  style={{
                    transform: backgroundButton[index].transform
                  }}
                  onClick={() => {
                    if (disabled) return
                    onPick(id)
                    onClose()
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  )
}

export default SignTypePicker
