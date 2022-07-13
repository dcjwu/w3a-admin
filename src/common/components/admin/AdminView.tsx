import React from "react"

import { Switch, Typography } from "@mui/material"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import dynamic from "next/dynamic"
import Link from "next/link"

import { theme } from "@lib/admin/theme"

import type { AdminViewType } from "@customTypes/admin/components"

const Button = dynamic(() => import("@mui/material/Button"))

const AdminView: React.FC<AdminViewType> = ({ children, serverError }):JSX.Element => {

   const [isDarkTheme, setIsDarkTheme] = React.useState(false)

   const handleThemeChange = (): void => {
      setIsDarkTheme(prevState => !prevState)
   }

   return (
      <ThemeProvider theme={theme}>
         <Box sx={{
            width: "100%",
            padding: "16px 0",
            backgroundColor: "primary.main"
         }}>
            <CssBaseline/>
            <Container maxWidth="xl">
               <Box sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
               }}>
                  <Box sx={{
                     display: "flex",
                     alignItems: "center",
                     gap: "20px"
                  }}>
                     <Link href="/admin">
                        <a style={{ textDecoration: "none" }}>
                           <Button color="secondary"
                                   type="button"
                                   variant="contained"
                           >
                              ADMIN PANEL
                           </Button>
                        </a>
                     </Link>
                     <Link href="/admin/tickets">
                        <a style={{ textDecoration: "none" }}>
                           <Button color="secondary"
                                   type="button"
                                   variant="contained"
                           >
                              Tickets
                           </Button>
                        </a>
                     </Link>
                     <Link href="/admin/analytics">
                        <a style={{ textDecoration: "none" }}>
                           <Button color="secondary"
                                   type="button"
                                   variant="contained"
                           >
                              Analytics
                           </Button>
                        </a>
                     </Link>
                  </Box>
                  <Box sx={{
                     display: "flex",
                     alignItems: "center",
                     gap: "20px"
                  }}>
                     <Switch checked={isDarkTheme}
                             color="default"
                             inputProps={{ "aria-label": "controlled" }}
                             onChange={handleThemeChange}
                     />
                     <Link href="/admin/me">
                        <a style={{ textDecoration: "none" }}>
                           <Button color="secondary"
                                   type="button"
                                   variant="contained"
                           >
                              Profile
                           </Button>
                        </a>
                     </Link>
                     <Link href="/auth/logout">
                        <a style={{ textDecoration: "none" }}>
                           <Button color="info"
                                   type="button"
                                   variant="contained"
                           >
                              Logout
                           </Button>
                        </a>
                     </Link>
                  </Box>
               </Box>
            </Container>
         </Box>
         <Container maxWidth="xl">
            <Box sx={{ marginTop: "30px" }}>
               {
                  serverError
                     ? <Typography color="error.main" component="p" variant="h3">{serverError} :(</Typography>
                     : children
               }
            </Box>
         </Container>
      </ThemeProvider>
   )
}

export default AdminView