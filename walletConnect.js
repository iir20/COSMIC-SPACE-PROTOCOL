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
        const userWallet = accounts[0];

        // Initialize user data if not already present
        let userData = JSON.parse(localStorage.getItem('userData')) || {};
        if (!userData[userWallet]) {
            userData[userWallet] = { balance: 1000, staked: 0, rewards: 0 };
            localStorage.setItem('userData', JSON.stringify(userData));
            alert('Wallet connected! 1000 xCIS credited to your balance.');
        } else {
            alert('Wallet connected! Welcome back.');
        }

        console.log('Connected wallet:', userWallet);
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
    }
}

// Export functions for use in the application
export { isWalletAvailable, connectWallet };
