document.addEventListener('DOMContentLoaded', () => {
    // User Data
    let userData = JSON.parse(localStorage.getItem('userData')) || { xCIS: 100, CIS: 0 };

    // Update Balances
    function updateBalanceDisplay() {
        document.querySelector('.xcis-balance').textContent = `xCIS: ${userData.xCIS}`;
        document.querySelector('.cis-balance').textContent = `CIS: ${userData.CIS}`;
    }

    // Save Data
    function saveUserData() {
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    // Wallet Connect
    document.querySelector('#wallet-connect-btn').addEventListener('click', async () => {
        if (typeof window.ethereum === 'undefined') {
            alert('MetaMask not installed!');
            return;
        }

        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];
            document.querySelector('.wallet-address').textContent = `Wallet: ${walletAddress}`;
            alert(`Wallet Connected: ${walletAddress}`);
        } catch (error) {
            console.error(error);
            alert('Failed to connect wallet.');
        }
    });

    // Staking System
    document.querySelector('#stake-btn').addEventListener('click', () => {
        const stakeAmount = parseFloat(document.querySelector('#stake-input').value);
        const duration = document.querySelector('input[name="duration"]:checked')?.value;

        if (!stakeAmount || stakeAmount <= 0) {
            alert('Enter a valid xCIS amount.');
            return;
        }

        if (!duration) {
            alert('Select a staking duration.');
            return;
        }

        if (stakeAmount > userData.xCIS) {
            alert('Insufficient balance.');
            return;
        }

        const rewardMultiplier = { 30: 1.3, 60: 1.6, 90: 1.9, 120: 2.2 };
        const reward = Math.round(stakeAmount * rewardMultiplier[duration]);

        userData.xCIS -= stakeAmount;
        saveUserData();
        updateBalanceDisplay();

        const stakeList = document.querySelector('.stake-list');
        const stakeItem = document.createElement('div');
        stakeItem.innerHTML = `
            <p>${stakeAmount} xCIS for ${duration} days (Reward: ${reward} xCIS)</p>
            <button class="claim-btn">Claim</button>
        `;
        stakeList.appendChild(stakeItem);

        stakeItem.querySelector('.claim-btn').addEventListener('click', () => {
            userData.xCIS += reward;
            saveUserData();
            updateBalanceDisplay();
            stakeList.removeChild(stakeItem);
            alert(`Claimed ${reward} xCIS!`);
        });

        alert(`Staked ${stakeAmount} xCIS for ${duration} days. Reward: ${reward} xCIS.`);
    });

    // Conversion System
    document.querySelector('#convert-btn').addEventListener('click', () => {
        const convertAmount = parseFloat(document.querySelector('#convert-input').value);
        const conversionRate = 10;

        if (!convertAmount || convertAmount <= 0) {
            alert('Enter a valid xCIS amount.');
            return;
        }

        if (convertAmount > userData.xCIS) {
            alert('Insufficient balance.');
            return;
        }

        const convertedCIS = Math.floor(convertAmount / conversionRate);
        userData.xCIS -= convertAmount;
        userData.CIS += convertedCIS;
        saveUserData();
        updateBalanceDisplay();

        alert(`Converted ${convertAmount} xCIS to ${convertedCIS} CIS.`);
    });

    // Initialize Display
    updateBalanceDisplay();
});
