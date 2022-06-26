import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

const editionDrop = sdk.getEditionDrop("0x4B8Ff79206EB9E748378055Ed4A31F1741E820A4");

(async () => {
    try {
        await editionDrop.createBatch([
            {
                name: "The Meme Lord Token",
                description: "This NFT will give you access to MemeDAO!",
                image: readFileSync('scripts/assets/memelordtoken.jpeg')
            },
        ]);
        console.log("Successfully created a new NFT in the drop!")
    } catch (error) {
        console.error("Failed to create a new NFT ", error);
    }
})();