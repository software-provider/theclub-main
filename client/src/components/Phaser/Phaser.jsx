import Phaser from "phaser";
import Boot from "./scenes/Boot.js";
import Preloader, { authEvents, AUTH } from "./scenes/Preloader.js";
import MainMenu, { nftEvents, LOAD_NFT } from "./scenes/MainMenu.js";
import MainGame from "./scenes/Game.js";
import { useState, useEffect } from "react";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import axios from "axios";
import {
    useMoralis,
    useMoralisWeb3Api,
    useMoralisWeb3ApiCall,
    useNFTBalances, // Allows us to find the different nfts in the user's wallet
  } from "react-moralis";

let game = null;
// State management using redux for game management
const initState = { players: [], score: 0, gameOver: false };
// Game event types
export const GET_PLAYERS = "GET_PLAYERS";
export const LOGIN_PLAYER = "LOGIN_PLAYER";
export const UPDATE_SCORE = "UPDATE_SCORE";
export const GAME_OVER = "GAME_OVER";

// Reducer
function reducer(state = initState, action) {
    switch (action.type) {
        case GET_PLAYERS:
            return { ...state, players: action.players };
        case LOGIN_PLAYER:
            game.events.emit("LOGIN_PLAYER", "Check Block at Time of Game Over");
            return { ...state, players: [...state.players, action.player] };
        case UPDATE_SCORE:
            return { ...state, score: action.score };
        case GAME_OVER:
            // Emit phaser game event to trigger on-chain
            game.events.emit("BLOCK_CHECK", "check Block at Time of Game Over");
            return { ...state, gameOver: true };
        default:
            return state;
    }
}

// Redux
export const events = createStore(
    reducer,
    applyMiddleware(thunkMiddleware, createLogger())
)

// Phaser component/window -> send to page like /profile with IonPhaser
function PhaserApp() {
    const { authenticate, isAuthenticated, isAuthenticating, logout } =
        useMoralis();
    const [loaded, setLoaded] = useState(false);
    const [block, setBlock] = useState("100000");

    // Test connection to the/a connected chain
    const Web3Api = useMoralisWeb3Api();
    const { fetch, data } = useMoralisWeb3ApiCall(Web3Api.native.getBlock, {
        block_number_or_hash: block, // When did user connect (block)
    });

    // Update feedback on re-renders:
    useEffect(() => {
        if (data) {
            console.log("BLOCK DATA: ", data);
        }
    }, [data]);

    function startGame() { // Communicate with Phaser to start the game
        authEvents.dispatch({ type: AUTH, score: 0 }); // Now, once the user is authenticated, a message is sent to Phaser to begin the game!
    }

    // Grab NFTs from the user's wallet
    const { getNFTBalances } = useNFTBalances();
    // What specific NFT (determined via contract address) allows the user access?
    const check_address = "0x67A8fE17Db4d441f96f26094677763a2213a3B5f"; // Check if the user has an NFT belonging to that address |/#/ -> token id of contract: 72764254490465410872480155950423590290196157005391788272990870059575402299393
    const network_chain_id = "0x13881"; // The type of chain (eth) that the contract belongs to. In this case, it's the Mumbai testnet
    // Find the metadata of the NFT (like the image) and process it so it can be rendered into the game
    const nftMetadata = [];
    const findNFTMetadata = async (__data) => {
        let p = 0;
        for (let i = 0; i < __data.length; i++) {
            console.log(__data[i].token_address);
            if (__data[i].token_adress === check_address) { // If the nft (in the user's wallet) being checked is equal to the desired nft set above:
                console.log(__data[i].token_uri);
                nftMetadata[p] = __data[i].token_uri;
                p++;
            }
        }
    };
    letDemoNFTimageURL = ""
    const getJSON = async (_metadata) =>{
        try {
            await axios.get(_metadata).then((res) => {
                console.log("Initial image URL: ", res.data?.image);
                letDemoNFTimageURL = res.data?.image;
                // If the NFT's image is already a Moralis IPFS link -> skip further img processing
                if (letDemoNFTimageURL.match("moralis")) {
                } else {
                    let imageSplit = res.data?.image.split("/");
                    console.log("IMAGE CID: ", res.data?.image.split("/"));
                    demoNFTimageURL = 
                        "https://ipfs.moralis.io:2053/ipfs" +
                        imageSplit[2] + 
                        "/" + 
                        imageSplit[3];
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    // Process NFT metadata to locate renderable image data
    const compileNFT = async (___user, __data) => {
        await findNFTMetadata(__data);
        await getJSON(nftMetadata[0])
        console.log("Final NFT Image URL: ", demoNFTimageURL);

        // Check valid metadata available from the NFT
        if (demoNFTimageURL === "") {
        } else {
            // Valid NFT holders can play: change scene within Phaser
            nftEvents.dispatch({ type: LOAD_NFT, nft: demoNFTimageURL });
            startGame(___user, demoNFTimageURL);
        }
    };

    // Check user's balance to see if they have the desired NFT in their wallet
    const checkNFTBalance = async (__user) => {
        let valid = false;
        await getNFTBalances({
            params: {
                chain: network_chain_id,
            },
        })
            .then(function (_data) { // Take the data from the user's wallet as a response
                console.log(_data); // Call the data to console
 
                // Check for matching NFT in user's wallet
                if (!_data || _data?.result.length === 0) {
                    // No NFTs returned (false result)
                    console.log("Wallet does not contain desired NFT");
                    authEvents.dispatch({ type: AUTH, player: null });
                    logout();
                    console.log("User's address has been logged out");
                } else {
                    valid = _data.result.some(
                        (elem) => elem.token_address === check_address
                    );

                    console.log(valid);
                    if (valid) { // Valid NFT found in user's wallet
                        console.log("Access granted: ", valid)

                        if (!valid) {

                        }
                    }
                }
            })
    }

    const login = async () => {
        if (!isAuthenticated) {
            await authenticate({ signingMessage: "Log in with Moralis" })
                .then(function (user) {
                    console.log("logged in user: ", user);
                    console.log(user?.get("ethAddress"));
                    startGame();
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    const logOut = async () => {
        await logout();
        console.log("logged out user");
    };

    if (!loaded) {
        setLoaded(true);
        // Phaser game configuration
        const config = {
            type: Phaser.AUTO,
            parent: "game-container",
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
            autoFocus: true,
            fps: {
                target: 60,
            },
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { y: 200 },
                    debug: false,
                },
            },
            backgroundColor: "#282c34",
            scale: {
                mode: Phaser.Scale.ScaleModes.NONE,
            },
            scene: [Boot, Preloader, MainMenu, MainGame],
        };

        // Initialise the Phaser Canvas
        if (game === null) {
            game = new Phaser.Game(config);
        }

        // Listen to in-game events to detect input/output in the game (used for things like detecting when the game starts so we can send a request to sign the user in)
        game.events.on("LOGIN_PLAYER", (event) => {
            console.log("Login via web3 wallet")
            login();
        });
        
        // When GAME_OVER event interacts with chain
        game.events.on("BLOCK_CHECK", (event) => {
            console.log("Game event triggered web3 function");
            
            // Trigger fetching of on-chain data to test connection
            fetch(); // fetch data of block (currently on mumbai testnet) and return relevant data
        });
    }
    
    return <></>;
}

export default PhaserApp;