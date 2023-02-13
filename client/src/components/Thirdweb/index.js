import React from 'react';
import ReactDOM from 'react-dom';
import './DAO.css';
import EditionDrop from './EditionDrop';

// Thirdweb provider & Rinkeby ChainID
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
const activeChainId = chainId.Rinkeby; // chain (derivative) of eth that the dApp is powered by

ReactDOM.render(
    <React.StrictMode>
        <ThirdwebProvider desiredChainId={activeChainId}>
            <EditionDrop />
        </ThirdwebProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);

// I'm assuming this would go into ../../index.js, or can we just create a page with the above `render` params and then import it in ../ ?