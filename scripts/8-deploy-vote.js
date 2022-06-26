import sdk from './1-initialize-sdk.js';

(async () => {
    try {
        const voteContractAddress = await sdk.deployer.deployVote({
            //Name of the governance contract
            name: "MemeDAO Governance",

            //The address of our governance token (ERC-20)
            voting_token_address: "0xFCdF47f4445A65A1D3c00574C2B2EC1e71328B58",


            //How many blocks after a proposal is created can members start voting?
            //This will be set to immediately
            voting_delay_in_blocks: 0,

            //How long do members have to vote on a proposal?
            //This will be set to 6570 blocks or around 1 day
            voting_period_in_blocks: 6570,

            //The minimum percent of the total supply that must vote
            //for the proposal to be valid after voting period has elapsed
            voting_quorum_fraction: 0,

            //What's the minimum amount of tokens required to create a proposal?
            proposal_token_threshold: 1,

        });

        console.log("Successfully deployed vote contract at address", voteContractAddress);

    } catch (err) {
        console.error("Failed to deploy vote contract", err);
    }
})();