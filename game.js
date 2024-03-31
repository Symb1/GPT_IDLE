// JavaScript code for the idle/clicker game

// Re-assignable variables
let currentBossHP = 1000000000; // Starting bossHP
let startingBossHP = 1000000000; // Initial starting bossHP
let clickValue = 1; // The amount of damage dealt per click
let attackClicks = 0; // Variable to store the number of clicks done by Attack! button
let lastAttackTime = 0; // Variable to store the timestamp of the last click
let ascendClickCount = 0; // The number of times the "Ascend" button has been clicked
let boostUpgrades; // Number of Boost upgrades
let boost2Upgrades; // Number of Boost2 upgrades
let boost3Upgrades; // Make it undefined initially
let auto1Upgrades; // Make it undefined initially
let auto2Upgrades; // Make it undefined initially
let auto3Upgrades; // Make it undefined initially
let auto4Upgrades; // Make it undefined initially
let totalUpgrades = 0; // Total upgrades bought from all buttons
let boostCost = calculateBoostCost(); // Initial boost cost
let boost2Cost = calculateBoost2Cost(); // Initial Boost2 cost
let boost3Cost = calculateBoost3Cost(); // Initial Boost3 cost
let auto1Cost = calculateAuto1Cost(); // Initial Auto1 cost
let auto1ReductionsPerSecond = 0; // Number of reductions by Auto1 per second
let auto2Cost = calculateAuto2Cost(); // Initial Auto2 cost
let auto3Cost = calculateAuto3Cost(); // Initial Auto3 cost
let auto3ReductionsPerSecond = 0; // Number of reductions by Auto3 per second
let auto4Cost = calculateAuto4Cost(); // Initial Auto4 cost
let auto4ClicksPerSecond = 0; // Number of clicks per second added by Auto4
let auto4AddedToAuto1 = false; // Flag that indicates whether the Auto4 upgrade's contribution has been added to the auto1ReductionsPerSecond value
let magneticFieldCost = calculateMagneticFieldCost(); // Initial Magnetic Field cost
let magneticFieldButtonVisible = false; // Flag to check if the Magnetic Field should be visible or not
let shieldValue = 0; // Value of the shield
let isShieldActive = false; // Flag to check if the shield is active
let shieldDestroyed = false; // Flag to indicate whether the shield has been destroyed
let shieldActivated2 = false; // Flag to track whether the shield has been activated the second time
let shieldAttackSoundCooldown = false; // Flag to track the cooldown period for shield attack sound
let regenerationInterval; // Interval for boss regeneration
let isTimerRunning = false; // Flag to check if the timer is running
let timerInterval; // Interval for the timer
let countdownInterval; // Interval for the countdown timer
let totalAchievements = 0; // Global variable to store total number of achievements
let unlockedAchievements = []; // Stores an array of unlocked achievement names/descriptions
let isAudioOn = false; // Audio is off by default
let attackSoundCooldown = false; // Flag to track the cooldown period

// Sound effects
const attackSound = new Audio('sounds/attack.ogg');
attackSound.volume = 0.2;
const reconstructionSound = new Audio('sounds/rec.ogg');
reconstructionSound.volume = 0.5;
const shieldSound = new Audio('sounds/shield.ogg');
shieldSound.volume = 0.6;
const shieldAttackSound = new Audio('sounds/shieldatt.ogg');
shieldAttackSound.volume = 0.2;
const levelUpSound = new Audio('sounds/lvlup.mp3');
levelUpSound.volume = 0.4;
const ascendSound = new Audio('sounds/asc.mp3');
ascendSound.volume = 0.5;
const countdownFinishedSound = new Audio('sounds/cntdwn.mp3');
countdownFinishedSound.volume = 0.3;
const fireSound = new Audio('sounds/fire.wav');
fireSound.volume = 0.5;
const upgradeSound = new Audio('sounds/upgrd.mp3');
upgradeSound.volume = 0.5;
const statShield = new Audio('sounds/statshld.mp3');
statShield.volume = 0.5;
const achievementSound = new Audio('sounds/achv.mp3');
achievementSound.volume = 0.5;

// Background music
const backgroundMusic = new Audio('sounds/bckg.mp3');
backgroundMusic.loop = true; // Loop the background music
backgroundMusic.volume = 0.1;
const gameOverSound = new Audio('sounds/cg.mp3');
gameOverSound.loop = true; // Set it to loop

// Toggles the audio on/off and plays/pauses the background music
function toggleAudio() {
    isAudioOn = !isAudioOn;
    const audioToggle = document.querySelector('.audio-toggle');
    audioToggle.classList.toggle('audio-on');

    if (isAudioOn) {
        backgroundMusic.play(); // Start background music
    } else {
        backgroundMusic.pause(); // Stop background music
        backgroundMusic.currentTime = 0; // Reset the background music to start from the beginning
    }
}

// Toggles the night mode theme on/off for the game
function toggleNightMode() {
    const body = document.querySelector('body');
    body.classList.toggle('night-mode');

    const shieldText = document.getElementById('shield-text');
    if (shieldText) { // Check if shieldText is not null
        if (body.classList.contains('night-mode')) {
            shieldText.style.color = 'yellow';
        } else {
            shieldText.style.color = '';
        }
    }
}

// Game menu element
const hamburgerButton = document.querySelector('.hamburger-button');
const gameMenu = document.querySelector('.game-menu');
// Toggle the game menu when the hamburger button is clicked
hamburgerButton.addEventListener('click', () => {
    gameMenu.classList.toggle('open');
});

// Function to start pulsating for buttons
function startPulsating() {
    const boostBtn = document.getElementById('boostBtn');
    const boost2Btn = document.getElementById('boost2Btn');
    const auto1Btn = document.getElementById('auto1Btn');
    const auto2Btn = document.getElementById('auto2Btn');
    const auto3Btn = document.getElementById('auto3Btn');
    const auto4Btn = document.getElementById('auto4Btn');
    const magneticFieldBtn = document.getElementById('magneticFieldBtn');

    // Initially hide the Magnetic Field button
    magneticFieldBtn.style.display = 'none';

    if (boostCost <= differenceBetweenBossHP()) {
        boostBtn.classList.add('ready-to-boost');
    } else {
        boostBtn.classList.remove('ready-to-boost');
    }

    if (boost2Cost <= differenceBetweenBossHP()) {
        boost2Btn.classList.add('ready-to-boost2');
    } else {
        boost2Btn.classList.remove('ready-to-boost2');
    }

    if (auto1Cost <= differenceBetweenBossHP()) {
        auto1Btn.classList.add('ready-to-boost');
    } else {
        auto1Btn.classList.remove('ready-to-boost');
    }

    if (auto2Cost <= differenceBetweenBossHP()) {
        auto2Btn.classList.add('ready-to-boost');
    } else {
        auto2Btn.classList.remove('ready-to-boost');
    }

    if (auto3Cost <= differenceBetweenBossHP()) {
        auto3Btn.classList.add('ready-to-boost');
    } else {
        auto3Btn.classList.remove('ready-to-boost');
    }

    if (boost3Cost <= differenceBetweenBossHP()) {
        boost3Btn.classList.add('ready-to-boost');
    } else {
        boost3Btn.classList.remove('ready-to-boost');
    }

    // Show or hide the Magnetic Field button based on currentBossHP and activation status
    if (magneticFieldCost <= differenceBetweenBossHP() && !magneticFieldBtn.classList.contains('purchased')) {
        magneticFieldBtn.classList.add('ready-to-boost');
    } else {
        magneticFieldBtn.classList.remove('ready-to-boost');
    }

    // Handle Auto4 button pulsating
    if (auto4Cost <= differenceBetweenBossHP() && !auto4Upgrades) {
        auto4Btn.classList.add('ready-to-boost', 'pulsating-button');
    } else {
        auto4Btn.classList.remove('ready-to-boost', 'pulsating-button');
    }

    toggleMagneticFieldButtonVisibility(); // Call the new function to toggle visibility

    setTimeout(startPulsating, 100); // Check every 100 milliseconds
}

