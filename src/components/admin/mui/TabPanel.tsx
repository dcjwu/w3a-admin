import React from "react"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import type { TabPanelType } from "@customTypes/admin/components"

export const TabPanel: React.FC<TabPanelType> = ({ value, index, children, ...otherProps }): JSX.Element => {

   return (
      <div aria-labelledby={`full-width-tab-${index}`}
         hidden={value !== index}
         id={`full-width-tabpanel-${index}`}
         role="tabpanel"
         {...otherProps}
      >
         {value === index && (
            <Box sx={{ p: 3 }}>
               <Typography>{children}</Typography>
            </Box>
         )}
      </div>
   )
}