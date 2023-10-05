import { FunctionComponent } from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Code
} from '@chakra-ui/react'

interface OwnProps {
  cause?: string
  moreInfo?: string | null
}

type Props = OwnProps

const Error: FunctionComponent<Props> = ({ cause, moreInfo }) => {
  return (
    <Alert
      status="warning"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Achtung!
      </AlertTitle>
      <AlertDescription maxWidth="sm">Es gab ein Problem mit der Anwendung.</AlertDescription>
      {cause && <AlertDescription maxWidth="sm">{cause}</AlertDescription>}
      {moreInfo && (
        <Accordion>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Mehr
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Code>{moreInfo}</Code>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}
    </Alert>
  )
}

export default Error
