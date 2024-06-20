Project README
Overview

This project involves uploading files to IPFS via Pinata, verifying them through a web interface, and interacting with Ethereum smart contracts to store verification status. Users can upload files, verify them through a modal interface, and track verification status via the blockchain and local storage.
Technologies Used

    IPFS (InterPlanetary File System): for decentralized file storage.
    Pinata: as a Pinning Service to interact with IPFS.
    Web3.js: for interacting with Ethereum blockchain.
    HTML, CSS, JavaScript: for the frontend and basic styling.
    CryptoJS: for hashing functions.

Setup Instructions

    Clone the Repository

    bash

    git clone https://github.com/SurajKMUllura/Securing-academic-credentials-and-skillset-using-Blockchain-technology
    cd repository

    Install Dependencies

    No specific dependencies mentioned, ensure you have a modern web browser and an active internet connection.

    Configure Pinata API Keys

    Replace pinataApiKey and pinataSecretApiKey in the code with your Pinata API keys. These keys are necessary for file pinning and retrieval.

    Run the Application

    Open index.html in a web browser.

Usage
Uploading Files

    Use the uploadFile or uploadSkillsetCertification functions to upload files to Pinata. Choose file type and provide necessary details like email and file description.

Verifying Files

    Click on the verification button associated with a file to initiate verification. Answer verification questions in the modal dialog that appears.

Managing Files

    View uploaded files and their verification status. Files are displayed based on the user's address.

Functions Overview
uploadFileToPinata(file, selectedAdminAddress)

    Description: Uploads a file to Pinata using FormData.
    Parameters:
        file: File object to be uploaded.
        selectedAdminAddress: Admin address for file organization.
    Returns: IPFS hash of the uploaded file.

handleVerificationSubmission()

    Description: Handles verification submission, interacts with Ethereum smart contracts.
    Processes:
        Retrieves user answers from the modal.
        Updates verification status based on answers.
        Updates UI and sends email notification on verification completion.

fetchAllFilesData()

    Description: Fetches all pinned files' metadata from Pinata.
    Returns: Array of objects containing file metadata (user address, IPFS hash, verification status).

loadFilesForUser()

    Description: Loads and displays files uploaded by the current user.
    Processes:
        Retrieves IPFS hashes and transaction hashes stored locally.
        Displays file details in a table format.

Additional Functions

    hashIPFS(ipfsHash): Hashes an IPFS hash using SHA-256.
    stringToBytes32(hashedDigest): Converts a hashed digest to bytes32 format.

Support

For any issues or questions, please contact [surajkmullura@email.com].
