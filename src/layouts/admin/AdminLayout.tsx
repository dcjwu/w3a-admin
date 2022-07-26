import React from "react"

import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import Divider from "@mui/material/Divider"
import Drawer from "@mui/material/Drawer"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { ThemeProvider, useTheme } from "@mui/material/styles"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/router"

import { Loading, Main, Sidebar, Topbar } from "@components/admin"
import { drawerWidth } from "@lib/admin/mui/constants"
import { theme as customTheme } from "@lib/admin/mui/theme"

import type { AdminLayoutType } from "@customTypes/admin/layouts"

const AccountBoxIcon = dynamic(() => import("@mui/icons-material/AccountBox"))
const ChevronLeftIcon = dynamic(() => import("@mui/icons-material/ChevronLeft"))
const ChevronRightIcon = dynamic(() => import("@mui/icons-material/ChevronRight"))
const FiberManualRecordIcon = dynamic(() => import("@mui/icons-material/FiberManualRecord"))
const IconButton = dynamic(() => import("@mui/material/IconButton"))
const InboxIcon = dynamic(() => import("@mui/icons-material/MoveToInbox"))
const List = dynamic(() => import("@mui/material/List"))
const ListItem = dynamic(() => import("@mui/material/ListItem"))
const LogoutIcon = dynamic(() => import("@mui/icons-material/Logout"))
const MenuIcon = dynamic(() => import("@mui/icons-material/Menu"))
const UploadFileIcon = dynamic(() => import("@mui/icons-material/UploadFile"))
const QueryStatsIcon = dynamic(() => import("@mui/icons-material/QueryStats"))

const AdminLayout: React.FC<AdminLayoutType> = ({
   children,
   serverError
}): JSX.Element => {

   const router = useRouter()
   const session = useSession()
   const theme = useTheme()

   const {
      data,
      status
   } = session

   const [isOpen, setIsOpen] = React.useState(false)
   const [isLoading, setIsLoading] = React.useState(false)

   const handleToggleSidebar = (): void => {
      setIsOpen(prevState => !prevState)
   }

   React.useEffect(() => {
      const handleStart = (url: string): false | void => (url !== router.asPath) && setIsLoading(true)
      const handleComplete = (url: string): false | void => (url === router.asPath) && setIsLoading(false)

      router.events.on("routeChangeStart", handleStart)
      router.events.on("routeChangeComplete", handleComplete)
      router.events.on("routeChangeError", handleComplete)

      return () => {
         router.events.off("routeChangeStart", handleStart)
         router.events.off("routeChangeComplete", handleComplete)
         router.events.off("routeChangeError", handleComplete)
      }
   })

   return (
      <>
         {isLoading
            ? <Loading isOpen={isLoading}/>
            : <ThemeProvider theme={customTheme}>
               <Box sx={{ display: "flex" }}>
                  <CssBaseline/>
                  <Topbar color="secondary" open={isOpen} position="fixed">
                     <Toolbar>
                        <IconButton aria-label="open drawer"
                                    color="inherit"
                                    edge="start"
                                    sx={{ mr: 2, ...(isOpen && { display: "none" }) }}
                                    onClick={handleToggleSidebar}
                        >
                           <MenuIcon/>
                        </IconButton>
                        <Typography noWrap component="div" variant="h6">
                           {status !== "loading" && `Hey, ${data?.user.name}`}
                        </Typography>
                     </Toolbar>
                  </Topbar>
                  <Drawer anchor="left"
                          open={isOpen}
                          sx={{
                             width: drawerWidth,
                             flexShrink: 0,
                             "& .MuiDrawer-paper": {
                                width: drawerWidth,
                                boxSizing: "border-box",
                             },
                          }}
                          variant="persistent"
                  >
                     <Sidebar>
                        <IconButton onClick={handleToggleSidebar}>
                           {theme.direction === "ltr" ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                        </IconButton>
                     </Sidebar>
                     <Divider/>
                     <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100vh"
                     }}>
                        <Box>
                           <List>
                              {["Team", "Partners", "Portfolio", "Stack", "Services", "Users"]
                                 .sort()
                                 .map(text => (
                                    <ListItem key={text} disablePadding>
                                       <Link passHref href={`/admin/${text.toLowerCase()}`}>
                                          <ListItemButton component="a">
                                             <ListItemIcon>
                                                <FiberManualRecordIcon/>
                                             </ListItemIcon>
                                             <ListItemText primary={text}/>
                                          </ListItemButton>
                                       </Link>
                                    </ListItem>
                                 ))}
                           </List>
                           <Divider/>
                           <List>
                              {["Tickets", "Analytics", "Upload"].map((text, index) => (
                                 <ListItem key={text} disablePadding>
                                    <Link passHref href={`/admin/${text.toLowerCase()}`}>
                                       <ListItemButton component="a">
                                          <ListItemIcon>
                                             {text === "Upload"
                                                ? <UploadFileIcon/>
                                                : index % 2 === 0
                                                   ?  <InboxIcon/>
                                                   : <QueryStatsIcon/>}
                                          </ListItemIcon>
                                          <ListItemText primary={text}/>
                                       </ListItemButton>
                                    </Link>
                                 </ListItem>
                              ))}
                           </List>
                        </Box>
                        <Box>
                           <Divider/>
                           <List>
                              {["Profile", "Logout"]
                                 .map((text, index) => (
                                    <ListItem key={text} disablePadding>
                                       <Link passHref href={
                                          index % 2 === 0
                                             ? "/admin/me"
                                             : "/api/auth/signout"
                                       }>
                                          <ListItemButton component="a">
                                             <ListItemIcon>
                                                {index % 2 === 0 ? <AccountBoxIcon/> : <LogoutIcon/>}
                                             </ListItemIcon>
                                             <ListItemText primary={text}/>
                                          </ListItemButton>
                                       </Link>
                                    </ListItem>
                                 ))}
                           </List>
                        </Box>
                     </Box>
                  </Drawer>
                  <Main open={isOpen}>
                     <Sidebar/>
                     {
                        serverError
                           ? <Typography color="error.main" component="p" variant="h5">{serverError} :(</Typography>
                           : children
                     }
                  </Main>
               </Box>
            </ThemeProvider>}
      </>
   )
}

export default AdminLayout