import { useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork } from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import { useState, useEffect, useMemo } from "react";
import { AddressZero } from "@ethersproject/constants";

const App = () => {
  const address = useAddress();
  const network = useNetwork();
  const connectWithMetamask = useMetamask();
  console.log("Hello Adress:", address);

  //Initializing the edition drop contract
  const editionDrop = useEditionDrop("0x4B8Ff79206EB9E748378055Ed4A31F1741E820A4");

  //Initialize the ERC-20 token
  const token = useToken("0xFCdF47f4445A65A1D3c00574C2B2EC1e71328B58");

  //Initialize the vote address
  const vote = useVote("0x6B7dF77117692F96a0D3880a9411A531e8ac8376");

  //State variables to check if user has minted NFT
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  //Creating a variable so that we can render a loading state
  const [isClaiming, setIsClaiming] = useState(false);

  //Holds the amount of tokens each DAO member has in the state
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);

  //State representing all of our member's addresses
  const [memberAddresses, setMemberAddresses] = useState([]);

  //A fucntion to shorten a member's wallet address
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  //Retrieves all of the existing proposals from the contract
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    //A call to vote.getAll() to grab the proposals
    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log("🌈Proposals:", proposals);
      } catch (error) {
        console.log("Failed to get proposals", error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  //Checking if a user has already voted
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    if (!proposals.length) {
      return;
    }
    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("The user has already voted 😈")
        } else {
          console.log("The user hasn't voted yet 👿")
        }
      } catch (error) {
        console.error("Failed to check if user has already voted", error);
      }
    };
    checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, vote, address]);
  
  //Grabbing the addresses of our members that have our NFT
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllAddresses = async () => {
      try {
         const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
         setMemberAddresses(memberAddresses);
         console.log("Member addresses: ", memberAddresses);
      } catch (error) {
        console.error("Failed to get member list", error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);

  //Grabbing the amount of $MEME each MemeDAO member holds
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("Amounts", amounts);
      } catch (error) {
        console.error("Failed to get member balances", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token.history]);

  //Combining memberAddresses and memberTokenAmounts into one array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      //Checking if the member address is also found in the memberTokenAmounts array.
      //If it is, each member's token amount is returned, otherwise 0 is returned.
      const member = memberTokenAmounts?.find(({ holder }) => holder === address);
      
      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    //If a users wallet is not connected, then exit
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("This user has claimed an NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("This user does not have an NFT!")
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Failed to get balance", error);
      }
    };
     checkBalance();
  }, [address, editionDrop])

  const mintNft = async() => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(`Successfully minted your NFT! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0 `);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.log('Failed to mint NFT', error);
    } finally {
      setIsClaiming(false);
    }
  };

  if (!address) {
    return (
      <div className="wrapper">
        <div className="landing">
            <h1>Welcome to MemeDAO</h1>
            <button onClick={connectWithMetamask} className="btn-hero">Connect Wallet</button>
        </div>
      </div>
    )
  }

  if (address && (network?.[0].data.chain.id !== ChainId.Rinkeby)) {
    return (
      <div className="wrapper">
        <div className="unsupported-network">
           <h2>Please connect to Rinkeby</h2>
           <p>This dApp only works with the Rinkeby network, please switch networks on your connected wallet.</p>
        </div>
      </div>
    )
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
         <h1>MemeDAO member page</h1>
         <p>Congratulations on being a member!</p>
         <div>
           <div>
             <h2>Member List</h2>
             <table className="card">
               <thead>
                 <tr>
                   <th>Address</th>
                   <th>Token Amount</th>
                 </tr>
               </thead>
               <tbody>
                 {memberList.map((member) => {
                   return (
                     <tr key={member.address}>
                       <td>{shortenAddress(member.address)}</td>
                       <td>{member.tokenAmount}</td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
           <div>
             <h2>Active Proposals</h2>
             <form
               onSubmit={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  //Disabling button to prevent double clicks
                  setIsVoting(true);

                  //Getting the votes from the form for the values
                  const votes = proposals.map((proposal) => {
                    const voteResult = {
                      proposalId: proposal.proposalId,
                      //abstain by default
                      vote: 2,
                    };
                    proposal.votes.forEach((vote) => {
                      const elem = document.getElementById(
                        proposal.proposalId + "-" + vote.type
                      );

                      if (elem.checked) {
                        voteResult.vote = vote.type;
                        return;
                      }
                    });
                    return voteResult;
                  });
                  //making sure the user delegates their token to vote
                  try {
                    //checking if the wallet still needs to delegate it's tokens
                    const delgation = await token.getDelegationOf(address);
                    //if the delegation is the 0x0 address that means they haven't delegated their tokens yet
                    if (delgation === AddressZero) {
                      //If they haven't delgated their tokens yet, they'll need to delegate
                      await token.delegateTo(address);
                    }
                    //then we need to vote on the proposals
                    try {
                      await Promise.all(
                        votes.map(async ({ proposalId, vote: _vote}) => {
                          //before voting we need to check if the proposal is even open for voting
                          //we first need to get the latest state of the proposal
                          const proposal = await vote.get(proposalId);
                          //then we need to check if the proposal is open for voting (if the state is 1 it means that it is)
                          if (proposal.state === 1) {
                            //If it's open then vote on it
                            return vote.vote(proposalId, _vote);
                          }
                          //If it's not open then we just return nothing
                          return;
                        })
                      );
                      try {
                        //if any of the proposals are ready to be executed we execute them
                        //if state === 4 then a proposal is ready to be executed
                        await Promise.all(
                          votes.map(async ({ proposalId }) => {
                            //first we need to get the latest state of the proposal again, since we just voted before
                            const proposal = await vote.get(proposalId);

                            //If the state === 4 then we execute the proposal
                            if (proposal.state === 4) {
                              return vote.execute(proposalId);
                            }
                          })
                        );
                        //if we get here then it means we successfully voted, so I'll set the hasVoted state to true
                        setHasVoted(true);
                        //then we'll log out a success message
                        console.log("successully voted");
                      } catch (err) {
                        console.error("Failed to execute votes", err);
                      }
                    } catch (err) {
                      console.error("Failed to vote", err);
                    }
                  } catch (err) {
                    console.error("Failed to delegate tokens", err);
                  } finally {
                    //In any case the isVoting state mus be set to false to enable the button again
                    setIsVoting(false);
                  }
               }}
              >
                {proposals.map((proposal) => (
                  <div key={proposal.proposalId} className="card">
                    <h5>{proposal.description}</h5>
                    <div>
                      {proposal.votes.map(({ type, label }) => (
                        <div key={type}>
                          <input
                            type="radio"
                            id={proposal.proposalId + "-" + type}
                            name={proposal.proposalId} 
                            value={type}
                            //make the default checked to "abstain"
                            defaultChecked={type === 2}
                          />
                          <label htmlFor={proposal.proposalId + "-" + type}>
                              {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button disabled={isVoting || hasVoted} type="submit">
                   {isVoting
                     ? "Voting..." 
                     : hasVoted
                       ? "You already voted"
                       : "Submit votes"} 
                </button>
                {!hasVoted && (
                  <small>
                    This will trigger multiple transactions that you will need to sign.
                  </small>
                )}
              </form>
           </div>
         </div>
      </div>
    );
  };

  return (
    <div className="mint-nft">
      <h1>Mint your free MemeDAO NFT!</h1>
      <button onClick={mintNft} disabled={isClaiming}>{isClaiming ? "Minting..." : "Mint your NFT(free)"}</button>
    </div>

  );
};

export default App;
