import sdk from './1-initialize-sdk.js';

//Address to the ERC-115 MemeDAO NFT Contract
const editionDrop = sdk.getEditionDrop("0x4B8Ff79206EB9E748378055Ed4A31F1741E820A4");

//Address to the ERC-20 $MEME token contract
const token = sdk.getToken("0xFCdF47f4445A65A1D3c00574C2B2EC1e71328B58");

(async () => {
    try {
        //Gets the addresses of all MemeLord NFT holders
        const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

        if (walletAddresses.length === 0) {
            console.log("No NFTs have been minted yet! Get some friends to mint one!");
            process.exit(0);
        }
        
        //Loop through the array of wallet addresses
        const airdropTargets = walletAddresses.map((address) => {
            //Pick a rancom number between 1000 and 10000
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            console.log("Going to airdrop ", randomAmount, " $MEME to", address);
             
            //Set up the airdrop target
            const airdropTarget = {
                toAddress: address,
                amount: randomAmount,
            };

            return airdropTarget;
        });
        
        //Call transfer batch on all of our airdrop targets
        console.log("starting airdrop...");
        await token.transferBatch(airdropTargets);
        console.log("Successfully transferred tokens to all NFT holders!");
    } catch (err) {
        console.log("Failed to airdrop tokens", err);
    }
})();