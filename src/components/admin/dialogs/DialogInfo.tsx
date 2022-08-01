import React from "react"

import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { ThemeProvider } from "@mui/material/styles"

import { theme } from "@lib/admin/mui/theme"

import type { DialogInfoType } from "@customTypes/admin/components"

export const DialogInfo: React.FC<DialogInfoType> = ({ isOpen, handleCloseDialog, title, children }): JSX.Element => {
   
   return (
      <ThemeProvider theme={theme}>
         <Dialog aria-describedby="info-dialog-description"
                 aria-labelledby="info-dialog-title"
                 open={isOpen}
                 onClose={handleCloseDialog}
         >
            <DialogTitle id="info-dialog-title">
               {title}
            </DialogTitle>
            <DialogContent>
               {children}
            </DialogContent>
            <DialogActions>
               <Button autoFocus type="button" onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
         </Dialog>
      </ThemeProvider>
   )
}