import { useField } from '@unform/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Container } from './styles'

interface InputProps {
  name: string
  placeholder: string
}

export function Input({ name, ...rest }: InputProps) {
  const inputRef: React.LegacyRef<HTMLInputElement> = useRef(null)

  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)

  const { fieldName, defaultValue, registerField } = useField(name)

  const handleInputFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleInputBlur = useCallback(() => {
    setIsFocused(false)
    setIsFilled(!!inputRef.current?.value)
  }, [])

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    })
  }, [fieldName, registerField])

  return (
    <Container isFilled={isFilled} isFocused={isFocused}>
      <input onFocus={handleInputFocus} onBlur={handleInputBlur} defaultValue={defaultValue} ref={inputRef} {...rest} />
    </Container>
  )
}
