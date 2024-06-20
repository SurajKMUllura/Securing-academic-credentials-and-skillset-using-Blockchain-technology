const contractABI =[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "ipfsHash",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "transactionHash",
				"type": "bytes32"
			}
		],
		"name": "HashStored",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "ipfsHash",
				"type": "bytes32"
			}
		],
		"name": "storeHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "ipfsHashes",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Add the address of your deployed contract
const contractAddress = ''; // Replace this with your contract address
const contractAddress1 = ''; // Replace this with your contract address

listFolders();
let web3;
if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
        // Request account access if needed
        window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Web3 initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Web3:', error);
    }
} else {
    console.error('No Web3 provider detected');
}

// Initialize contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);
const contract1 = new web3.eth.Contract(contractABI, contractAddress1);

// Initialize Web3
window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            //await window.ethereum.enable();
            updateInterface();
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        } catch (error) {
            //console.error(error);
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});

function handleAccountsChanged(accounts) {
    // Reload the page when the Metamask account changes
    location.reload();
    console.log("reload");
}

if (localStorage.getItem('introVisited')) {
    // If so, directly show the file upload interface
    document.getElementById('introPage').style.display = 'none'; // Hide the intro page
    document.getElementById('fileUploadInterface').style.display = 'block'; // Show the file upload interface
}
function showFileUploadInterface() {
    document.getElementById('introPage').style.display = 'none'; // Hide the intro page
    document.getElementById('fileUploadInterface').style.display = 'block'; // Show the file upload interface
    localStorage.setItem('introVisited', true);
}

// Function to update interface
async function updateInterface() {
    web3.eth.getAccounts(async function(error, accounts) {
        if (error) {
            console.error(error);
            return;
        }
        const userAddress = accounts[0]; // Assuming the first account is the user's account
        if (userAddress == "") {
            document.getElementById('specialAdminInterface').style.display = 'block';
            fetchAllFilesData();
        }
        else {
            const isAdmin = await checkAdmin(userAddress);
            if (isAdmin) {
                document.getElementById('adminInterface').style.display = 'block';
                loadFilesForAdmin(userAddress);
            } else {
                document.getElementById('userInterface').style.display = 'block';
                loadFilesForUser();
            }
        }
    });
}
const adminAddresses = [
];
const randomIndex = Math.floor(Math.random() * adminAddresses.length);
const selectedAdminAddress = adminAddresses[randomIndex];
localStorage.setItem(`selectedAdminAddress`, selectedAdminAddress);
console.log(selectedAdminAddress);


// Function to check if the user is an admin (Replace with your actual logic)
async function checkAdmin(userAddress) {
    console.log(userAddress,selectedAdminAddress);
    if (userAddress.toLowerCase() === selectedAdminAddress.toLowerCase()) {
        return true;
    }
    return adminAddresses.map(address => address.toLowerCase()).includes(userAddress.toLowerCase());

}
// Function to load and display uploaded files for admin (Replace with your actual logic)
async function loadFilesForAdmin(userAddress) {
    const fileListTable = document.getElementById('fileListTable');
    try {
        const filesData = await fetchFilesFromPinata(userAddress);
        // Display files using IPFS hashes and timestamps
        filesData.forEach(fileData => {
            const isVerified = localStorage.getItem(`verificationStatus_${fileData.ipfsHash}`) >= 2;
            console.log(localStorage.getItem(`verificationStatus_${fileData.ipfsHash}`));

            if (!isVerified) {
                const row = fileListTable.insertRow();
                const FDCell = row.insertCell(0);
                const uploader = row.insertCell(1);
                const linkCell = row.insertCell(2);
                const timestampCell = row.insertCell(3); // Add a new cell for the timestamp
                const verifyCell = row.insertCell(4);



                const useradd = document.createElement('label');
                if(localStorage.getItem(fileData.ipfsHash)=="") {
                    useradd.textContent = "User 1";
                } else if(localStorage.getItem(fileData.ipfsHash)=="") {
                    useradd.textContent = "User 2";
                } else if(localStorage.getItem(fileData.ipfsHash)=="") {
                    useradd.textContent = "User 3";
                } else if(localStorage.getItem(fileData.ipfsHash)=="") {
                    useradd.textContent = "User 4";
                }
                uploader.appendChild(useradd);

                const fd = document.createElement('label');
                fd.textContent = localStorage.getItem(`userFD${fileData.ipfsHash}`);
                FDCell.appendChild(fd);

                const fileLink = document.createElement('button');
                fileLink.classList.add('notify-button');
                fileLink.style.width = '24px'; // Set width of the button
                fileLink.style.height = '24px'; // Set height of the button
                fileLink.style.backgroundImage = 'url(\'./share.png\')'; // Set background image
                fileLink.style.backgroundSize = 'cover'; // Adjust background size to cover the button area
                fileLink.style.backgroundRepeat = 'no-repeat'; // Prevent background image from repeating
                fileLink.style.margin = "auto";
                fileLink.addEventListener('click', function() {
                    window.open(`https://ipfs.io/ipfs/${fileData.ipfsHash}`, '_blank');
                });
                linkCell.appendChild(fileLink);

                // Display the timestamp in a human-readable format
                const timestamp = new Date(fileData.timestamp);
                timestampCell.textContent = timestamp.toLocaleString();

                // Create a Verify button
                const verifyButton = document.createElement('button');
                verifyButton.id = fileData.ipfsHash;
                verifyButton.innerText = 'Verify';
                verifyButton.classList.add('verify-button');
                verifyButton.onclick = () => showVerificationModal(fileData.ipfsHash); // Pass IPFS hash to showVerificationModal
                verifyCell.appendChild(verifyButton);
            }});
        } catch (error) {
            console.error('Error loading files from Pinata:', error);
            alert('Failed to load files. Please try again.');
        }
}

