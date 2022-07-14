import React from "react"

import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"

import { LoadingType } from "@customTypes/admin/components"

export const Loading: React.FC<LoadingType> = ({ isOpen }): JSX.Element => {
   return (
      <Backdrop open={isOpen}
         sx={{ color: "#fff", zIndex: (theme): number => theme.zIndex.drawer + 1 }}
      >
         <CircularProgress color="inherit" />
      </Backdrop>
   )
}