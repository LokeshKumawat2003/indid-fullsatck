import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { ChakraProvider } from "@chakra-ui/react"
 

const rootEl = document.getElementById("root")
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  )
} else {
  throw new Error("Root element not found")
}
