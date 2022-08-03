import { ChakraProvider } from "@chakra-ui/react";
import UploadPage from "pages/upload";

function App() {
  return (
    <ChakraProvider>
      <UploadPage />
    </ChakraProvider>
  );
}

export default App;
