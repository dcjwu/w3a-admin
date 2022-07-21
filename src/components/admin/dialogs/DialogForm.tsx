import React from "react"
import type { FormEvent } from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"

import type { DialogFormType } from "@customTypes/admin/components"
import type { FormContextType } from "@customTypes/admin/context"

export const FormContext = React.createContext<FormContextType>({ formData: {} })

export const DialogForm: React.FC<DialogFormType> = ({
   initialState,
   isButtonDisabled,
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

   return (
      <React.Fragment>
         <DialogContent sx={{ py: 0 }}>
            <Box component="form"
                 onSubmit={(event: FormEvent<HTMLDivElement>): void => handleFormSubmit(event, formData)}>
               <FormContext.Provider value={{
                  formData,
                  handleFormChange
               }}>
                  {children}
               </FormContext.Provider>
               <DialogActions>
                  <Button type="button" onClick={handleCloseDialog}>Cancel</Button>
                  <Button disabled={isButtonDisabled} type="submit">
                     Submit</Button>
               </DialogActions>
            </Box>
         </DialogContent>
      </React.Fragment>
   )
}