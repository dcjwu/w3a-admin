import React from "react"

import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { ThemeProvider } from "@mui/material/styles"

import { theme } from "@lib/admin/mui/theme"

import type { DialogWithInputsType } from "@customTypes/admin/components"

export const DialogWithInputs: React.FC<DialogWithInputsType> = ({ isOpen, title, description, handleCloseDialog, children }): JSX.Element => {
   return (
      <ThemeProvider theme={theme}>
         <Dialog open={isOpen} onClose={handleCloseDialog}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
               <DialogContentText>
                  {description}
               </DialogContentText>
            </DialogContent>
            {children}
         </Dialog>
      </ThemeProvider>
   )
}