import { DragEvent, ChangeEvent, FunctionComponent, useState, ReactNode } from 'react'

import { Stack, Text, useToast, VisuallyHiddenInput } from '@chakra-ui/react'
import { TbFileTypeDocx } from 'react-icons/tb'

interface OwnProps {
  files: Array<string>
  children: ReactNode
}

type Props = OwnProps
const wrongFormatText = 'Nur .docx Dateien sind erlaubt.'
const errorByFileText = 'Ups. Etwas ist schiefgegangen.'

const index: FunctionComponent<Props> = ({ files, children }) => {
  const uniqueFiles = new Set(files)
  const [pickedFiles, setPickedFiles] = useState<File[]>([])
  const [draggedOver, setDraggedOver] = useState(false)
  const toast = useToast()

  const addFiles = (files: FileList | null) => {
    if (files) {
      Array.from(files).forEach((file, i) => {
        console.log('file', uniqueFiles, file)
        if (
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          if (uniqueFiles.has(file.name)) {
            toast({
              title: 'Warnung',
              description: `${file.name} - Datei bereits ausgewählt.`,
              status: 'warning'
            })
            return
          }
          setPickedFiles((prev) => [...prev, file])
        } else {
          toast({
            title: 'Warnung',
            description: wrongFormatText,
            status: 'warning'
          })
        }
      })
    } else {
      toast({
        title: 'Fehler',
        description: errorByFileText,
        status: 'error'
      })
    }
  }
  const handleDropHandler = (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault()
    addFiles(ev.dataTransfer.files)
    setDraggedOver(false)
  }

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    addFiles(ev.target.files)
  }
  const handleDragOVerHandler = (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault()
    setDraggedOver(true)
  }
  const handleDragLeaveHandle = (ev: DragEvent<HTMLDivElement>) => {
    console.log('leave')

    ev.preventDefault()
    setDraggedOver(false)
  }

  return (
    <Stack onDragOver={handleDragOVerHandler}>
      {children}
      {draggedOver && (
        <Stack
          pos={'absolute'}
          width={'100%'}
          height={'100%'}
          onDrop={handleDropHandler}
          onDragLeave={handleDragLeaveHandle}
          background={draggedOver ? 'rgba(160,174,192,0.8)' : undefined}
          justifyContent={'center'}
          sx={{ borderWidth: '2px', borderColor: 'gray.300', borderStyle: 'dashed' }}
          zIndex={100}
        >
          <VisuallyHiddenInput type="file" accept={'.pdf'} multiple onChange={handleInputChange} />

          <Stack
            alignItems={'center'}
            spacing={3}
            background={'whiteAlpha.800'}
            py={10}
            sx={{ pointerEvents: 'none' }}
          >
            <TbFileTypeDocx size={50} />
            <Text fontWeight={500} textAlign={'center'}>
              Datei(n) hierhin ziehen oder auswählen.*
            </Text>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}

export default index