// Function to show verification questions in a new window
function showVerificationModal(ipfsHash) {
    const modal = document.getElementById('verificationModal');
    modal.style.display = 'block';
    modal.dataset.ipfsHash = ipfsHash; // Store IPFS hash in modal dataset
}
async function getFileFromIPFS(ipfsHash) {
    return new Promise((resolve, reject) => {
        fetch(`https://ipfs.io/ipfs/${ipfsHash}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch file with IPFS hash ${ipfsHash}`);
                }
                return response.text();
            })
            .then(resolve)
            .catch(reject);
    });
}
// Function to fetch all files data from Pinata
async function fetchAllFilesData() {
    const pinataApiKey = ''; // Replace with your Pinata API key
    const pinataSecretApiKey = ''; // Replace with your Pinata secret API key

    const response = await fetch('https://api.pinata.cloud/data/pinList?status=pinned', {
        method: 'GET',
        headers: {
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataSecretApiKey,
        },
    });

    const responseData = await response.json();
    if (response.ok) {
        const filesData = [];
        

        const fileListTable = document.getElementById('specialAdminFileListTable');
        responseData.rows.forEach(row => {
            const metadata = row.metadata;
            if (metadata) {
                const userAddress = metadata.name;
                const ipfsHash = row.ipfs_pin_hash;
                const verificationStatus = localStorage.getItem(`verificationStatus_${ipfsHash}`) || 0; // Assume initial status as Not Verified
                filesData.push({ userAddress, ipfsHash, verificationStatus });
                if (adminAddresses.map(address => address.toLowerCase()).includes(userAddress.toLowerCase())) {
                    console.log(adminAddresses.map(address => address.toLowerCase()).includes(userAddress.toLowerCase()),userAddress,adminAddresses);
                    try {
                        const row = fileListTable.insertRow();
                        const linkCell = row.insertCell(0);
                        const user1Address = row.insertCell(1); // Add a new cell for the timestamp
                        const timestampCell = row.insertCell(2);
                        const verifyCell = row.insertCell(3);
                        const notifyCell = row.insertCell(4);

                        const veradd = document.createElement('label');
                        if(userAddress=="") {
                            veradd.textContent = "Verifier 1";
                        } else if(userAddress=="") {
                            veradd.textContent = "Verifier 2";
                        } else if(userAddress=="") {
                            veradd.textContent = "Verifier 3";
                        }
                        linkCell.appendChild(veradd);

                        const useradd = document.createElement('label');
                        if(localStorage.getItem(ipfsHash)=="") {
                            useradd.textContent = "User 1";
                        } else if(localStorage.getItem(ipfsHash)=="") {
                            useradd.textContent = "User 2";
                        } else if(localStorage.getItem(ipfsHash)=="") {
                            useradd.textContent = "User 3";
                        } else if(localStorage.getItem(ipfsHash)=="") {
                            useradd.textContent = "User 4";
                        }
                        console.log(localStorage.getItem(ipfsHash));
                        user1Address.appendChild(useradd);

                        const userfile = document.createElement('label');
                        userfile.textContent = localStorage.getItem(`userFD${ipfsHash}`);
                        timestampCell.appendChild(userfile);

                        const notifyButton = document.createElement('button');
                        notifyButton.classList.add('notify-button');
                        notifyButton.style.width = '24px'; // Set width of the button
                        notifyButton.style.height = '24px'; // Set height of the button
                        notifyButton.style.backgroundImage = 'url(\'./notification.png\')'; // Set background image
                        notifyButton.style.backgroundSize = 'cover'; // Adjust background size to cover the button area
                        notifyButton.style.backgroundRepeat = 'no-repeat'; // Prevent background image from repeating

                        notifyButton.onclick = () => {
                            var emailAddress = "surajkmullura@gmail.com";
                            var subject = 'New file to verify';
                            var body = 'Hey '+userAddress+', you have a new file to verify';

                            var mailtoLink = 'mailto:' + emailAddress + '?subject=' + subject + '&body=' + body;

                            window.location.href = mailtoLink;

                        };
                        const userstatus = document.createElement('button');userstatus.style.width = "100px"; // Set width
                        userstatus.style.textAlign = "center"; // Align content to center
                        userstatus.style.padding = "5px"; // Add padding for spacing
                        userstatus.style.borderRadius = "5px"; // Add border radius for rounded corners
                        userstatus.style.color = "#ffffff"; // Set text color to white
                        userstatus.style.margin = "auto";
                        if (verificationStatus==0) {
                            userstatus.textContent = "Uploaded";
                            userstatus.style.background = "lightgreen";
                        }
                        else if (verificationStatus==2) {
                            userstatus.textContent = "Verified";
                            userstatus.style.background = "darkgreen";
                            notifyButton.disabled = true;
                        }
                        else if (verificationStatus==3) {
                            userstatus.textContent = "Rejected";
                            userstatus.style.background = "red";
                            notifyButton.disabled = true;
                        }
                        verifyCell.appendChild(userstatus);

                        notifyCell.appendChild(notifyButton);



                    } catch (error) {
                        console.error('Error loading files from Pinata:', error);
                        alert('Failed to load files. Please try again.');
                    }
                }
            }
        });
        return filesData;
    } else {
        throw new Error(`Failed to fetch files from Pinata - ${JSON.stringify(responseData)}`);
    }

    
}