// Function to toggle countdown timer and fire button visibility
function toggleVisibility() {
    const countdownTimer = document.getElementById('countdownTimer');
    const fireBtn = document.getElementById('fireBtn');
    const tier1Text = document.getElementById('tier1Text');
    const tier2Text = document.getElementById('tier2Text');
    const boost3Btn = document.getElementById('boost3Btn');
    const boost2Btn = document.getElementById('boost2Btn');
    const auto1Btn = document.getElementById('auto1Btn');
    const auto2Btn = document.getElementById('auto2Btn');
    const auto3Btn = document.getElementById('auto3Btn');
    const auto4Btn = document.getElementById('auto4Btn');

    totalUpgrades = 0;
    totalUpgrades += (typeof boostUpgrades === 'number') ? boostUpgrades : 0;
    totalUpgrades += (typeof boost2Upgrades === 'number') ? boost2Upgrades : 0;
    totalUpgrades += (typeof boost3Upgrades === 'number') ? boost3Upgrades : 0;
    totalUpgrades += (typeof auto1Upgrades === 'number') ? auto1Upgrades : 0;
    totalUpgrades += (typeof auto2Upgrades === 'number') ? auto2Upgrades : 0;
    totalUpgrades += (typeof auto3Upgrades === 'number') ? auto3Upgrades : 0;

    if (totalUpgrades >= 90) {
        countdownTimer.style.display = 'block';
        fireBtn.style.display = 'block';
    } else {
        countdownTimer.style.display = 'none';
        fireBtn.style.display = 'none';
    }

    if (totalUpgrades >= 30) {
        tier1Text.style.display = 'block'; // Show the "Tier 1" text
    } else {
        tier1Text.style.display = 'none'; // Hide the "Tier 1" text
    }

    if (totalUpgrades >= 90) {
        tier2Text.style.display = 'block'; // Show the "Tier 2" text
    } else {
        tier2Text.style.display = 'none'; // Hide the "Tier 2" text
    }

    // Show/hide Boost3 button based on boostUpgrades count
    if (boostUpgrades >= 10) {
        boost3Btn.style.display = 'inline-block';
    } else {
        boost3Btn.style.display = 'none';
    }

    // Show/hide Boost2 button based on boost3Upgrades count
    if (boost3Upgrades >= 10) {
        boost2Btn.style.display = 'inline-block';
    } else {
        boost2Btn.style.display = 'none';
    }

    // Show/hide Auto1 button based on totalUpgrades count
    if (totalUpgrades >= 30) {
        auto1Btn.style.display = 'inline-block';
    } else {
        auto1Btn.style.display = 'none';
    }

    // Show/hide Auto2 button based on auto1Upgrades count
    if (auto1Upgrades >= 20) {
        auto2Btn.style.display = 'inline-block';
    } else {
        auto2Btn.style.display = 'none';
    }

    // Show/hide Auto4 button based on auto2Upgrades count
    if (auto2Upgrades >= 5 && totalUpgrades >= 120) {
        auto4Btn.style.display = 'inline-block';
    } else {
        auto4Btn.style.display = 'none';
    }

    // Show/hide Auto3 button based on auto2Upgrades count
    if (ascendClickCount >= 1 && totalUpgrades >= 90) {
        auto3Btn.style.display = 'inline-block';
    } else {
        auto3Btn.style.display = 'none';
    }

    updateTotalUpgrades(); // Call updateTotalUpgrades() after updating totalUpgrades
}

// Function to update the total upgrades and progress bar with achievements
function updateTotalUpgrades() {
    const progress = (totalUpgrades / 120) * 100;
    const progressBar = document.getElementById('progress');

    // Set color based on total upgrades
    if (totalUpgrades < 30) {
        progressBar.style.backgroundColor = 'red';
    } else if (totalUpgrades < 90) {
        progressBar.style.backgroundColor = 'orange';
    } else if (totalUpgrades < 110) {
        progressBar.style.backgroundColor = '#e4f03a';
    } else {
        progressBar.style.backgroundColor = '#4caf50'; // Default Color
    }

    progressBar.style.width = `${progress}%`;

    if (totalUpgrades === 10 && !unlockedAchievements.includes("A wild button has appeared!")) {
        showAchievementPopup("A wild button has appeared!");
        unlockedAchievements.push("A wild button has appeared!");
    } else if (totalUpgrades === 30 && !unlockedAchievements.includes("Tier 1 UNLOCKED")) {
        showAchievementPopup("Tier 1 UNLOCKED");
        unlockedAchievements.push("Tier 1 UNLOCKED");
        if (isAudioOn) {
            upgradeSound.currentTime = 0; // Reset the audio to start from the beginning
            upgradeSound.play();
        }
    } else if (totalUpgrades === 90 && !unlockedAchievements.includes("Tier 2 UNLOCKED")) {
        showAchievementPopup("Tier 2 UNLOCKED");
        unlockedAchievements.push("Tier 2 UNLOCKED");
        if (isAudioOn) {
            upgradeSound.currentTime = 0; // Reset the audio to start from the beginning
            upgradeSound.play();
        }
    } else if (totalUpgrades === 120 && !unlockedAchievements.includes("There is more to this game?")) {
        showAchievementPopup("There is more to this game?");
        unlockedAchievements.push("There is more to this game?");
        if (isAudioOn) {
            upgradeSound.currentTime = 0; // Reset the audio to start from the beginning
            upgradeSound.play();
        }
    }

    updateTotalUpgradesDisplay(); // Call the function to update the display
}

