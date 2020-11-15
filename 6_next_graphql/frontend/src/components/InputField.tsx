import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/core"
import { useField } from "formik"
import React, { InputHTMLAttributes } from "react"

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label: string
  textarea?: boolean
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  size,
  textarea,
  ...props
}) => {
  const [field, meta, _helpers] = useField(props)

  let InputOrTextarea = Input
  if (textarea) InputOrTextarea = Textarea

  return (
    <FormControl isInvalid={meta.error && meta.touched}>
      <FormLabel htmlFor={props.name}>{label}</FormLabel>

      {/* field: {name, onBlur, onChange, value} */}
      <InputOrTextarea
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
      />

      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  )
}

export default InputField
