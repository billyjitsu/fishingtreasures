import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton, connectorsForWallets } from "@rainbow-me/rainbowkit";
import heroImage from "../images/igloo.webp";
import { ClaimPrizeButton } from "./Buttons/ClaimPrizeButton";
import {
  useAccount,
  useProvider,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useContract,
} from "wagmi";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import LoadingScreen from "./Loading";
//import RetrieveImage from "./RetrieveImage";
import type {
  UseContractReadConfig,
  UsePrepareContractWriteConfig,
  UseContractWriteConfig,
  UseContractEventConfig,
} from "wagmi";
import FishingContract from "../contract/fishing.json";

const Intro = () => {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [minted, setMinted] = useState<boolean>(false);
  const provider = useProvider();

  const url = `https://testnets.opensea.io/${address}`;

  const ESCROWCONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const contractConfig = {
    address: ESCROWCONTRACT,
    abi: FishingContract.abi,
  };

  //Find the token URI of NFT ////////////////////////////
  // const { data: nftMetaData } = useContractRead({
  //   ...nftContractConfig,
  //   functionName: "tokenURI",
  //   args: [tokenId],
  //   watch: true,
  // } as unknown as UseContractReadConfig);

  // const getImage = async () => {
  //   const nftImage = await (await fetch(nftMetaData as string)).json();
  //   setNFT(nftImage.image);
  //  // console.log("NFT Image", nftImage.image);
  // };
  ///////////////////////////////////////////////////////

  return (
    <div className="bg-black h-screen w-full ">
      <>
        {!loading && (
          <div className="flex flex-col md:flex-row px-5 justify-center lg:mr-16 h-screen w-full">
            <div className="relative flex w-full h-screen content-center items-center justify-center md:h-screen z-10 bg-gradient-to-b from-black  to-slate-300">
              <div>
                {
                  <Image
                    src={heroImage}
                    alt="heroBanner"
                    layout="fill"
                    objectFit="cover"
                    priority
                  />
                }
                {/* objectFit='cover' or 'contain' */}
              </div>

              <div className="container relative mx-auto p-16 md:p-0">
                <div className="flex flex-col  items-center justify-center -mt-6 md:mt-0 sm:-ml-0 md:-ml-12">
                  <div className="text-center md:text-left md:ml-16 md:space-y-0 space-x-2 space-y-5">
                    {!loading && !minted && (
                      <>
                        <h1 className="text-3xl md:text-5xl font-bold text-center md:pb-3 text-blue-400 ">
                          Pudgy Fishing Treasures <br></br>
                        </h1>

                        <h1 className="text-md font-semibold md:text-2xl text-center text-blue-400">
                          Go fishing with your Rogs
                        </h1>
                        <h1 className="text-md md:text-xl text-center text-blue-400 pb-5">
                          Powered by API3
                        </h1>
                      </>
                    )}

                    <div className="flex flex-col max-w-s items-center text-center">
                      {isConnected && !minted && (
                        <ClaimPrizeButton
                          contractConfig={contractConfig}
                          setLoading={setLoading}
                          setMinted={setMinted}
                        />
                      )}
                      {!isConnected && (
                        <>
                          <ConnectButton />
                        </>
                      )}
                    </div>
                    {minted && (
                      <div className="flex flex-col items-center text-center">
                        <h1 className="text-3xl md:text-5xl font-bold text-center md:pb-5 text-blue-400 ">
                          Taking a minute <br></br> to pull from the Ocean
                        </h1>
                        <h1 className="text-md font-semibold md:text-2xl text-center text-blue-400">
                            Check out your NFTs on OpenSea
                            </h1>
                        <a
                          className="text-xl font-bold text-blue-500 inline-block whitespace-nowrap uppercase underline mb-5"
                          href={url}
                          target="_blank"
                        >
                          Fishing Treasures
                        </a>

                        <button
                          className=" bg-blue-500 hover:bg-blue-600 rounded-full px-12 py-2  text-white font-bold"
                          onClick={() => setMinted(false)}
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Screen */}
        {loading && isConnected && <LoadingScreen />}
      </>
    </div>
  );
};

// export default Intro;
export default dynamic(() => Promise.resolve(Intro), { ssr: false });
