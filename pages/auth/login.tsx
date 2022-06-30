import React from "react"

import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProviderProps } from "@mui/system" // eslint-disable-line import/named
import { NextPage } from "next"
import { signIn } from "next-auth/react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import { theme } from "@lib/admin/theme"

const LockOutlinedIcon = dynamic(() => import("@mui/icons-material/LockOutlined"))
const ThumbDownOffAltIcon = dynamic(() => import("@mui/icons-material/ThumbDownOffAlt"))
const TextField = dynamic(() => import("@mui/material/TextField"))
const Avatar = dynamic(() => import("@mui/material/Avatar"))
const Button = dynamic(() => import("@mui/material/Button"))
const Container = dynamic(() => import("@mui/material/Container"))
const ThemeProvider = dynamic<ThemeProviderProps>(() => import("@mui/material/styles").then(module => module.ThemeProvider))

const Login: NextPage = (): JSX.Element => {

   const { query } = useRouter()

   const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault()
      const data = new FormData(event.currentTarget)
      signIn("credentials", {
         email: data.get("email"),
         password: data.get("password")
      })
   }

   return (
      <ThemeProvider theme={theme}>
         <Container maxWidth="xs">
            <CssBaseline/>
            <Box sx={{
               marginTop: 8,
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
            }}
            >
               {query.error && <Box sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "center",
                  gap: "5px",
               }}>
                  <Avatar sx={{
                     m: 1,
                     bgcolor: "error.main"
                  }}>
                     <ThumbDownOffAltIcon/>
                  </Avatar>
                  <Avatar sx={{
                     m: 1,
                     bgcolor: "error.main"
                  }}>
                     <ThumbDownOffAltIcon/>
                  </Avatar>
                  <Avatar sx={{
                     m: 1,
                     bgcolor: "error.main"
                  }}>
                     <ThumbDownOffAltIcon/>
                  </Avatar>
               </Box>}
               <Avatar sx={{
                  m: 1,
                  bgcolor: "secondary.light"
               }}>
                  <LockOutlinedIcon/>
               </Avatar>
               <Box component="form"
                    onSubmit={handleSubmit}>
                  <TextField autoFocus
                             fullWidth
                             required
                             autoComplete="email"
                             id="email"
                             label="Email"
                             margin="normal"
                             name="email"
                             type="email"
                  />
                  <TextField fullWidth
                             required
                             autoComplete="current-password"
                             id="password"
                             label="Password"
                             margin="normal"
                             name="password"
                             type="password"
                  />
                  <Button fullWidth
                          color="primary"
                          sx={{
                             mt: 3,
                             mb: 2
                          }}
                          type="submit"
                          variant="contained"
                  >
                     Sign In
                  </Button>
               </Box>
            </Box>
         </Container>
      </ThemeProvider>
   )
}

export default Login