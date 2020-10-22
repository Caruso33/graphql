import { ColorModeProvider, CSSReset, ThemeProvider } from "@chakra-ui/core"
import React from "react"
import StoreProvider from "state/app"
import theme from "../theme"

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider value="dark">
        <CSSReset />
        <StoreProvider>
          <Component {...pageProps} />
        </StoreProvider>
      </ColorModeProvider>
    </ThemeProvider>
  )
}

export default MyApp
