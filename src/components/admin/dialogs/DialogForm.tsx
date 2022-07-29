import React from "react"
import type { FormEvent } from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"

import { isObjectChanged } from "@utils/isObjectChanged"

import type { DialogFormType } from "@customTypes/admin/components"
import type { FormContextType } from "@customTypes/admin/context"
import type { SelectChangeEvent } from "@mui/material/Select"

export const FormContext = React.createContext<FormContextType>({ formData: {} })

export const DialogForm: React.FC<DialogFormType> = ({
   initialState,
   handleCloseDialog,
   handleFormSubmit,
   children
}): JSX.Element => {

   const [formData, setFormData] = React.useState<{ [k: string]: string }>(initialState)

   const handleFormChange = (event: React.SyntheticEvent): void => {
      const target = event.target as HTMLInputElement
      const {
         name,
         value
      } = target

      setFormData({
         ...formData,
         [name]: value
      })
   }

   const handleDropdownChange = (event: SelectChangeEvent): void => {
      const { name, value } = event.target
      setFormData({
         ...formData,
         [name]: value
      })
   }

   return (
      <React.Fragment>
         <DialogContent sx={{ py: 0 }}>
            <Box component="form"
                 onSubmit={(event: FormEvent<HTMLDivElement>): void => handleFormSubmit(event, formData)}>
               <FormContext.Provider value={{
                  formData,
                  handleFormChange,
                  handleDropdownChange
               }}>
                  {children}
               </FormContext.Provider>
               <DialogActions>
                  <Button type="button" onClick={handleCloseDialog}>Cancel</Button>
                  <Button disabled={isObjectChanged(initialState, formData)} type="submit">
                     Submit</Button>
               </DialogActions>
            </Box>
         </DialogContent>
      </React.Fragment>
   )
}