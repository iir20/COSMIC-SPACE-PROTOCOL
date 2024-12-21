// Wallet connection functionality
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask or another crypto wallet is not installed. Please install it to continue.');
        return;
    }

    try {
        // Request wallet connection
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0];
        alert(`Wallet connected: ${walletAddress}`);
        document.querySelector('.wallet-address').textContent = `Wallet: ${walletAddress}`;
    } catch (error) {
        console.error('Wallet connection failed:', error);
        alert('Failed to connect wallet. Please try again.');
    }
}

// Setup wallet connect button
document.addEventListener('DOMContentLoaded', () => {
    const walletConnectBtn = document.querySelector('#wallet-connect-btn');
    walletConnectBtn.addEventListener('click', connectWallet);
});
