import { ChangeEvent, DragEvent, useState } from 'react'
import { useToast } from '@chakra-ui/react'

interface OwnProps {
  files: Array<string>
}

type Props = OwnProps
const wrongFormatText = 'Nur .docx Dateien sind erlaubt.'
const errorByFileText = 'Ups. Etwas ist schiefgegangen.'

const useDnD = ({ files }: Props) => {
  const uniqueFiles = new Set(...files)
  const toast = useToast()
  const [pickedFiles, setPickedFiles] = useState<File[]>([])
  const [draggedOver, setDraggedOver] = useState(false)
  const addFiles = (files: FileList | null) => {
    if (files) {
      Array.from(files).forEach((file) => {
        console.log('file', file)
        if (file.type === 'application/pdf') {
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
    ev.stopPropagation()
    addFiles(ev.dataTransfer.files)
    setDraggedOver(false)
  }

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    addFiles(ev.target.files)
  }
  const handleDragOverHandler = (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault()
    console.log('handleDragOverHandler')
    if (ev.type === 'dragenter' || ev.type === 'dragover') {
      setDraggedOver(true)
    } else if (ev.type === 'dragleave') {
      setDraggedOver(false)
    }
    // setDraggedOver(true)
  }
  const handleDragLeaveHandle = (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault()
    console.log('handleDragLeaveHandle')

    setDraggedOver(false)
  }
  const handleDragEnterHandle = (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault()

    // setDraggedOver(true)
  }
  return {
    handleDropHandler,
    handleInputChange,
    handleDragOverHandler,
    handleDragLeaveHandle,
    pickedFiles,
    draggedOver,
    handleDragEnterHandle
  }
}

export default useDnD
