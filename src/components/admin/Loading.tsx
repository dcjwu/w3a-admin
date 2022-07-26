import React from "react"

import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"

import type { LoadingType } from "@customTypes/admin/components"

export const Loading: React.FC<LoadingType> = ({ isOpen, message }): JSX.Element => {
   return (
      <Backdrop open={isOpen}
         sx={{ color: "#fff", zIndex: (theme): number => theme.zIndex.drawer + 1, flexDirection: "column", gap: "10px" }}
      >
         <CircularProgress color="inherit" />
         {message && <Typography component="p" variant="subtitle1">Loading {message}...</Typography>}
      </Backdrop>
   )
}