import React from "react"

import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"

import { FormContext } from "@components/admin/dialogs/DialogForm"

import type { DropdownType } from "@customTypes/admin/components"

export const Dropdown: React.FC<DropdownType> = ({
   name,
   label,
   dropdownItems,
   disabledFields
}): JSX.Element => {

   const formContext = React.useContext(FormContext)
   const {
      formData,
      handleDropdownChange
   } = formContext

   return (
      <FormControl fullWidth sx={{ marginTop: "16px", marginBottom: "8px" }}>
         <InputLabel id={`select-${label}`}>{label}</InputLabel>
         <Select label={label}
                 labelId={`select-${label}`}
                 name={name}
                 value={formData[name]}
                 onChange={handleDropdownChange}
         >
            {dropdownItems.map(item => (
               <MenuItem key={item} disabled={disabledFields?.includes(item)} value={item}>{item}</MenuItem>
            ))}
         </Select>
      </FormControl>
   )
}