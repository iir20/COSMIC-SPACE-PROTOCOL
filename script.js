// Load user data from localStorage
function getUserData() {
    return JSON.parse(localStorage.getItem('userData')) || { xCIS: 100, CIS: 0 }; // Default balance
}

// Save user data to localStorage
function saveUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Initialize user data
let userData = getUserData();

// Update balance display
function updateBalanceDisplay() {
    document.querySelector('.xcis-balance').textContent = `xCIS: ${userData.xCIS}`;
    document.querySelector('.cis-balance').textContent = `CIS: ${userData.CIS}`;
}

// Staking system
function setupStakingSystem() {
    const stakeBtn = document.querySelector('#stake-btn');
    const stakeInput = document.querySelector('#stake-input');
    const durationRadios = document.querySelectorAll('input[name="duration"]');
    const stakeList = document.querySelector('.stake-list');

    const rewardMultipliers = { 30: 1.3, 60: 1.6, 90: 1.9, 120: 2.2 }; // Duration in days

    stakeBtn.addEventListener('click', () => {
        const stakeAmount = parseFloat(stakeInput.value);
        const selectedDuration = Array.from(durationRadios).find(radio => radio.checked)?.value;

        if (!stakeAmount || stakeAmount <= 0) {
            alert('Please enter a valid xCIS amount.');
            return;
        }

        if (!selectedDuration) {
            alert('Please select a staking duration.');
            return;
        }

        if (stakeAmount > userData.xCIS) {
            alert('Insufficient xCIS balance.');
            return;
        }

        // Update user balance and calculate rewards
        userData.xCIS -= stakeAmount;
        const reward = Math.round(stakeAmount * rewardMultipliers[selectedDuration]);
        saveUserData(userData);
        updateBalanceDisplay();

        // Add stake entry
        const stakeItem = document.createElement('div');
        stakeItem.classList.add('stake-item');
        stakeItem.innerHTML = `
            <p>${stakeAmount} xCIS - ${selectedDuration} Days (Reward: ${reward} xCIS)</p>
            <button class="claim-btn">Claim</button>
        `;
        stakeList.appendChild(stakeItem);

        // Claim functionality
        stakeItem.querySelector('.claim-btn').addEventListener('click', () => {
            userData.xCIS += reward;
            saveUserData(userData);
            updateBalanceDisplay();
            stakeList.removeChild(stakeItem);
            alert(`Claimed ${reward} xCIS successfully.`);
        });

        alert(`Staked ${stakeAmount} xCIS for ${selectedDuration} days. Potential reward: ${reward} xCIS.`);
    });
}

// Point conversion system
function setupConversionSystem() {
    const convertBtn = document.querySelector('#convert-btn');
    const convertInput = document.querySelector('#convert-input');
    const conversionRate = 10; // Example: 10 xCIS = 1 CIS

    convertBtn.addEventListener('click', () => {
        const convertAmount = parseFloat(convertInput.value);

        if (!convertAmount || convertAmount <= 0) {
            alert('Please enter a valid xCIS amount.');
            return;
        }

        if (convertAmount > userData.xCIS) {
            alert('Insufficient xCIS balance.');
            return;
        }

        // Perform conversion
        const convertedCIS = Math.floor(convertAmount / conversionRate);
        userData.xCIS -= convertAmount;
        userData.CIS += convertedCIS;
        saveUserData(userData);
        updateBalanceDisplay();

        alert(`Converted ${convertAmount} xCIS to ${convertedCIS} CIS.`);
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    updateBalanceDisplay();
    setupStakingSystem();
    setupConversionSystem();
});
