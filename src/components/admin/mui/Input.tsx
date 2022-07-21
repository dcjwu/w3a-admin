import React from "react"

import TextField from "@mui/material/TextField"

import { FormContext } from "@components/admin/dialogs/DialogForm"

import type { TextFieldProps } from "@mui/material/TextField"

export const Input: React.FC<TextFieldProps> = ({ name, ...textFieldProps }): JSX.Element | null => {

   const formContext = React.useContext(FormContext)
   const {
      formData,
      handleFormChange
   } = formContext

   if (name) {
      return (
         <TextField name={name} value={formData[name]} onChange={handleFormChange}
                    {...textFieldProps}/>
      )
   }

   return null
}