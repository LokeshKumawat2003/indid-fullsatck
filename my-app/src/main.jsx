import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { ChakraProvider, theme } from  "@chakra-ui/react"
 

const rootEl = document.getElementById("root")
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
   
      <ChakraProvider theme={theme}>
      
        <App />
       
      </ChakraProvider>
 
  )
} else {
  throw new Error("Root element not found")
}
