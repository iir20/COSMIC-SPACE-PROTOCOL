// script.js

// Load user data from localStorage
function getUserData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    return userData;
}

// Save user data to localStorage
function saveUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Stake xCIS coins
function stakeCoins(wallet, amount) {
    const userData = getUserData();
    const user = userData[wallet];

    if (!user || user.balance < amount) {
        alert('Insufficient balance to stake.');
        return;
    }

    // Update user data
    user.balance -= amount;
    user.staked += amount;
    user.lastStakeTime = Date.now(); // Record the time of staking
    saveUserData(userData);

    alert(`Successfully staked ${amount} xCIS.`);
    updateUI(wallet);
}

// Calculate rewards based on staking duration
function calculateRewards(wallet) {
    const userData = getUserData();
    const user = userData[wallet];

    if (!user || !user.staked || !user.lastStakeTime) {
        return 0;
    }

    const currentTime = Date.now();
    const stakingDuration = currentTime - user.lastStakeTime; // Duration in milliseconds

    // Reward rate: 0.01 xCIS per second per staked xCIS
    const rewardRate = 0.01;
    const rewards = (stakingDuration / 1000) * user.staked * rewardRate;

    return rewards;
}

// Claim rewards
function claimRewards(wallet) {
    const userData = getUserData();
    const user = userData[wallet];

    if (!user || !user.staked) {
        alert('No staked coins or rewards available.');
        return;
    }

    const rewards = calculateRewards(wallet);
    user.balance += rewards; // Add rewards to balance
    user.lastStakeTime = Date.now(); // Reset staking time
    saveUserData(userData);

    alert(`Successfully claimed ${rewards.toFixed(2)} xCIS rewards.`);
    updateUI(wallet);
}

// Update UI with user data
function updateUI(wallet) {
    const userData = getUserData();
    const user = userData[wallet];

    if (user) {
        document.querySelector('.balance').textContent = `Balance: ${user.balance.toFixed(2)} xCIS`;
        document.querySelector('.staked').textContent = `Staked: ${user.staked.toFixed(2)} xCIS`;
        document.querySelector('.rewards').textContent = `Rewards: ${calculateRewards(wallet).toFixed(2)} xCIS`;
    }
}

// Event listeners for staking and claiming rewards
document.querySelector('.stake-btn').addEventListener('click', () => {
    const wallet = window.ethereum.selectedAddress; // Current wallet
    const amount = parseFloat(document.querySelector('.stake-input').value);
    if (isNaN(amount) || amount <= 0) {
        alert('Enter a valid amount to stake.');
        return;
    }
    stakeCoins(wallet, amount);
});

document.querySelector('.claim-btn').addEventListener('click', () => {
    const wallet = window.ethereum.selectedAddress; // Current wallet
    claimRewards(wallet);
});
