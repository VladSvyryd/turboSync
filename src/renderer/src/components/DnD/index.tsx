import { DragEvent, ChangeEvent, FunctionComponent, useState, ReactNode } from 'react'

import { Stack, Text, useToast, VisuallyHiddenInput } from '@chakra-ui/react'
import { TbFileTypeDocx } from 'react-icons/tb'

const wrongFormatText = 'Nur .docx, .dotx, .dotm Dateien sind erlaubt.'
const supportedFormats = new Set([
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template'
])
interface OwnProps {
  blackList: Array<string>
  onDropFiles: (files: Array<File>) => void
  children: ReactNode
}

type Props = OwnProps
const index: FunctionComponent<Props> = ({ blackList, onDropFiles, children }) => {
  const toast = useToast()
  const [draggedOver, setDraggedOver] = useState(false)
  const uniqueFiles = new Set([...blackList])

  const processFiles = async (files: FileList) => {
    const uploadFiles: Array<File> = []
    const alreadyExistFiles: Array<File> = []
    const wrongFormatFiles: Array<File> = []

    Array.from(files).forEach((file) => {
      console.log('file', file)
      if (supportedFormats.has(file.type)) {
        if (uniqueFiles.has(file.name)) {
          alreadyExistFiles.push(file)

          return
        }
        uploadFiles.push(file)
      } else {
        wrongFormatFiles.push(file)
      }
    })

    if (wrongFormatFiles.length > 0) {
      toast({
        title: 'Warnung',
        description: `${wrongFormatFiles.map((f) => f.name).join(', ')} - ${wrongFormatText}`,
        status: 'error'
      })
    }
    if (alreadyExistFiles.length > 0) {
      toast({
        title: 'Warnung',
        description: `${alreadyExistFiles
          .map((f) => f.name)
          .join(', ')} - Dateien sind bereits in der Liste.`,
        status: 'warning'
      })
    }

    onDropFiles(uploadFiles)
  }
  const handleDropHandler = async (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault()
    await processFiles(ev.dataTransfer.files)
    setDraggedOver(false)
  }

  const handleInputChange = async (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files) await processFiles(ev.target.files)
  }
  const handleDragOVerHandler = (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault()
    setDraggedOver(true)
  }
  const handleDragLeaveHandle = (ev: DragEvent<HTMLDivElement>) => {
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
              Datei(n) hierhin ziehen*
            </Text>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}

export default index
