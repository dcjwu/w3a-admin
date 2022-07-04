import React from "react"

import Box from "@mui/material/Box"
import { ThemeProviderProps } from "@mui/system" // eslint-disable-line import/named
import { NextPage } from "next"
import { signOut, useSession } from "next-auth/react"
import dynamic from "next/dynamic"

import { theme } from "@lib/admin/theme"

const Button = dynamic(() => import("@mui/material/Button"))
const Container = dynamic(() => import("@mui/material/Container"))
const Paragraph = dynamic(() => import("@mui/material/Typography"))
const ThemeProvider = dynamic<ThemeProviderProps>(() => import("@mui/material/styles").then(module => module.ThemeProvider))

const Logout: NextPage = (): JSX.Element => {

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
               <Paragraph paragraph align="center" color="text.main"
                          variant="subtitle1">
                  Are you sure, Mr. {session?.user?.name}?
               </Paragraph>
               <Button fullWidth
                       color="secondary"
                       type="button"
                       variant="contained"
                       onClick={(): Promise<void> => signOut()}
               >
                  Logout
               </Button>
            </Box>
         </Container>
      </ThemeProvider>
   )
}

export default Logout