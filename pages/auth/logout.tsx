import React from "react"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import { ThemeProvider } from "@mui/material/styles"
import { signOut, useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import { theme } from "@lib/admin/theme"

import type { NextPage } from "next"

const Button = dynamic(() => import("@mui/material/Button"))
const Paragraph = dynamic(() => import("@mui/material/Typography"))

const Logout: NextPage = (): JSX.Element => {

   const router = useRouter()
   const { data: session } = useSession()

   return (
      <ThemeProvider theme={theme}>
         <Container maxWidth="xs">
            <Box sx={{
               display: "flex",
               flexDirection: "column",
               height: "100vh",
               alignItems: "center",
               justifyContent: "center"
            }}>
               <Paragraph align="center" color="text.main"
                          variant="subtitle1">
                  Are you sure, Mr. {session?.user?.name}?
               </Paragraph>
               <Button fullWidth
                       color="secondary"
                       sx={{ margin: "15px 0" }}
                       type="button"
                       variant="contained"
                       onClick={(): Promise<void> => signOut()}
               >
                  Logout
               </Button>
               <Button fullWidth
                       color="primary"
                       type="button"
                       variant="contained"
                       onClick={(): Promise<boolean> => router.push("/admin")}
               >
                  Not sure
               </Button>
            </Box>
         </Container>
      </ThemeProvider>
   )
}

export default Logout