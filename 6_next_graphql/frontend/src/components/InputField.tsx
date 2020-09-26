import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  theme,
} from "@chakra-ui/core"
import { useField } from "formik"
import React, { InputHTMLAttributes } from "react"

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label: string
}

const InputField: React.FC<InputFieldProps> = ({ label, size, ...props }) => {
  const [field, meta, _helpers] = useField(props)

  return (
    <FormControl isInvalid={meta.error && meta.touched}>
      <FormLabel htmlFor={props.name}>{label}</FormLabel>

      {/* field: {name, onBlur, onChange, value} */}
      <Input
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
        style={{ color: theme.colors.black }}
      />

      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  )
}

export default InputField
