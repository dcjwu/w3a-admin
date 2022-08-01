import React from "react"

import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { ThemeProvider } from "@mui/material/styles"

import { theme } from "@lib/admin/mui/theme"

import type { DialogConfirmType } from "@customTypes/admin/components"

export const DialogConfirm: React.FC<DialogConfirmType> = ({ isOpen, title, handleCloseDialog, handleDeleteEntity, children }): JSX.Element => {
   return (
      <ThemeProvider theme={theme}>
         <Dialog aria-describedby="confirm-dialog-description"
         aria-labelledby="alert-dialog-title"
         open={isOpen}
         onClose={handleCloseDialog}
         >
            <DialogTitle color="error" id="confirm-dialog-title">
               {title}
            </DialogTitle>
            <DialogContent>
               <DialogContentText id="confirm-dialog-description">
                  {children}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button autoFocus type="button" onClick={handleCloseDialog}>Close</Button>
               <Button type="button" onClick={handleDeleteEntity}>Confirm</Button>
            </DialogActions>
         </Dialog>
      </ThemeProvider>
   )
}