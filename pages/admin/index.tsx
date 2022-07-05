import React from "react"

import { Switch } from "@mui/material"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { NextPage } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"

import { theme } from "@lib/admin/theme"

const Button = dynamic(() => import("@mui/material/Button"))

const AdminPage: NextPage = (): JSX.Element => {

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
                     <Link href="admin/database">
                        <a style={{ textDecoration: "none" }}>
                           <Button color="secondary"
                                   type="button"
                                   variant="contained"
                           >
                              Database
                           </Button>
                        </a>
                     </Link>
                     <Link href="admin/messages">
                        <a style={{ textDecoration: "none" }}>
                           <Button color="secondary"
                                   type="button"
                                   variant="contained"
                           >
                              Messages
                           </Button>
                        </a>
                     </Link>
                     <Link href="admin/analytics">
                        <a style={{ textDecoration: "none" }}>
                           <Button color="secondary"
                                   type="button"
                                   variant="contained"
                           >
                              Analytics
                           </Button>
                        </a>
                     </Link>
                     <Link href="admin/logs">
                        <a style={{ textDecoration: "none" }}>
                           <Button color="secondary"
                                   type="button"
                                   variant="contained"
                           >
                              Logs
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
                     <Link href="auth/logout">
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
      </ThemeProvider>
   )
}

export default AdminPage