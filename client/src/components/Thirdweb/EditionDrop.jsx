import { useAddress, useMetamask } from '@thirdweb-dev/react';

const App = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address:", address);

  // If the user hasn't connected their wallet to the frontend
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to Astronaut Training</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  // Display this once/if the user has authenticated using their wallet
  return (
    <div className="landing">
      <h1>👀 wallet connected, now what!</h1>
    </div>);
}

export default App;