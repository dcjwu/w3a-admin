import React from "react"

import { Typography } from "@mui/material"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { NextPage } from "next"
import { signIn } from "next-auth/react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import { theme } from "@lib/admin/theme"

const Avatar = dynamic(() => import("@mui/material/Avatar"))
const Button = dynamic(() => import("@mui/material/Button"))
const LockOutlinedIcon = dynamic(() => import("@mui/icons-material/LockOutlined"))
const TextField = dynamic(() => import("@mui/material/TextField"))
const ThumbDownOffAltIcon = dynamic(() => import("@mui/icons-material/ThumbDownOffAlt"))

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
               marginTop: 15,
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
            }}
            >
               {query.error && <Box sx={{
                  position: "absolute",
                  top: 10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "center",
                  gap: "5px",
               }}>
                  <Typography color="error" variant="h5">
                     ERROR
                  </Typography>
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