async function uploadFile1() {
    const uploadType = document.getElementById('uploadType').value;
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file.');
        return;
    }

    try {
        if (uploadType === 'academic') {
            await uploadFile();
        } else if (uploadType === 'skillset') {
            await uploadSkillsetCertification();
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file. Please try again.');
    }
}

async function uploadSkillsetCertification() {
    try {
        const fileDescriptionInput = document.getElementById('fileDescInput');
        const fileDescription = fileDescriptionInput.value.trim();
        const fileInput = document.getElementById('fileInput'); // Assuming you have a file input element for selecting skillset certification file
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file.');
            return;
        }

        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];
    
        const ipfsHash = await uploadFileToPinata(file, userAddress); // Assuming you have the function uploadFileToPinata for uploading files
        // Add logic to store IPFS hash directly on the blockchain without admin verification
        // Example: Call a contract function to store IPFS hash directly
        console.log(ipfsHash);
        const startTime = new Date();
        await storeSkillsetCertificationToBlockchain(ipfsHash); // Replace storeSkillsetCertificationToBlockchain with your actual function
        const endTime = new Date();
        const timeTaken = endTime - startTime;
        const csvData = `\n${ipfsHash},${timeTaken}`;
        await appendToCSV(csvData);
        alert('Skillset certification uploaded successfully to blockchain.');
        localStorage.setItem(`userFD${ipfsHash}`,fileDescription );

    } catch (error) {
        console.error('Error uploading skillset certification:', error);
        alert('Failed to upload skillset certification. Please try again.');
    }
}