// Function to animate the button click
function animateButtonClick(buttonId) {
    const button = document.getElementById(buttonId);
    button.style.backgroundColor = 'darkred';

    setTimeout(() => {
        button.style.backgroundColor = 'red';
    }, 300);
}

// Function to calculate the difference between startingBossHP and currentBossHP
function differenceBetweenBossHP() {
    return startingBossHP - currentBossHP;
}

// Function to handle the attack button click
function handleAttack() {
    if (!isShieldActive) {
        const now = performance.now(); // Get the current timestamp (using high-precision timer)
        const elapsedTime = now - lastAttackTime; // Calculate the time elapsed since the last click

        // Set anti auto clicker restriction
        if (elapsedTime >= 115) {
            currentBossHP -= clickValue;
            updateBossHP();
            animateButtonClick('attackBtn');
            attackClicks++;
            updateTotalClicksDisplay(); // Update the total clicks display
            checkAchievements();
            updateShieldStatus();
            updateShieldStatus2();

            // Play attack sound effect if audio is on and cooldown is not active
            if (isAudioOn && !attackSoundCooldown) {
                attackSound.currentTime = 0; // Reset the audio to start from the beginning
                attackSound.play();
                attackSoundCooldown = true; // Set the cooldown flag

                // Reset the cooldown flag after 1 second
                setTimeout(function() {
                    attackSoundCooldown = false;
                }, 1000); // Cooldown period of 1 second (1000 milliseconds)
            }

            // Update the timestamp of the last click
            lastAttackTime = now;
        }
    } else {
        handleAttackWithShield(); // Call handleAttackWithShield if shield is active
    }
}

// Prevents the default action when the Enter key is pressed
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
     event.preventDefault(); // Prevent the default action (triggering the Attack! button)
  }
});

// Function to handle the boost button click
function handleBoost() {
    if (boostCost <= differenceBetweenBossHP()) {
        clickValue += 1;
        boostUpgrades = (boostUpgrades || 0) + 1;
        boostCost = calculateBoostCost(); // Recalculate boost cost
        updateBossHP();
        updateBoostCost();
        updateBoostUpgrades();
        updateClickDamage();
        toggleVisibility();
        auto4ClicksPerSecondInterval(); // Call auto4ClicksPerSecondInterval

        // Play the level-up sound effect if audio is on
        if (isAudioOn) {
            levelUpSound.currentTime = 0; // Reset the audio to start from the beginning
            levelUpSound.play();
        }
    } else {
        // Do nothing or handle the case when not enough Amalgam Constructs to boost
    }
}

// Function to handle the Boost2 button click
function handleBoost2() {
    if (boost2Cost <= differenceBetweenBossHP()) {
        clickValue *= 2;
        boost2Upgrades = (boost2Upgrades || 0) + 1;
        boost2Cost = calculateBoost2Cost(); // Recalculate Boost2 cost
        updateBossHP();
        updateBoost2Cost();
        updateBoost2Upgrades();
        updateClickDamage();
        toggleVisibility();
        auto4ClicksPerSecondInterval(); // Call auto4ClicksPerSecondInterval

        if (isAudioOn) {
            levelUpSound.currentTime = 0; // Reset the audio to start from the beginning
            levelUpSound.play();
        }
    } else {
        // Do nothing or handle the case when not enough Amalgam Constructs to boost
    }
}

// Function to handle the Boost3 button click
function handleBoost3() {
    if (boost3Cost <= differenceBetweenBossHP()) {
        clickValue += 10; // Add 10 to the click value
        boost3Upgrades = (boost3Upgrades || 0) + 1;
        boost3Cost = calculateBoost3Cost(); // Recalculate Boost3 cost
        updateBossHP();
        updateBoost3Cost();
        updateBoost3Upgrades();
        updateClickDamage();
        toggleVisibility();
        auto4ClicksPerSecondInterval(); // Call auto4ClicksPerSecondInterval

        // Play the level-up sound effect if audio is on
        if (isAudioOn) {
            levelUpSound.currentTime = 0; // Reset the audio to start from the beginning
            levelUpSound.play();
        }
    } else {
        // Do nothing or handle the case when not enough Amalgam Constructs to boost
    }
}

// Function to handle the Auto1 button click
function handleAuto1() {
    if (auto1Cost <= differenceBetweenBossHP()) {
        auto1ReductionsPerSecond += 10; // Increase auto1ReductionsPerSecond by 20
        auto1Upgrades = (auto1Upgrades || 0) + 1; // Update auto1Upgrades
        auto1Cost = calculateAuto1Cost(); // Recalculate Auto1 cost
        updateBossHP();
        updateAuto1Cost();
        updateAuto1Upgrades();
        updateClickDamage();
        toggleVisibility();
        if (isAudioOn) {
            levelUpSound.currentTime = 0; // Reset the audio to start from the beginning
            levelUpSound.play();
        }
    } else {
        // Do nothing or handle the case when not enough Amalgam Constructs to activate Auto1
    }
}

// Function to continuously reduce bossHP by Auto1 reductions per second
function auto1ReductionInterval() {
    if (!isShieldActive && auto1ReductionsPerSecond > 0) {
        currentBossHP -= auto1ReductionsPerSecond;
        updateBossHP();
        updateShieldStatus();
        updateShieldStatus2();
    }
    auto4ClicksPerSecondInterval(); // Call auto4ClicksPerSecondInterval here
    setTimeout(auto1ReductionInterval, 1000); // Repeat every 1000 milliseconds (1 second)
}

// Function to handle the Auto2 button click
function handleAuto2() {
    if (auto2Cost <= differenceBetweenBossHP()) {
        auto1ReductionsPerSecond *= 1.75; // Increase auto1ReductionsPerSecond by 75%
        auto2Upgrades = (auto2Upgrades || 0) + 1; // Update auto2Upgrades
        auto2Cost = calculateAuto2Cost(); // Recalculate Auto2 cost
        updateBossHP();
        updateAuto2Cost();
        updateAuto2Upgrades();
        updateAuto1Upgrades(); // Update Damage Per Second
        toggleVisibility();
        if (isAudioOn) {
            levelUpSound.currentTime = 0; // Reset the audio to start from the beginning
            levelUpSound.play();
        }
    } else {
        // Do nothing or handle the case when not enough Amalgam Constructs to activate Auto2
    }
}

// Function to handle the Auto3 button click
function handleAuto3() {
    if (auto3Cost <= differenceBetweenBossHP()) {
        auto3ReductionsPerSecond += 1500;
        auto3Upgrades = (auto3Upgrades || 0) + 1; // Update auto3Upgrades
        auto3Cost = calculateAuto3Cost(); // Recalculate Auto3 cost
        updateBossHP();
        updateAuto3Cost();
        updateAuto3Upgrades();
        toggleVisibility();
        if (isAudioOn) {
            levelUpSound.currentTime = 0; // Reset the audio to start from the beginning
            levelUpSound.play();
        }
    } else {
        // Do nothing or handle the case when not enough Amalgam Constructs to activate Auto3
    }
}

