import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import ethers from "ethers";

//importing and configuring .env file
import dotenv from "dotenv";
dotenv.config();

//Logging if our .env isn't working
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
    console.log("Private key not found!");
};

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === "") {
    console.log("Alchemy API not found!");
};

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
    console.log("Wallet address not found!");
};

//Using the Alchemy API URL to create the RPC URL
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
//Initializing wallet and thirdweb sdk
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const sdk = new ThirdwebSDK(wallet);

(async () => {
    try {
      const address = await sdk.getSigner().getAddress();
      console.log("SDK initiated by address: ", address);
    } catch (err) {
        console.log("Failed to get apps from the sdk, ", err);
        process.exit(1);
    }
})();

//exporting thirdweb sdk for use in other scripts
export default sdk;