async function storeSkillsetCertificationToBlockchain(ipfsHash) {
    try {
        const hashedDigest = hashIPFS(ipfsHash); // Assuming hashIPFS function is defined
        const bytes32Value = stringToBytes32(hashedDigest); // Assuming stringToBytes32 function is defined
        console.log('Hashed Digest:', hashedDigest);
        console.log('Bytes32 Value:', bytes32Value);
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const from = accounts[0];
        const transaction = await contract1.methods.storeHash(bytes32Value).send({ from });
        // Retrieve the transaction hash
        const transactionHash = transaction.transactionHash;
        console.log('Transaction Hash:', transactionHash);
        i += 1;
        localStorage.setItem(`ipfsHash${i}`, ipfsHash);
        localStorage.setItem(`transactionHash${i}`, transactionHash);
        saveIValueToLocalStorage(i);
        console.log(i);
        location.reload();
    } catch (error) {
        console.error('Error storing skillset certification to blockchain:', error);
        throw error; // Rethrow the error for higher-level handling
    }
}

// Function to upload file
async function uploadFile() {
    const emailInput = document.getElementById('emailInput');
    const emailAddress = emailInput.value.trim();
    const fileDescriptionInput = document.getElementById('fileDescInput');
    const fileDescription = fileDescriptionInput.value.trim();

    if (emailAddress.length!=0 && fileDescription.length!=0){
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file.');
        return;
    }

    try {
        const ipfsHash = await uploadFileToPinata(file, selectedAdminAddress);
        // Add logic to store IPFS hash on blockchain here if needed
        alert('File uploaded successfully.');
        localStorage.setItem(`userEmail${ipfsHash}`,emailAddress );
        localStorage.setItem(`userFD${ipfsHash}`,fileDescription );
        console.log(localStorage.getItem(`userEmail${ipfsHash}`));
        // Refresh the page to reflect changes
        location.reload();
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file. Please try again.');
    }
} else {
    alert("Enter valid email and file description!");
}
}
async function fetchFilesFromPinata(userAddress) {
    const pinataApiKey = ""; // Replace with your Pinata API key
    const pinataSecretApiKey = ""; // Replace with your Pinata secret API key

    const response = await fetch('https://api.pinata.cloud/data/pinList?status=pinned', {
        method: 'GET',
        headers: {
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataSecretApiKey,
        }
    });

    const responseData = await response.json();
    if (response.ok) {
        // Extract files whose names match the current user's address
        const userFiles = responseData.rows.filter(row => {
            const metadata = row.metadata;
            return metadata && metadata.name === userAddress;
        });

        const ipfsHashesWithTimestamp = userFiles.map(file => ({
            ipfsHash: file.ipfs_pin_hash,
            timestamp: file.date_pinned // Assuming the timestamp is available in the 'date_pinned' property
        }));
        return ipfsHashesWithTimestamp;
    } else {
        throw new Error(`Failed to fetch files from Pinata - ${JSON.stringify(responseData)}`);
    }
}

async function listFolders() {
    const pinataApiKey = ''; // Replace with your Pinata API key
    const pinataSecretApiKey = ''; // Replace with your Pinata secret API key

    const response = await fetch('https://api.pinata.cloud/data/pinList?status=pinned', {
        method: 'GET',
        headers: {
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataSecretApiKey,
        },
    });

    const responseData = await response.json();
    if (response.ok) {
        const names = responseData.rows.map(row => row.metadata && row.metadata.name).filter(name => name);
        console.log('List of folders:');
        names.forEach(name => console.log(name));
    } else {
        console.error(`Failed to list folders - ${JSON.stringify(responseData)}`);
    }
}


// Function to upload file to Pinata
async function uploadFileToPinata(file, selectedAdminAddress1) {
    const pinataApiKey = ''; // Replace with your Pinata API key
    const pinataSecretApiKey = ''; // Replace with your Pinata secret API key

    const formData = new FormData();
    const filePath = `/${selectedAdminAddress1}/${file.name}`; // Specify the folder path directly
    formData.append('file', file, filePath);

    // Upload file to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataSecretApiKey,
        },
        body: formData
    });

    // Retrieve user address
    let userAddress1;
    try {
        const accounts = await web3.eth.getAccounts();
        userAddress1 = accounts[0];
    } catch (error) {
        console.error('Error retrieving user address:', error);
        throw new Error('Failed to retrieve user address from Web3.');
    }

    // Handle Pinata response
    const responseData = await response.json();
    if (response.ok) {
        localStorage.setItem(`${responseData.IpfsHash}`, userAddress1);
        console.log(responseData.IpfsHash,localStorage.getItem(`${responseData.IpfsHash}`));
        return responseData.IpfsHash;
    } else {
        throw new Error(`Upload failed with status ${response.status} - ${JSON.stringify(responseData)}`);
    }
}


