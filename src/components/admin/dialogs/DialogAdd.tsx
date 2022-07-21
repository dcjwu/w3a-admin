import React from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { ThemeProvider } from "@mui/material/styles"

import { theme } from "@lib/admin/mui/theme"

import type { DialogAddType } from "@customTypes/admin/components"

export const DialogAdd: React.FC<DialogAddType> = ({ isOpen, isButtonDisabled, title, description, handleCloseDialog, handleSubmitForm, children }): JSX.Element => {
   return (
      <ThemeProvider theme={theme}>
         <Dialog open={isOpen} onClose={handleCloseDialog}>
            <Box component="form" onSubmit={handleSubmitForm}>
               <DialogTitle>{title}</DialogTitle>
               <DialogContent>
                  <DialogContentText>
                     {description}
                  </DialogContentText>
                  {children}
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