// Function to continuously reduce the shield value based on the Auto3 upgrade
function auto3ReductionInterval() {
    if (isShieldActive && auto3ReductionsPerSecond > 0) {
        shieldValue -= auto3ReductionsPerSecond;
        updateShieldDisplay(); // Update the shield value display
        // Check if shield is destroyed
        if (shieldValue <= 0) {
            deactivateShield(); // Deactivate the shield
        }
    }
    setTimeout(auto3ReductionInterval, 1000); // Repeat every 1000 milliseconds (1 second)
}

// Function to handle the Auto4 button click
function handleAuto4() {
    const auto4Btn = document.getElementById('auto4Btn');
    if (auto4Cost <= differenceBetweenBossHP()) {
        if (!auto4Upgrades) {
            auto4Upgrades = 1;
            auto4Btn.classList.add('purchased');
            auto4Btn.classList.remove('ready-to-boost', 'pulsating-button');
            auto4Btn.removeAttribute('onclick');

            // Hide the "Essence:" text and the auto4Cost element
            const essenceSpan = auto4Btn.querySelector('span:first-child');
            const costSpan = document.getElementById('auto4Cost');
            if (essenceSpan && costSpan) {
                essenceSpan.style.display = 'none';
                costSpan.style.display = 'none';
            }
            // Update the button text to "Chrono Matrix ONLINE"
            auto4Btn.innerHTML = "<b>Chrono Matrix</b>";

            updateBossHP();
            toggleVisibility();

            const additionalDps = clickValue * 3;
            auto1ReductionsPerSecond += additionalDps;
            updateAuto1Upgrades();

            if (isAudioOn) {
                levelUpSound.currentTime = 0;
                levelUpSound.play();
            }

            auto4AddedToAuto1 = true;
        }
    } else {
        // Do nothing or handle the case when not enough Amalgam Constructs to activate Auto4
    }
}

// Function to continuously add Auto4 clicks per second to clickValue
function auto4ClicksPerSecondInterval() {
    if (auto4Upgrades) {
        const currentAuto4ClicksPerSecond = clickValue * 3; // Calculate Auto4's contribution based on the current click value
        const additionalDps = currentAuto4ClicksPerSecond - auto4ClicksPerSecond; // Calculate the difference between the current and previous contribution
        auto4ClicksPerSecond = currentAuto4ClicksPerSecond; // Update the auto4ClicksPerSecond variable

        auto1ReductionsPerSecond += additionalDps; // Add the difference to auto1ReductionsPerSecond
        updateAuto1Upgrades(); // Update Damage Per Second display
    } else {
        auto4ClicksPerSecond = 0; // Reset auto4ClicksPerSecond to 0 if Auto4 is not purchased
        auto1ReductionsPerSecond -= auto4ClicksPerSecond; // Remove Auto4's contribution from auto1ReductionsPerSecond
        updateAuto1Upgrades(); // Update Damage Per Second display
    }
    setTimeout(auto4ClicksPerSecondInterval, 1000); // Repeat every 1000 milliseconds (1 second)
}

// Function to handle the Fire button click
function handleFire() {
	    // Clear any existing countdown interval
    clearInterval(countdownInterval);
    countdownInterval = null;

    if (!isTimerRunning && !isShieldActive) {
        isTimerRunning = true;
        let timeLeft = 15; // Timer duration in seconds
        const fireButton = document.getElementById('fireBtn');
        fireButton.disabled = true; // Disable the Fire button while the timer is running
        const timerCircle = document.getElementById('timerCircle');

        // Start the animation by updating the stroke-dashoffset attribute
        timerCircle.setAttribute('stroke-dasharray', '252');
        timerCircle.setAttribute('stroke-dashoffset', '0');

        // Play the fire sound effect immediately when the button is pressed
        if (isAudioOn) {
           fireSound.currentTime = 0; // Reset the audio to start from the beginning
           fireSound.play();
        }

        countdownInterval = setInterval(() => {
            timeLeft -= 1; // Decrement time left
            if (timeLeft <= 0) {
                clearInterval(countdownInterval); // Clear the countdown interval when time is up
                isTimerRunning = false; // Reset the flag
                fireButton.disabled = false; // Enable the Fire button
                timerCircle.setAttribute('stroke-dashoffset', '0'); // Set stroke-dashoffset to 0 after animation ends

                // Apply screen shake effect to the body element
                document.body.classList.add('shake-animation');
                setTimeout(() => {
                    document.body.classList.remove('shake-animation'); // Remove the animation class after 0.5s
                }, 500);

                // Remove 10% of currentBossHP
                const reductionAmount = currentBossHP * 0.001;
                currentBossHP -= reductionAmount;
                updateBossHP(); // Update the boss HP display

                // Set the stroke color to green after the countdown is over
                timerCircle.setAttribute('stroke', '#c28dfc');

                // Show text announcing the amount of HP lost
                const hpLostText = document.createElement('p');
                hpLostText.innerText = `-${formatNumber(reductionAmount, true)} HP`;
                hpLostText.style.color = 'red'; // Set text color to red
                const hpLostContainer = document.getElementById('hpLostContainer');
                hpLostContainer.appendChild(hpLostText);
                let opacity = 1;
                const fadeOutInterval = setInterval(() => {
                    opacity -= 0.1; // Decrease opacity gradually
                    hpLostText.style.opacity = opacity;
                    if (opacity <= 0) {
                        clearInterval(fadeOutInterval); // Stop fading out when opacity reaches 0
                        hpLostContainer.removeChild(hpLostText); // Remove the text after it becomes transparent
                    }
                }, 500); // Repeat every 500 milliseconds

                // Play the countdown finished sound effect if audio is on
                if (isAudioOn) {
                    countdownFinishedSound.currentTime = 0; // Reset the audio to start from the beginning
                    countdownFinishedSound.play();
                }
            } else {
                // Calculate progress percentage
                const progressPercentage = ((15 - timeLeft) / 15) * 100;

                // Dynamically change stroke color based on progress
                if (progressPercentage >= 75) {
                    timerCircle.setAttribute('stroke', '#973cfa');
                } else if (progressPercentage >= 50) {
                    timerCircle.setAttribute('stroke', '#a357f7');
                } else if (progressPercentage >= 25) {
                    timerCircle.setAttribute('stroke', '#ae6af7');
                } else {
                    timerCircle.setAttribute('stroke', '#c28dfc');
                }

                // Update the animation by adjusting the stroke-dashoffset attribute
                const offset = 251 * (progressPercentage / 100);
                timerCircle.setAttribute('stroke-dashoffset', offset);
            }
        }, 1000); // Repeat every second
    } else {
        // When the shield is active, change the button text to "Jammed"
        const fireButton = document.getElementById('fireBtn');
        fireButton.innerText = "Jammed";
    }
}