// JavaScript file (script.js)
// Function to show verification questions in a new window
function showVerificationModal(ipfsHash) {
    const modal = document.getElementById('verificationModal');
    modal.style.display = 'block';
    modal.dataset.ipfsHash = ipfsHash; // Store IPFS hash in modal dataset
}

// Function to hash a string using SHA-256
function sha256(input) {
    return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
}



function hashIPFS(ipfsHash) {
    // Assuming you have a suitable hashing library available (e.g., crypto-js)
    const hashedDigest = sha256(ipfsHash); // Use appropriate hashing function
    return hashedDigest;
}

// Function to convert hashed digest to bytes32 format
function stringToBytes32(hashedDigest) {
    // Convert hashed digest to bytes32 format
    return '0x' + hashedDigest.substring(0, 64); // Trim to 32 bytes (64 characters)
}

// Function to close the verification modal
function closeVerificationModal() {
    const modal = document.getElementById('verificationModal');
    modal.style.display = 'none';
}

// Function to delete file from Pinata
function deleteFileFromPinata(ipfsHash) {
    const pinataApiKey = ''; // Replace with your Pinata API key
    const pinataSecretApiKey = ''; // Replace with your Pinata secret API key

    const response = fetch(`https://api.pinata.cloud/pinning/unpin/${ipfsHash}`, {
        method: 'DELETE',
        headers: {
            'pinata_api_key': "",
            'pinata_secret_api_key': "",
        }
    });

    const responseData = response.json();
    if (response.ok) {
        console.log(`File with IPFS hash ${ipfsHash} deleted successfully from Pinata.`);
    }
}
// Function to save the value of 'i' to localStorage
function saveIValueToLocalStorage(value) {
    localStorage.setItem('iValue', value);
}

// Function to retrieve the value of 'i' from localStorage
function getIValueFromLocalStorage() {
    const value = localStorage.getItem('iValue');
    return value ? parseInt(value) : 0; // Return 0 if 'iValue' is not found or NaN
}

// Call the function to retrieve 'i' value from localStorage
let i = getIValueFromLocalStorage();

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function saveVerificationStatus(ipfsHash, status) {
    localStorage.setItem(`verificationStatus_${ipfsHash}`, status);
}

