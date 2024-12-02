// walletConnect.js

// Function to check if a crypto wallet is available
function isWalletAvailable() {
    return typeof window.ethereum !== 'undefined';
}

// Function to connect to the user's wallet
async function connectWallet() {
    if (!isWalletAvailable()) {
        alert('MetaMask or another crypto wallet is not installed. Please install it to continue.');
        return;
    }

    try {
        // Request wallet connection
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        alert(`Wallet connected: ${account}`);
        
        // Update UI with connected wallet address
        document.querySelector('.wallet-connect').textContent = `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`;
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
    }
}

// Attach event listener to wallet connect button
document.addEventListener('DOMContentLoaded', () => {
    const walletButton = document.querySelector('.wallet-connect');
    walletButton.addEventListener('click', connectWallet);
});
