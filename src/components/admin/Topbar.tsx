import MuiAppBar from "@mui/material/AppBar"
import { styled } from "@mui/material/styles"

import { drawerWidth } from "@lib/admin/mui/constants"

import type { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar"

interface AppBarProps extends MuiAppBarProps {
   open?: boolean
}

export const Topbar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== "open", })<AppBarProps>(({ theme, open }) => ({
   transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
   }),
   ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin", "width"], {
         easing: theme.transitions.easing.easeOut,
         duration: theme.transitions.duration.enteringScreen,
      }),
   }),
}))