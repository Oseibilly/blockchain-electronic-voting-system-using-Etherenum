// This script now handles the "Connect Wallet" button functionality
// for a decentralized application (dApp) login.

window.addEventListener('load', function () {
    const connectButton = document.getElementById('connectWalletBtn');
    const statusMessage = document.getElementById('status-message');

    if (connectButton) {
        connectButton.addEventListener('click', async () => {
            // Check if MetaMask is installed
            if (typeof window.ethereum !== 'undefined') {
                try {
                    statusMessage.textContent = "Connecting to MetaMask...";
                    
                    // Request account access from MetaMask
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const userAccount = accounts[0];

                    console.log("Wallet connected:", userAccount);
                    
                    // IMPORTANT: Replace this with the actual admin account from your 'truffle develop' output
                    // This is usually the first account in the list.
                    const adminAccount = "0xe3433e18dbd12afdf1695ced98986909be7aee01"; // Example Admin Address

                    // Check if the connected account is the admin
                    if (userAccount.toLowerCase() === adminAccount.toLowerCase()) {
                        statusMessage.textContent = "Admin login successful! Redirecting...";
                        // Redirect to the admin page
                        window.location.replace('./admin.html');
                    } else {
                        statusMessage.textContent = "Voter login successful! Redirecting...";
                        // Redirect to the main voting page
                        window.location.replace('./index.html');
                    }

                } catch (error) {
                    console.error("User rejected the connection request:", error);
                    statusMessage.textContent = "Connection failed. Please approve the request in MetaMask.";
                }
            } else {
                // If MetaMask is not installed, alert the user
                alert('MetaMask is not installed. Please install it to use this dApp.');
                statusMessage.textContent = "Please install MetaMask to continue.";
            }
        });
    }
});