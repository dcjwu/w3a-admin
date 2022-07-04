import React from "react"

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
   
   return (
      <ThemeProvider theme={theme}>
         <Box sx={{
            width: "100%",
            padding: "16px 0",
            backgroundColor: "secondary.main"
         }}>
            <CssBaseline/>
            <Container maxWidth="xl">
               <Box sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end"
               }}>
                  <Link href="auth/logout">
                     <a>
                        <Button color="primary"
                                type="button"
                                variant="contained"
                        >
                           Logout
                        </Button>
                     </a>
                  </Link>
               </Box>
            </Container>
         </Box>
      </ThemeProvider>
   )
}

export default AdminPage