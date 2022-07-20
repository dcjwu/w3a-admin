import React from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import LinearProgress from "@mui/material/LinearProgress"
import { ThemeProvider } from "@mui/material/styles"
import Typography from "@mui/material/Typography"

import { DialogStatusEnum } from "@customTypes/admin/components"
import { theme } from "@lib/admin/mui/theme"

import type { DialogStatusType } from "@customTypes/admin/components"


const DialogStatus: React.FC<DialogStatusType> = ({
   status,
   isOpen,
   handleCloseDialog,
   error
}): JSX.Element => {

   return (
      <ThemeProvider theme={theme}>
         <Dialog aria-describedby="alert-dialog-description"
                 aria-labelledby="alert-dialog-title"
                 open={isOpen}
                 onClose={handleCloseDialog}
         >
            <DialogContent>
               {status === DialogStatusEnum.LOADING
                  ? <Box sx={{
                     width: "100%",
                     marginTop: "16px",
                     marginBottom: "8px"
                  }}>
                     <DialogContentText id="alert-dialog-description" sx={{
                        marginTop: "16px",
                        marginBottom: "8px"
                     }}>
                        Loading, please wait...
                     </DialogContentText>
                     <LinearProgress color="secondary"/>
                  </Box>
                  : status === DialogStatusEnum.SUCCESS
                     ? <DialogContentText id="alert-dialog-description" sx={{
                        marginTop: "16px",
                        marginBottom: "8px"
                     }}>
                        <Typography color="success.light" component="span" variant="subtitle1">
                           Upload Success!
                        </Typography>
                     </DialogContentText>
                     : status === DialogStatusEnum.ERROR
                        ? <DialogContentText id="alert-dialog-description" sx={{
                           marginTop: "16px",
                           marginBottom: "8px"
                        }}>
                           <Typography color="error.light" component="span" variant="subtitle1">
                              {error}
                           </Typography>
                        </DialogContentText> : null}
            </DialogContent>
            <DialogActions>
               <Button autoFocus type="button" onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
         </Dialog>
      </ThemeProvider>
   )
}

export default DialogStatus