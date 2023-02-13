import * as React from 'react';
import { QueryClient, QueryClientProvider, QueryCache } from 'react-query';
import { ChakraProvider, Box, Heading } from "@chakra-ui/react";
import { Toaster, toast } from "react-hot-toast";
import theme from "./theme";
import { WagmiProvider } from "wagmi";
import { providers } from "ethers";

const provider = providers.getDefaultProvider('http://localhost:8545');

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})