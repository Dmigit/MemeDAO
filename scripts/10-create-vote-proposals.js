import sdk from './1-initialize-sdk.js';
import { ethers } from "ethers";

//Governance contract
const vote = sdk.getVote("0x6B7dF77117692F96a0D3880a9411A531e8ac8376");

//ERC-20 contract
const token = sdk.getToken("0xFCdF47f4445A65A1D3c00574C2B2EC1e71328B58");

(async () => {
    try {
        //Creating a proposal that mints 420,000 tokens to the treasury
        const amount = 420_000;
        const description = "Should the DAO mint an additional" + amount + "of $MEME into the treasury?";
        const executions = [
            {
               //The token contract that actually executes the mint
               toAddress: token.getAddress(),

               //Native token refers to ETH, but we're just minting $MEME so we should set this to 0
               nativeTokenValue: 0,

               //Using ethers.js to convert the amount to the correct format
               transactionData: token.encoder.encode(
                   "mintTo", [
                       vote.getAddress(),
                       ethers.utils.parseUnits(amount.toString(), 18),
                   ]
               ),
            }
        ];

        await vote.propose(description, executions);

        console.log("✅ Successfully created proposal to mint tokens");
    } catch (error) {
        console.error("Failed to create proposal", error);
        process.exit(1);
    }

    try {
        //Creating a proposal to transfer 6,900 tokens to myself
        const amount = 6_900;
        const description = "Should MemeDAO transfer " + amount + "  $MEME to " + process.env.WALLET_ADDRESS + " for being awesome?";
        const executions = [
            {
                nativeTokenValue: 0,
                transactionData: token.encoder.encode(
                    //Transfer from the treasury to our wallet
                    "transfer",
                    [
                        process.env.WALLET_ADDRESS,
                        ethers.utils.parseUnits(amount.toString(), 18),
                    ]
                ),
                toAddress: token.getAddress(),
            },
        ];

        await vote.propose(description, executions);

        console.log("✅ Successfully created proposal to reward myself from the treasury, hoepfully people vote for it!");
    } catch (error) {
        console.error("Failed to create second proposal", error);
    }
})();