// Function to activate the shield
function activateShield() {
    if (!isShieldActive && !shieldDestroyed) {
        isShieldActive = true;
        shieldValue = currentBossHP * 0.01; // Set shield value to 10% of current boss HP
        const shieldDisplay = document.getElementById('shieldValue');
        shieldDisplay.innerText = formatNumber(shieldValue, false, false, false, true); // Update shield value in HTML
        const shieldContainer = document.getElementById('shield');
        shieldContainer.style.visibility = 'visible'; // Make the shield container visible
        shieldContainer.classList.add('shield-active'); // Add shield-active class to apply the main pulsating animation
        shieldContainer.classList.add('shield-pulsate'); // Add shield-pulsate class to apply the separate pulsating animation for the shield
        updateFireButtonText();

        // Play the shield sound effect if audio is on
        if (isAudioOn) {
            shieldSound.currentTime = 0; // Reset the audio to start from the beginning
            shieldSound.play();
        }
    }
}

// Function to handle the attack while the shield is active
function handleAttackWithShield() {
    if (isShieldActive) {
        // If shield is active, do not reduce shield value or boss HP
        animateButtonClick('attackBtn');

        // Play the shield attack sound effect if audio is on and cooldown is not active
        if (isAudioOn && !shieldAttackSoundCooldown) {
            shieldAttackSound.currentTime = 0; // Reset the audio to start from the beginning
            shieldAttackSound.play();
            shieldAttackSoundCooldown = true; // Set the cooldown flag

            // Reset the cooldown flag after 1 second
            setTimeout(function() {
                shieldAttackSoundCooldown = false;
            }, 900); // Cooldown period of 1 second (1000 milliseconds)
        }
    } else {
        // If shield is not active, reduce boss HP by clickValue
        currentBossHP -= clickValue;
        updateBossHP();
        animateButtonClick('attackBtn');
        attackClicks++;
        checkAchievements();
    }
}

// Function to deactivate the shield
function deactivateShield() {
    if (isShieldActive) {
        isShieldActive = false;
        shieldValue = 0;
        const shieldDisplay = document.getElementById('shieldValue');
        shieldDisplay.innerText = '0'; // Reset shield value in HTML
        const shieldContainer = document.getElementById('shield');
        shieldContainer.style.visibility = 'hidden'; // Hide the shield container
        shieldContainer.classList.remove('shield-active'); // Remove shield-active class to stop the main pulsating animation
        shieldContainer.classList.remove('shield-pulsate'); // Remove shield-pulsate class to stop the shield pulsating animation
        shieldDestroyed = true; // Set the shield destroyed flag to true
        updateFireButtonText();
    }
}

// Function to start the boss regeneration after a threshold is reached
function startBossRegeneration() {
    const reconstructionText = document.getElementById('reconstructing');
    const regenerationThreshold = startingBossHP * 0.75;

    // Start the regeneration process
    let isRegenerating = false;
    regenerationInterval = setInterval(() => {
        if (currentBossHP <= regenerationThreshold && !isRegenerating) {
            reconstructionText.style.display = 'block';
            isRegenerating = true;

            // Play the reconstruction sound effect if audio is on
            if (isAudioOn) {
                reconstructionSound.currentTime = 0; // Reset the audio to start from the beginning
                reconstructionSound.play();
            }
        }
        if (isRegenerating) {
            currentBossHP += 1000000;
            if (currentBossHP >= startingBossHP) {
                currentBossHP = startingBossHP; // Cap the HP to startingBossHP
                reconstructionText.style.display = 'none';
                isRegenerating = false; // Reset the flag
            }
            updateBossHP();
        }
    }, 1000); // Repeat every 1000 milliseconds (1 second)
}

// Function to show/hide the Magnetic Field button
function toggleMagneticFieldButtonVisibility() {
    const magneticFieldBtn = document.getElementById('magneticFieldBtn');
    const regenerationThreshold = startingBossHP * 0.75;

    if (ascendClickCount >= 2 && currentBossHP <= regenerationThreshold && !magneticFieldButtonVisible) {
        magneticFieldBtn.style.display = 'inline-block'; // Show the Magnetic Field button
        magneticFieldButtonVisible = true; // Set the flag to true
    } else if (magneticFieldButtonVisible) {
        magneticFieldBtn.style.display = 'inline-block'; // Keep the Magnetic Field button visible
    } else {
        magneticFieldBtn.style.display = 'none'; // Hide the Magnetic Field button
    }
}

// Function to handle the Magnetic Field button click
function handleMagneticField() {
  const magneticFieldBtn = document.getElementById('magneticFieldBtn');
    if (magneticFieldCost <= differenceBetweenBossHP() && !magneticFieldBtn.classList.contains('purchased')) {
        clearInterval(regenerationInterval); // Stop boss regeneration
        magneticFieldCost = calculateMagneticFieldCost(); // Recalculate Magnetic Field cost
        document.getElementById('reconstructing').style.display = 'none'; // Hide the "Siphon Essence..." text
        magneticFieldBtn.innerHTML = "<b>QUANTUM NULLIFIER</b>"; // Reset button text
        magneticFieldBtn.classList.add('purchased'); // Add the 'purchased' class
        magneticFieldBtn.removeAttribute('onclick'); // Remove onclick attribute

        if (isAudioOn) {
            statShield.currentTime = 0; // Reset the audio to start from the beginning
            statShield.play();
        }
    }
}

// Function to handle achievements
function checkAchievements() {
    if (attackClicks === 10 && !unlockedAchievements.includes("You done the thing!")) {
        showAchievementPopup("You done the thing!");
        unlockedAchievements.push("You done the thing!");
    } else if (attackClicks === 100 && !unlockedAchievements.includes("You done the thing again!")) {
        showAchievementPopup("You done the thing again!");
        unlockedAchievements.push("You done the thing again!");
    } else if (attackClicks === 500 && !unlockedAchievements.includes("You keep doing the thing over and over!")) {
        showAchievementPopup("You keep doing the thing over and over!");
        unlockedAchievements.push("You keep doing the thing over and over!");
    } else if (attackClicks === 1000 && !unlockedAchievements.includes("Add witty text here")) {
        showAchievementPopup("Add witty text here");
        unlockedAchievements.push("Add witty text here");
    } else if (attackClicks === 2000 && !unlockedAchievements.includes("Check your mouse warranty")) {
        showAchievementPopup("Check your mouse warranty");
        unlockedAchievements.push("Check your mouse warranty");
    }
}

