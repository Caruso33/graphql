import { ThemeProvider, CSSReset, ColorModeProvider } from "@chakra-ui/core"
import { createClient, Provider } from "urql"
import theme from "../theme"

const graphqlUrl = "http://localhost:4000/graphql"

const client = createClient({
  url: graphqlUrl,
  fetchOptions: {
    credentials: "include",
  },
})

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
