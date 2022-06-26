import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js"; 
import { readFileSync } from "fs";

(async () => {
    try {
        const editionDropAddress = await sdk.deployer.deployEditionDrop({
            //Name of NFT collection
            name: "MemeDAO MemeLords",
            //Collection description
            description: "A DAO for memelords.",
            //NFT image
            image: readFileSync("scripts/assets/memelord.png"),
            //Address of the person that will recieve proceeds from the NFT drop.
            //It is set to AddressZero because there will be no charge for the drop.
            primary_sale_recipient: AddressZero,
        });

        //Returns the address of our contract
        //This is to initialize contract on thirdweb sdk
        const editionDrop = sdk.getEditionDrop(editionDropAddress);

        //This is to get the contract metadata
        const metadata = await editionDrop.metadata.get();
        
        console.log(
            "Successfully deployed editionDrop contract, address: ",
            editionDropAddress,
        );
        console.log("editionDrop metadata: ", metadata);
    } catch(error) {
      console.log("failed to deploy editionDrop contract ", error);
    }
})();