// Function to handle verification submission
async function handleVerificationSubmission() {

    // Retrieve answers from the form
    const answer1 = document.querySelector('input[name="answer1"]:checked').value;
    const answer2 = document.querySelector('input[name="answer2"]:checked').value;
    const answer3 = document.querySelector('input[name="answer3"]:checked').value;

    // Perform verification logic here based on the answers
    console.log('Answer 1:', answer1);
    console.log('Answer 2:', answer2);
    console.log('Answer 3:', answer3);

    try {
        // Retrieve IPFS hash
        const ipfsHash = document.getElementById('verificationModal').dataset.ipfsHash;
        
        // Close the verification modal
        closeVerificationModal();
            
        // Call the storeHash function of the contract
        const verifyButton = document.getElementById(ipfsHash);

        if (answer1 === 'Yes' && answer2 === 'Yes' && answer3 === 'Yes') {
            
            verifyButton.innerText = 'Pending';
            verifyButton.style.backgroundColor = 'orange'; // Optionally change button color
            const startTime = new Date();
            const hashedDigest = hashIPFS(ipfsHash);
            const bytes32Value = stringToBytes32(hashedDigest);
            console.log('Hashed Digest:', hashedDigest);
            console.log('Bytes32 Value:', bytes32Value);
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            const from = accounts[0];
            const transaction = await contract.methods.storeHash(bytes32Value).send({ from });
            // Retrieve the transaction hash
            const transactionHash = transaction.transactionHash;
            console.log('Transaction Hash:', transactionHash);
            i+=1;
            localStorage.setItem(`ipfsHash${i}`, ipfsHash);
            localStorage.setItem(`transactionHash${i}`, transactionHash);
            console.log('Hashes saved to localStorage successfully!',i,localStorage.getItem(`ipfsHash${i}`),localStorage.getItem(`transactionHash${i}`));
            saveIValueToLocalStorage(i);
            //deleteFileFromPinata(ipfsHash);
            // If all answers are "Yes", update user interface to indicate file is verified
            verifyButton.innerText = 'Verified';
            verifyButton.style.backgroundColor = 'green'; // Optionally change button color
            const endTime = new Date();
            const timeTaken = endTime - startTime;
            const csvData = `\n${ipfsHash},${transactionHash},${timeTaken}`;
            await appendToCSV(csvData);
            saveVerificationStatus(ipfsHash, 2);
            var emailAddress = localStorage.getItem(`userEmail${ipfsHash}`);
            var subject = 'Verification Status';
            var body = 'Your File has been verified\r\n\r\n  ';
            body += 'IPFS Hash: ' + `https://ipfs.io/ipfs/${ipfsHash}` + '\r\n  ';
            body += 'Transaction Hash: ' + `https://sepolia.etherscan.io/tx/${transactionHash}` + '\r\n';

            var mailtoLink = 'mailto:' + emailAddress + '?subject=' + subject + '&body=' + body;

            window.location.href = mailtoLink;
        } else {
            // If any answer is "No", update button to indicate file is rejected
            verifyButton.innerText = 'Rejected';
            verifyButton.style.backgroundColor = 'red'; // Optionally change button color
            var emailAddress = localStorage.getItem(`userEmail${ipfsHash}`);
            var subject = 'Verification Status';
            var body = 'Your File has been rejected\r\n\r\n';
            saveVerificationStatus(ipfsHash, 3);

            var mailtoLink = 'mailto:' + emailAddress + '?subject=' + subject + '&body=' + body;

            window.location.href = mailtoLink;
        }
        verifyButton.disabled = true;
    } catch (error) {
        console.error('Error storing hash on blockchain:', error);
        alert('Failed to store hash on blockchain. Please try again.');
        saveVerificationStatus(ipfsHash, 0);
    }
}
async function loadFilesForUser() {
    const transactionlisttable = document.getElementById('transactionlisttable');
    try {
        let userAddress1;
        try {
            const accounts = await web3.eth.getAccounts();
            userAddress1 = accounts[0];
        } catch (error) {
            console.error('Error retrieving user address:', error);
            throw new Error('Failed to retrieve user address from Web3.');
        }
        for (let j = 1; j <= i; j++) {
            const lsipfs = localStorage.getItem(`ipfsHash${j}`);
            const lstran = localStorage.getItem(`transactionHash${j}`);

            // Check if the current IPFS hash belongs to the current user
            const userAddress = localStorage.getItem(lsipfs);
            console.log(lsipfs,userAddress,userAddress1);
            console.log("this",userAddress1,localStorage.getItem("QmURNEjPS5jyFwLwMDDtPMh7wtr9kQ6Yh17krkD4tWeRTK"));
            if (userAddress === userAddress1) {
                const row = transactionlisttable.insertRow();
                const fd = row.insertCell(0);
                const ipfsCell = row.insertCell(1);
                const tranCell = row.insertCell(2);
                
                // Create links for IPFS hash and transaction
                const fds = document.createElement('label');
                fds.textContent = localStorage.getItem(`userFD${lsipfs}`);
                fd.appendChild(fds);
                
                // Create links for IPFS hash and transaction
                const ipfsText = document.createElement('a');
                ipfsText.href = `https://ipfs.io/ipfs/${lsipfs}`;
                ipfsText.textContent = lsipfs;
                ipfsCell.appendChild(ipfsText);
                
                const tranText = document.createElement('a');
                tranText.href = `https://sepolia.etherscan.io/tx/${lstran}`;
                tranText.textContent = lstran;
                tranCell.appendChild(tranText);
            }
        }
    } catch (error) {
        console.error('Error loading list:', error);
        alert('Failed to load. Please try again.');
    }
}

function localstorageclear() {
    localStorage.clear();
    location.reload();
}

async function appendToCSV(data) {
    try {
        // Write the new data back to the file
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'existing_file.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error appending data to CSV:', error);
    }
}
