import sdk from './1-initialize-sdk.js';

const token = sdk.getToken("0xFCdF47f4445A65A1D3c00574C2B2EC1e71328B58");

(async () => {
    try {
        //log the current roles
        const allRoles = await token.roles.getAll();

        console.log("👀 Roles that exist right now:", allRoles);

        //Revoking my ability to mint tokens 
        await token.roles.setAll({ admin: [], minter: [] });
        console.log("🎉 Roles after revoking myself:", await token.roles.getAll());
        console.log("✅ Successfully revoked my superpowers from the ERC-20 contract");
    
    } catch (error) {
        console.error("Failed to revoke ourselves from the DAO treasury", error);
    }
})();