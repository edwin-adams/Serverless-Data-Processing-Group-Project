import AppRouter from './router';
import {ChakraProvider} from '@chakra-ui/react'

function App() {
    return (
        <ChakraProvider>
            <AppRouter/>
        </ChakraProvider>
    );
}

export default App;