// Function to show achievement popup with specified text
function showAchievementPopup(text) {
    const achievementPopup = document.getElementById('achievementPopup');
    const achievementText = document.getElementById('achievementText');
    const achievementIcon = document.getElementById('achievementIcon');

    achievementText.innerText = text;
    achievementPopup.style.display = "block"; // Show the achievement popup
    achievementIcon.style.display = "inline-block"; // Show the achievement icon

    totalAchievements++; // Increment total achievements
    updateTotalAchievementsDisplay(); // Call the function to update the display

    // Play the achievement sound effect if audio is on
    if (isAudioOn) {
        achievementSound.currentTime = 0; // Reset the audio to start from the beginning
        achievementSound.play();
    }

    // Hide the achievement popup and icon after 5 seconds
    setTimeout(function() {
        achievementPopup.style.display = "none"; // Hide the achievement popup
        achievementIcon.style.display = "none"; // Hide the achievement icon
    }, 5000);
}

//Ascend function that will reset all your progress
function handleAscend() {
    // Check if "Ascend" has been clicked twice already
    if (ascendClickCount >= 2) {
        return; // Exit the function if the limit has been reached
    }

    if (isTimerRunning) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        isTimerRunning = false;
        const fireButton = document.getElementById('fireBtn');
        fireButton.disabled = false; // Enable the Fire button
        const timerCircle = document.getElementById('timerCircle');
        timerCircle.setAttribute('stroke-dashoffset', '0'); // Reset the timer circle animation
    }

    // Reduce startingBossHP by 90%
    startingBossHP = startingBossHP * 0.1;

    // Reset all variables to their initial values
    currentBossHP = startingBossHP;
    clickValue = 1;
    boostUpgrades = undefined;
    boost2Upgrades = undefined;
    boost3Upgrades = undefined;
    boostCost = calculateBoostCost();
    boost2Cost = calculateBoost2Cost();
    boost3Cost = calculateBoost3Cost();
    auto1Cost = calculateAuto1Cost();
    auto1Upgrades = undefined;
    auto1ReductionsPerSecond = 0;
    auto2Cost = calculateAuto2Cost();
    auto2Upgrades = undefined;
    totalUpgrades = 0;
    magneticFieldCost = calculateMagneticFieldCost();
    isTimerRunning = false;
    attackClicks = 0;
    shieldValue = 0;
    isShieldActive = false;
    shieldDestroyed = false;
    shieldActivated2 = false;
    auto3Cost = calculateAuto3Cost();
    auto3Upgrades = undefined;
    auto4Cost = calculateAuto4Cost();
    auto3ReductionsPerSecond = 0;
    magneticFieldButtonVisible = false;
    auto4Upgrades = undefined;
    auto1ReductionsPerSecond -= clickValue * 3;
    auto4AddedToAuto1 = false;

    // Reset displayed values in the HTML
    updateBossHP();
    updateBoostCost();
    updateBoost2Cost();
    updateBoostUpgrades();
    updateBoost2Upgrades();
    updateClickDamage();
    updateAuto1Cost();
    updateAuto2Cost();
    updateAuto3Cost();
    showAscendOverlay();
    updateAuto1Upgrades();
    updateAmalgamEssence();

    // Hide/reset related elements
    document.getElementById('reconstructing').style.display = 'none';
    document.getElementById('magneticFieldBtn').setAttribute('onclick', 'handleMagneticField()');
    document.getElementById('countdownTimer').style.display = 'none';
    document.getElementById('fireBtn').style.display = 'none';
    document.getElementById('auto3Btn').style.display = 'none';
    document.getElementById('tier1Text').style.display = 'none';
    document.getElementById('tier2Text').style.display = 'none';

    const totalUpgradesDisplay = document.getElementById('totalUpgradesDisplay');
    totalUpgradesDisplay.innerText = '0';

    const totalClicksDisplay = document.getElementById('totalClicksDisplay');
    totalClicksDisplay.innerText = '0';

    const boost3UpgradesElement = document.getElementById('boost3Upgrades');
    boost3UpgradesElement.innerText = '0';

    const auto3UpgradesElement = document.getElementById('auto3Upgrades');
    auto3UpgradesElement.innerText = '0';
    const auto3ReductionsPerSecondElement = document.getElementById('auto3ReductionsPerSecond');
    auto3ReductionsPerSecondElement.innerText = '0';

    const auto2UpgradesElement = document.getElementById('auto2Upgrades');
    auto2UpgradesElement.innerText = '0';

    const magneticFieldBtn = document.getElementById('magneticFieldBtn');
    magneticFieldBtn.classList.remove('purchased');
    magneticFieldBtn.style.display = 'none';

    const auto4Btn = document.getElementById('auto4Btn');
    auto4Btn.classList.remove('ready-to-boost', 'pulsating-button'); // Remove pulsating classes
    auto4Btn.classList.remove('purchased'); // Remove the 'purchased' class
    auto4Btn.setAttribute('onclick', 'handleAuto4()'); // Restore the onclick attribute
    const essenceSpan = auto4Btn.querySelector('span:first-child');
    const costSpan = document.getElementById('auto4Cost');
    if (essenceSpan && costSpan) {
        essenceSpan.style.display = 'inline';
        costSpan.style.display = 'inline';
    }
    auto4Btn.innerHTML = '<b>CHRONO MATRIX</b><hr style="width: 150px; margin: 5px auto; border: none; border-top: 2px solid black;"><span style="color: #c28dfc;">Essence</span>: <span id="auto4Cost">0</span><br>Adds <b>300%</b> of your DMG to DPS';
    updateAuto4Cost();

    document.getElementById('damagePerSecond').style.display = 'none';
    document.getElementById('shieldPerSecond').style.display = 'none';

    const progressBar = document.getElementById('progress');
    progressBar.style.width = '0%'; // Reset progress bar width
    progressBar.style.backgroundColor = 'red'; // Reset progress bar color

    const fireBtn = document.getElementById('fireBtn');
    fireBtn.innerText = 'Overload';

    const shieldContainer = document.getElementById('shield');
    shieldContainer.style.visibility = 'hidden';

    deactivateShield();

    clearInterval(regenerationInterval);
    clearInterval(timerInterval);

    startBossRegeneration();

    ascendClickCount++;
    updateAscendButtonVisibility();
    toggleVisibility();
}

// Function to show an overlay and plays a sound effect when the "Ascend" button is clicked
function showAscendOverlay() {
    const overlayImage = document.getElementById('ascendOverlayImage');
    overlayImage.style.display = 'block'; // Show the image
    overlayImage.style.opacity = '0'; // Start with zero opacity

    // Play the ascend sound effect
    //if (isAudioOn) {
    ascendSound.play();
    //}
    // Fade in the image
    let opacity = 0;
    const fadeInInterval = setInterval(() => {
        opacity += 0.02;
        overlayImage.style.opacity = opacity;
        if (opacity >= 1) {
            clearInterval(fadeInInterval);
            // Fade out the image after 3 seconds
            setTimeout(() => {
                let fadeOutInterval = setInterval(() => {
                    opacity -= 0.06;
                    overlayImage.style.opacity = opacity;
                    if (opacity <= 0) {
                        clearInterval(fadeOutInterval);
                        overlayImage.style.display = 'none'; // Hide the image
                    }
                }, 50);
            }, 100);
        }
    }, 50);
}

