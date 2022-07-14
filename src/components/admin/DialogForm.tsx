import React from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { ThemeProvider } from "@mui/material/styles"

import { DialogFormType } from "@customTypes/admin/components"
import { theme } from "@lib/admin/mui/theme"

export const DialogForm: React.FC<DialogFormType> = ({ isOpen, title, description, handleCloseDialog, handleSubmitForm, children }): JSX.Element => {
   return (
      <ThemeProvider theme={theme}>
         <Dialog open={isOpen} onClose={handleCloseDialog}>
            <Box component="form" onSubmit={handleSubmitForm}>
               {/* TODO: Add error from server state to submit button */}
               <DialogTitle>{title}</DialogTitle>
               <DialogContent>
                  <DialogContentText>
                     {description}
                  </DialogContentText>
                  {children}
               </DialogContent>
               <DialogActions>
                  <Button type="button" onClick={handleCloseDialog}>Cancel</Button>
                  <Button type="submit">Submit</Button>
                  {/* TODO: Add loading state to submit button */}
               </DialogActions>
            </Box>
         </Dialog>
      </ThemeProvider>
   )
}