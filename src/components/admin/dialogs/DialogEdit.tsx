import React from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { ThemeProvider } from "@mui/material/styles"
import TextField from "@mui/material/TextField"

import { theme } from "@lib/admin/mui/theme"
import { isEditInputDisabled } from "@utils/isEditInputDisabled"

import type { DialogEditType } from "@customTypes/admin/components"


export const DialogEdit: React.FC<DialogEditType> = ({
   isOpen,
   isButtonDisabled,
   title,
   description,
   columns,
   editableRow,
   handleCloseDialog,
   handleSubmitForm
}): JSX.Element => {
   return (
      <ThemeProvider theme={theme}>
         <Dialog open={isOpen} onClose={handleCloseDialog}>
            <Box component="form" onSubmit={handleSubmitForm}>
               <DialogTitle>{title}</DialogTitle>
               <DialogContent>
                  <DialogContentText>
                     {description}
                  </DialogContentText>
                  {columns.map(item => (
                     <TextField key={item} autoFocus fullWidth
                                disabled={isEditInputDisabled(item)}
                                id={item}
                                label={item}
                                margin="normal"
                                type="text"
                                value={editableRow[item]}
                                variant="filled"
                     />
                  ))}
               </DialogContent>
               <DialogActions>
                  <Button type="button" onClick={handleCloseDialog}>Cancel</Button>
                  <Button disabled={isButtonDisabled} type="submit">Submit</Button>
               </DialogActions>
            </Box>
         </Dialog>
      </ThemeProvider>
   )
}