// Function to handle the game over scenario
function handleGameOver() {
    const overlay = document.getElementById('gameOverOverlay');
    overlay.style.visibility = 'visible'; // Show the overlay
    overlay.style.opacity = '1'; // Show the overlay with a fade-in effect
    overlay.style.pointerEvents = 'auto'; // Enable pointer events for the overlay

    // Stop the background music
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Reset the background music to start from the beginning

    // Play the game over sound on loop
    gameOverSound.play();
}
// Function to format numbers with appropriate suffixes for readability
function formatNumber(num, isBossHP = false, isClickDamage = false, isDamagePerSecond = false, isShieldValue = false, isShieldPerSecond = false) {
    if (isBossHP || isClickDamage || isDamagePerSecond || isShieldValue || isShieldPerSecond) {
        return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(2) + 'b';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'm';
        } else {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    }
}

// Function to update the bossHP in the HTML
function updateBossHP() {
    document.getElementById('bossHP').innerText = formatNumber(currentBossHP, true);
    updateAmalgamEssence();
    // Check if currentBossHP is 0 or less
    if (currentBossHP <= 0) {
        handleGameOver();
    }
    updateAscendButtonVisibility(); // Call the function to update the Ascend button visibility
}

// Function to update the Click Damage in the HTML
function updateClickDamage() {
    document.getElementById('clickDamage').innerText = formatNumber(clickValue, false, true);
}

// Function to update the total clicks display
function updateTotalClicksDisplay() {
    const totalClicksDisplay = document.getElementById('totalClicksDisplay');
    totalClicksDisplay.innerText = attackClicks;
}

// Function to update the Boost cost in the HTML
function updateBoostCost() {
    document.getElementById('boostCost').innerText = formatNumber(boostCost);
}

// Function to update the Boost2 cost in the HTML
function updateBoost2Cost() {
    document.getElementById('boost2Cost').innerText = formatNumber(boost2Cost);
}

// Function to update the Boost3 cost in the HTML
function updateBoost3Cost() {
    document.getElementById('boost3Cost').innerText = formatNumber(boost3Cost);
}

// Function to update the Auto1 cost in the HTML
function updateAuto1Cost() {
    document.getElementById('auto1Cost').innerText = formatNumber(auto1Cost);
}

// Function to update the Auto2 cost in the HTML
function updateAuto2Cost() {
    document.getElementById('auto2Cost').innerText = formatNumber(auto2Cost);
}

// Function to update the Auto3 cost in the HTML
function updateAuto3Cost() {
    document.getElementById('auto3Cost').innerText = formatNumber(auto3Cost);
}
// Function to update the Auto4 cost in the HTML
function updateAuto4Cost() {
    const auto4CostElement = document.getElementById('auto4Cost');
    if (auto4CostElement) {
        auto4CostElement.textContent = formatNumber(auto4Cost);
    }
}

// Function to update the Boost upgrades in the HTML
function updateBoostUpgrades() {
    const boostUpgradesElement = document.getElementById('boostUpgrades');
boostUpgradesElement.innerText = boostUpgrades || '0';
}

// Function to update the Boost2 upgrades in the HTML
function updateBoost2Upgrades() {
    const boost2UpgradesElement = document.getElementById('boost2Upgrades');
boost2UpgradesElement.innerText = boost2Upgrades || '0';
}

// Function to update the Boost3 upgrades in the HTML
function updateBoost3Upgrades() {
    const boost3UpgradesElement = document.getElementById('boost3Upgrades');
    boost3UpgradesElement.innerText = boost3Upgrades || '0';
}

// Function to update the Auto1 upgrades in the HTML
function updateAuto1Upgrades() {
    const auto1UpgradesElement = document.getElementById('auto1Upgrades');
    auto1UpgradesElement.innerText = auto1Upgrades || '0';

    document.getElementById('auto1ReductionsPerSecond').innerText = formatNumber(auto1ReductionsPerSecond, false, false, true);

    // Check if Auto1 upgrades are 1 or more, then make "Damage Per Second" visible
    const damagePerSecondParagraph = document.getElementById('damagePerSecond');
    damagePerSecondParagraph.style.display = (typeof auto1Upgrades === 'number' && auto1Upgrades >= 1) ? 'block' : 'none';
}

// Function to update the Auto2 upgrades in the HTML
function updateAuto2Upgrades() {
    const auto2UpgradesElement = document.getElementById('auto2Upgrades');
    auto2UpgradesElement.innerText = auto2Upgrades || '0';
}

// Function to update the Auto3 upgrades in the HTML
function updateAuto3Upgrades() {
    const auto3UpgradesElement = document.getElementById('auto3Upgrades');
    auto3UpgradesElement.innerText = auto3Upgrades || '0';

    document.getElementById('auto3ReductionsPerSecond').innerText = formatNumber(auto3ReductionsPerSecond, false, false, false, false, true); // Use formatNumber to remove decimals for Shield Per Second

    // Check if Auto3 upgrades are 1 or more, then make "Shield Per Second" visible
    const shieldPerSecondParagraph = document.getElementById('shieldPerSecond');
    shieldPerSecondParagraph.style.display = (typeof auto3Upgrades === 'number' && auto3Upgrades >= 1) ? 'block' : 'none';
}

// Function to update the display of the total number of upgrades purchased
function updateTotalUpgradesDisplay() {
    const totalUpgradesDisplay = document.getElementById('totalUpgradesDisplay');
    totalUpgradesDisplay.innerText = totalUpgrades;
}

// Function to update the Fire button text when shield status changes
function updateFireButtonText() {
    const fireButton = document.getElementById('fireBtn');
    if (isShieldActive) {
        fireButton.innerText = "Jammed";
    } else {
        fireButton.innerText = "Overload";
    }
}

// Function to update the status of the first shield when shield status changes
function updateShieldStatus() {
    let firstShieldThreshold = startingBossHP * 0.99; // 99% of startingBossHP for the first shield initially

    if (ascendClickCount >= 2) {
        firstShieldThreshold = startingBossHP * 0.75; // 75% of startingBossHP for the first shield after the second ascension
    }

    if (!isShieldActive && !shieldDestroyed && currentBossHP <= firstShieldThreshold) {
        activateShield(); // Activate the shield if it's not already active, not destroyed, and boss HP is below the first shield threshold
    } else if (isShieldActive && shieldValue <= 0) {
        deactivateShield(); // Deactivate the shield if it's active and shield value is zero
        shieldDestroyed = true; // Set shieldDestroyed to true only when the shield is actually destroyed
    }
}

