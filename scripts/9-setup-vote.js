import sdk from './1-initialize-sdk.js';

//Our governance contract (MemeDAO governance)
const vote = sdk.getVote("0x6B7dF77117692F96a0D3880a9411A531e8ac8376");

//Our ERC-20 contract ($MEME)
const token = sdk.getToken("0xFCdF47f4445A65A1D3c00574C2B2EC1e71328B58");

(async () => {
    try {
        //Giving the DAO treasury the power to mint additional tokens
        await token.roles.grant("minter", vote.getAddress());

        console.log("Successfully gave the MemeDAO treausry the ability to act on the token contract");
    } catch (error) {
        console.error("Failed to grant the DAO permission to token contract", error);
        process.exit(1);
    }

    try {
        //Grabbing my wallet's token balance because initially I held the entrie token supply (1,000,000)
        const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS);

        //Grabbing 90% of the supply we hold
        const ownedAmount = ownedTokenBalance.displayValue;
        const percent90 = Number(ownedAmount) / 100 * 90

        await token.transfer(
            vote.getAddress(),
            percent90
        );

        console.log("✅ Successfully transferred", percent90, "tokens to the vote contract");
    } catch (err) {
        console.error("Failed to transfer tokens to the vote contract", err);
    }
})();