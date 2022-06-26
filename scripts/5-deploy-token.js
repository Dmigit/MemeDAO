import { AddressZero } from '@ethersproject/constants';
import sdk from './1-initialize-sdk.js';

(async () => {
    try {
        //Creating an ERC-20 token
        const tokenAddress = await sdk.deployer.deployToken({
            //The name of our token
            name: 'MemeDAO Governance Token',
            //Token symbol
            symbol: 'MEME',
            //Settigng who will get the proceeds from the token sale, 
            //since the token is free there will be no sales recipient
            primary_sale_recipient: AddressZero,

        });
        console.log("Successfully deployed ERC-20 token at", tokenAddress);
    } catch (error) {
        console.error("Failed to deploy ERC-20 token", error);
    }
})();