// Function to update the status of the second shield when shield status changes
function updateShieldStatus2() {
    let secondShieldThreshold = startingBossHP * 0.90; // 90% of startingBossHP for the second shield initially

    if (ascendClickCount >= 2) {
        secondShieldThreshold = startingBossHP * 0.50; // 50% of startingBossHP for the second shield after the second ascension
    }

    if (!isShieldActive && currentBossHP <= secondShieldThreshold) {
        if (!shieldActivated2) {
            activateShield(); // Activate the shield if it's not already active, not destroyed, and boss HP is below the second shield threshold
            shieldActivated2 = true; // Set the flag to true to prevent repeated activation
            shieldDestroyed = false; // Reset the shieldDestroyed flag
        }
    } else if (isShieldActive && shieldValue <= 0) {
        deactivateShield(); // Deactivate the shield if it's active and shield value is zero
        shieldDestroyed = true; // Set shieldDestroyed to true only when the shield is actually destroyed
    }
}

// Function to update the display of the shield value in the HTML
function updateShieldDisplay() {
    if (isShieldActive) {
        const shieldDisplay = document.getElementById('shieldValue');
        shieldDisplay.innerText = formatNumber(shieldValue, false, false, false, true); // Update shield value in HTML

        const shieldContainer = document.getElementById('shield');
        shieldContainer.style.visibility = 'visible'; // Make the shield container visible
    }
}

// Function to update the display of the "Amalgam Essence" value in the HTML
function updateAmalgamEssence() {
    const amalgamEssenceElement = document.getElementById('amalgamEssence');
    const difference = startingBossHP - currentBossHP;
    amalgamEssenceElement.innerText = formatNumber(difference, true);
}

// Function to update the display of the total number of achievements
function updateTotalAchievementsDisplay() {
    const totalAchievementsDisplay = document.getElementById('totalAchievementsDisplay');
    totalAchievementsDisplay.innerText = totalAchievements;
}

// Function to show/hdie the Ascend button in HTML
function updateAscendButtonVisibility() {
    const ascendBtn = document.getElementById('ascendBtn');
    let threshold;

    if (ascendClickCount >= 2) {
        ascendBtn.style.display = 'none'; // Hide the Ascend button after the second ascension
    } else if (ascendClickCount === 0) {
        threshold = startingBossHP * 0.99; // 99% of startingBossHP for the first ascension
        if (currentBossHP <= threshold) {
            ascendBtn.style.display = 'block'; // Show the Ascend button
        } else {
            ascendBtn.style.display = 'none'; // Hide the Ascend button
        }
    } else {
        threshold = startingBossHP * 0.75; // 75% of startingBossHP for the second ascension
        if (currentBossHP <= threshold) {
            ascendBtn.style.display = 'block'; // Show the Ascend button
        }
    }
}

// Function to calculate boost cost
function calculateBoostCost() {
    const difference = startingBossHP - currentBossHP;
    const upgradesCount = boostUpgrades === undefined ? 0 : boostUpgrades;
    return Math.ceil(startingBossHP * 0.00000001 + upgradesCount * (currentBossHP * 0.0000001 + difference * 0.04));
}

// Function to calculate Boost2 cost
function calculateBoost2Cost() {
    const difference = startingBossHP - currentBossHP;
    const upgrades2Count = boost2Upgrades === undefined ? 0 : boost2Upgrades;
    return Math.ceil(startingBossHP * 0.0001 + upgrades2Count * (currentBossHP * 0.000003 + difference * 1.5));
}

// Function to calculate Boost2 cost
function calculateBoost3Cost() {
    const difference = startingBossHP - currentBossHP;
    const upgrades6Count = typeof boost3Upgrades === 'undefined' ? 0 : boost3Upgrades;
    return Math.ceil(startingBossHP * 0.000002 + upgrades6Count * (currentBossHP * 0.0000005 + difference * 0.15)); // Adjust the formula for Boost3 as needed
}

// Function to calculate Auto1 cost
function calculateAuto1Cost() {
    const difference = startingBossHP - currentBossHP;
    const upgrades3Count = typeof auto1Upgrades === 'undefined' ? 0 : auto1Upgrades;
    return Math.ceil(startingBossHP * 0.00002 + upgrades3Count * (currentBossHP * 0.0000005 + difference * 0.035)); // Adjust the formula for Auto1 as needed
}

// Function to calculate Auto2 cost
function calculateAuto2Cost() {
    const difference = startingBossHP - currentBossHP;
    const upgrades4Count = typeof auto2Upgrades === 'undefined' ? 0 : auto2Upgrades;
    return Math.ceil(startingBossHP * 0.00025 + upgrades4Count * (currentBossHP * 0.000003 + difference * 0.45)); // Adjust the formula for Auto2 as needed
}

// Function to calculate Auto3 cost
function calculateAuto3Cost() {
    const difference = startingBossHP - currentBossHP;
    const upgrades5Count = typeof auto3Upgrades === 'undefined' ? 0 : auto3Upgrades;
    return Math.ceil(startingBossHP * 0.0001 + upgrades5Count * (currentBossHP * 0.00000015 + difference * 0.12)); // Adjust the formula for Auto3 as needed
}

// Function to calculate Auto4 cost
function calculateAuto4Cost() {
    return Math.ceil(1500000); // Same formula as Magnetic Field button
}

// Function to calculate Magnetic Field cost
function calculateMagneticFieldCost() {
    return Math.ceil(5+5); // Same formula as Boost button
}

// Initial update of boost cost, Boost upgrades, and bossHP on page load
updateBossHP();
updateBoostCost();
updateBoost2Cost();
updateBoost3Cost();
boostUpgrades = undefined;
boost2Upgrades = undefined;
boost3Upgrades = undefined;
updateBoostUpgrades();
updateBoost2Upgrades();
updateClickDamage();
updateTotalClicksDisplay();
updateAuto1Cost();
updateAuto2Cost();
updateAuto3Cost();
updateAuto4Cost();
updateAscendButtonVisibility();
updateAmalgamEssence();
toggleVisibility();
auto1ReductionInterval();
auto3ReductionInterval();
startBossRegeneration();
toggleMagneticFieldButtonVisibility();
startPulsating();

// Additional event listeners
document.getElementById('attackBtn').addEventListener('click', function() {
    // Check if the shield is active
    if (isShieldActive) {
        handleAttackWithShield(); // Call handleAttackWithShield() if shield is active
    } else {
        handleAttack(); // Otherwise, call handleAttack()
    }
});
document.getElementById('fireBtn').addEventListener('click', handleFire);