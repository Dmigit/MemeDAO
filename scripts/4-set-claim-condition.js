import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0x4B8Ff79206EB9E748378055Ed4A31F1741E820A4");

(async () => {
    try {
        //Defining the claim conditions such as max number of NFTs, minst start date, etc.
        const claimConditions = [{
            //When people can start minting NFTs (right now)
            startTime: new Date(),
            //Max number of NFTs that can be minted
            maxQuantity: 50_000,
            //NFT price (free)
            price: 0,
            //Amount of NFTs people can claim per transaction
            quantityLimitPerTransaction: 1,
            //Wait between transactions is MaxUint256 so that people can only miny once
            waitInSeconds: MaxUint256,
        }]

        await editionDrop.claimConditions.set("0", claimConditions);
        console.log("Successfully set claim conditions!");
    } catch (error) {
        console.error("Failed to set claim conditions ", error);
    }
})();