// First, define the contract ABI directly at the top
const votingArtifacts = {
  "contractName": "Voting",
  "abi": [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "candidateId",
          "type": "uint256"
        }
      ],
      "name": "Voted",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "party",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "countCandidates",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "votingEnd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "votingStart",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_party",
          "type": "string"
        }
      ],
      "name": "addCandidate",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateID",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_startDate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_endDate",
          "type": "uint256"
        }
      ],
      "name": "setDates",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "checkVote",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getCountCandidates",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateID",
          "type": "uint256"
        }
      ],
      "name": "getCandidate",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getDates",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]
};

// Contract address - UPDATE THIS WITH YOUR DEPLOYED CONTRACT ADDRESS
const CONTRACT_ADDRESS = "0x837b54b84a597888be2f578f963921971bf947e1"; // Remove the space at the beginning

// Initialize the contract
let VotingContract;
if (typeof window.TruffleContract !== 'undefined') {
    VotingContract = window.TruffleContract(votingArtifacts);
} else {
    console.error("TruffleContract not loaded!");
}

window.App = {
    web3Provider: null,
    contracts: {},
    account: null,
    instance: null,

    // Connect Wallet function
    connectWallet: async function() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request account access
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                if (accounts.length > 0) {
                    App.account = accounts[0];
                    
                    // Set up Web3
                    App.web3Provider = window.ethereum;
                    window.web3 = new Web3(window.ethereum);
                    
                    // Set the provider for the contract
                    VotingContract.setProvider(App.web3Provider);
                    
                    // Get the deployed instance
                    App.instance = await VotingContract.at(CONTRACT_ADDRESS);
                    
                    // Update UI
                    App.updateConnectionStatus(true);
                    
                    // Load blockchain data
                    await App.loadBlockchainData();
                    
                    // Setup event listeners
                    App.setupEventListeners();
                    
                    // Listen for account changes
                    window.ethereum.on('accountsChanged', function (accounts) {
                        if (accounts.length === 0) {
                            App.disconnect();
                        } else {
                            App.account = accounts[0];
                            App.updateConnectionStatus(true);
                            App.loadBlockchainData();
                        }
                    });
                    
                    console.log("Connected successfully to account:", App.account);
                }
            } catch (error) {
                console.error("Error connecting to MetaMask:", error);
                alert("Failed to connect to MetaMask. Please make sure MetaMask is installed and unlocked.");
            }
        } else {
            alert("Please install MetaMask to use this dApp!");
        }
    },

    // Disconnect function
    disconnect: function() {
        App.account = null;
        App.instance = null;
        App.updateConnectionStatus(false);
        
        // Disable buttons
        const addCandidateBtn = document.getElementById('addCandidate');
        const addDateBtn = document.getElementById('addDate');
        const voteButton = document.getElementById('voteButton');
        
        if (addCandidateBtn) addCandidateBtn.disabled = true;
        if (addDateBtn) addDateBtn.disabled = true;
        if (voteButton) voteButton.disabled = true;
        
        console.log("Disconnected from wallet");
    },

    // Update connection status in UI
    updateConnectionStatus: function(connected) {
        const connectBtn = document.getElementById('connectButton');
        const disconnectBtn = document.getElementById('disconnectButton');
        const accountAddressEl = document.getElementById('accountAddress');
        
        if (connected && App.account) {
            connectBtn.classList.add('hidden');
            disconnectBtn.classList.remove('hidden');
            accountAddressEl.textContent = `Connected: ${App.account.substring(0, 6)}...${App.account.substring(38)}`;
            
            // Enable buttons
            const addCandidateBtn = document.getElementById('addCandidate');
            const addDateBtn = document.getElementById('addDate');
            
            if (addCandidateBtn) addCandidateBtn.disabled = false;
            if (addDateBtn) addDateBtn.disabled = false;
        } else {
            connectBtn.classList.remove('hidden');
            disconnectBtn.classList.add('hidden');
            accountAddressEl.textContent = 'Status: Not Connected';
        }
    },

    // Setup event listeners
    setupEventListeners: function() {
        const addCandidateBtn = document.getElementById('addCandidate');
        const addDateBtn = document.getElementById('addDate');
        
        // Admin page listeners
        if (addCandidateBtn) {
            addCandidateBtn.addEventListener('click', async () => {
                const name = document.getElementById('name').value.trim();
                const party = document.getElementById('party').value.trim();
                
                if (!name || !party) {
                    alert("Please fill in all fields");
                    return;
                }
                
                try {
                    addCandidateBtn.disabled = true;
                    addCandidateBtn.textContent = "Adding...";
                    
                    const tx = await App.instance.addCandidate(name, party, {
                        from: App.account,
                        gas: 300000
                    });
                    
                    console.log("Candidate added successfully:", tx);
                    alert("Candidate added successfully!");
                    
                    // Clear form
                    document.getElementById('name').value = '';
                    document.getElementById('party').value = '';
                    
                    // Reload data
                    await App.loadBlockchainData();
                    
                } catch (error) {
                    console.error("Error adding candidate:", error);
                    alert("Failed to add candidate: " + error.message);
                } finally {
                    addCandidateBtn.disabled = false;
                    addCandidateBtn.textContent = "Add Candidate";
                }
            });
        }

        if (addDateBtn) {
            addDateBtn.addEventListener('click', async () => {
                const startDateValue = document.getElementById("startDate").value;
                const endDateValue = document.getElementById("endDate").value;
                
                if (!startDateValue || !endDateValue) {
                    alert("Please select both start and end dates");
                    return;
                }
                
                try {
                    addDateBtn.disabled = true;
                    addDateBtn.textContent = "Setting Dates...";
                    
                    const startDate = Math.floor(new Date(startDateValue).getTime() / 1000);
                    const endDate = Math.floor(new Date(endDateValue).getTime() / 1000);
                    
                    const tx = await App.instance.setDates(startDate, endDate, {
                        from: App.account,
                        gas: 300000
                    });
                    
                    console.log("Dates set successfully:", tx);
                    alert("Voting dates set successfully!");
                    
                    // Reload data
                    await App.loadBlockchainData();
                    
                } catch (error) {
                    console.error("Error setting dates:", error);
                    alert("Failed to set dates: " + error.message);
                } finally {
                    addDateBtn.disabled = false;
                    addDateBtn.textContent = "Define Dates";
                }
            });
        }
    },

    // Load blockchain data
    loadBlockchainData: async function() {
        if (!App.instance) return;
        
        try {
            // Get total candidates
            const countCandidates = await App.instance.getCountCandidates();
            const count = countCandidates.toNumber();
            
            // Load candidates for voting page
            const boxCandidateEl = document.getElementById("boxCandidate");
            if (boxCandidateEl) {
                boxCandidateEl.innerHTML = "";
                
                for (let i = 1; i <= count; i++) {
                    const candidate = await App.instance.getCandidate(i);
                    const id = candidate[0].toNumber();
                    const name = candidate[1];
                    const party = candidate[2];
                    const voteCount = candidate[3].toNumber();
                    
                    const candidateHTML = `
                        <tr class="border-b border-gray-600 hover:bg-gray-600">
                            <td class="py-3 px-6 text-left whitespace-nowrap">
                                <label for="${id}" class="flex items-center cursor-pointer">
                                    <input class="form-check-input h-4 w-4 mr-3" type="radio" name="candidate" value="${id}" id="${id}">
                                    <span class="font-medium">${name}</span>
                                </label>
                            </td>
                            <td class="py-3 px-6 text-left">${party}</td>
                            <td class="py-3 px-6 text-center">${voteCount}</td>
                        </tr>`;
                    boxCandidateEl.innerHTML += candidateHTML;
                }
                
                // Check if user has voted
                const hasVoted = await App.instance.checkVote({ from: App.account });
                const voteButton = document.getElementById("voteButton");
                if (voteButton) {
                    voteButton.disabled = hasVoted;
                    if (hasVoted) {
                        voteButton.textContent = "Already Voted";
                    }
                }
            }
            
            // Load candidates for admin page
            const candidatesListEl = document.getElementById("candidatesList");
            if (candidatesListEl) {
                candidatesListEl.innerHTML = "";
                
                if (count === 0) {
                    candidatesListEl.innerHTML = '<p class="text-gray-400 text-center">No candidates added yet</p>';
                } else {
                    for (let i = 1; i <= count; i++) {
                        const candidate = await App.instance.getCandidate(i);
                        const name = candidate[1];
                        const party = candidate[2];
                        const voteCount = candidate[3].toNumber();
                        
                        const candidateCard = `
                            <div class="bg-gray-700 p-4 rounded-lg">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <h4 class="font-semibold">${name}</h4>
                                        <p class="text-sm text-gray-400">${party}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm text-gray-400">Votes</p>
                                        <p class="text-xl font-bold text-cyan-400">${voteCount}</p>
                                    </div>
                                </div>
                            </div>`;
                        candidatesListEl.innerHTML += candidateCard;
                    }
                }
            }
            
            // Get and display voting dates
            const dates = await App.instance.getDates();
            const startTimestamp = dates[0].toNumber();
            const endTimestamp = dates[1].toNumber();
            
            const datesEl = document.getElementById("dates");
            if (datesEl && startTimestamp !== 0) {
                const startDate = new Date(startTimestamp * 1000);
                const endDate = new Date(endTimestamp * 1000);
                const options = { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                };
                datesEl.textContent = `Voting Period: ${startDate.toLocaleString('en-US', options)} - ${endDate.toLocaleString('en-US', options)}`;
            } else if (datesEl) {
                datesEl.textContent = "Voting dates not set yet";
            }
            
        } catch (error) {
            console.error("Error loading blockchain data:", error);
        }
    },

    // Vote function
    vote: async function() {
        const candidateID = document.querySelector("input[name='candidate']:checked")?.value;
        const msgEl = document.getElementById("msg");
        const voteButton = document.getElementById("voteButton");

        if (!candidateID) {
            msgEl.innerHTML = "<p class='text-red-500'>Please select a candidate.</p>";
            return;
        }

        try {
            voteButton.disabled = true;
            voteButton.textContent = "Voting...";
            msgEl.innerHTML = "<p class='text-yellow-400'>Processing your vote...</p>";
            
            const tx = await App.instance.vote(parseInt(candidateID), {
                from: App.account,
                gas: 300000
            });
            
            console.log("Vote successful:", tx);
            msgEl.innerHTML = "<p class='text-green-400'>Voted successfully! Thank you for participating.</p>";
            voteButton.textContent = "Already Voted";
            
            // Reload to show updated vote counts
            setTimeout(() => {
                App.loadBlockchainData();
            }, 2000);
            
        } catch (error) {
            console.error("Error during voting:", error);
            msgEl.innerHTML = `<p class='text-red-500'>Error: ${error.message}</p>`;
            voteButton.disabled = false;
            voteButton.textContent = "Vote";
        }
    }
};

// Initialize the application when the window loads
window.addEventListener("load", function() {
    // Check if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.ethereum !== "undefined") {
        console.log("MetaMask is installed!");
        
        // Check if user is already connected
        window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
            if (accounts.length > 0) {
                // Auto-connect if already authorized
                App.connectWallet();
            }
        });
    } else {
        console.warn("No web3 detected. Please install MetaMask!");
        alert("Please install MetaMask to use this dApp!");
    }
});