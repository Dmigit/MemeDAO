import sdk from './1-initialize-sdk.js';

//ERC-20 token address
const token = sdk.getToken("0xFCdF47f4445A65A1D3c00574C2B2EC1e71328B58");

(async () => {
    try {
        //Setting the totoal amount of $MEME available 
        const amount = 1_000_000;
        //Mint 1,000,000 $MEME
        await token.mintToSelf(amount);
        const totalSupply = await token.totalSupply();
        //Prints how much $MEME is in circulation
        console.log("There now is", totalSupply.displayValue, "$MEME in circulation");
    } catch (error) {
        console.error("Failed to print money", error);
    }
})();