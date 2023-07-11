import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton, connectorsForWallets } from "@rainbow-me/rainbowkit";
import heroImage from "../images/igloo-redo-dark.webp";
import { ClaimPrizeButton } from "./Buttons/ClaimPrizeButton";
import { DelegatePrizeButton } from "./Buttons/DelegatePrizeButton";
import {
  useAccount,
  useProvider,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useContract,
} from "wagmi";
import { ethers } from "ethers";
import { DelegateCash } from "delegatecash";
import React, { useState, useEffect } from "react";
import LoadingScreen from "./Loading";
import type {
  UseContractReadConfig,
  UsePrepareContractWriteConfig,
  UseContractWriteConfig,
  UseContractEventConfig,
} from "wagmi";
import FishingContract from "../contract/fishing.json";
import fishingPull from "../images/fishpull.webp";

const Intro = () => {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [minted, setMinted] = useState<boolean>(false);
  const [eventData, setEventData] = useState<any>([]);
  const provider = useProvider();
  const dc = new DelegateCash(provider);

  const prizeImages: any = {
    1: require("../images/prizes/1.jpg"),
    2: require("../images/prizes/2.jpg"),
    3: require("../images/prizes/3.jpg"),
    4: require("../images/prizes/4.jpg"),
    5: require("../images/prizes/5.jpg"),
  };

  const url = `https://testnets.opensea.io/${address}`;

  const ESCROWCONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const contractConfig = {
    address: ESCROWCONTRACT,
    abi: FishingContract.abi,
  };

  const delegateCheck = async () => {
    const delegationsByDelegate = await dc.getDelegationsByDelegate(address);
    console.log("delegationsByDelegate", delegationsByDelegate);
    console.log("delegate wallet", delegationsByDelegate[0].vault);
    const isDelegateForAll = await dc.checkDelegateForAll(
      address,
      delegationsByDelegate[0].vault
    );
    console.log("isDelegateForAll", isDelegateForAll);
    // const tokenLevelDelegations = await dc.getTokenLevelDelegations(vault);
    // console.log("tokenLevelDelegations", tokenLevelDelegations);
  };

  const listen = useContract({
    ...contractConfig,
    signerOrProvider: provider,
  } as any);

  useEffect(() => {}, []);

  return (
    <div className="bg-black h-screen w-full ">
      <>
        {!loading && (
          <div className="flex flex-col md:flex-row justify-center lg:mr-16 h-screen w-screen">
            <div className="relative flex w-screen h-screen content-center items-center justify-center md:h-screen z-10 bg-gradient-to-b from-black  to-slate-300">
              <div>
                {<Image src={heroImage} alt="heroBanner" fill priority />}
                {/* objectFit='cover' or 'contain' */}
              </div>

              <div className="container relative mx-auto p-16 md:p-0">
                <div className="flex flex-col  items-center justify-center -mt-6 md:-mt-32 sm:-ml-0 md:-ml-12">
                  <div className="text-center md:text-left md:ml-16 md:space-y-0 space-x-2 space-y-5 ">
                    {!loading && !minted && (
                      <>
                        <h1 className="text-3xl md:text-6xl font-bold text-center md:pb-3 text-blue-400 drop-shadow-[0_2.2px_1.2px_rgba(0,0,0,0.8)] ">
                          Pudgy Fishing Treasures <br></br>
                        </h1>

                        <h1 className="text-md font-semibold md:text-2xl text-center text-white drop-shadow-[0_2.2px_1.2px_rgba(0,0,0,0.8)]">
                          Go fishing with your Rogs
                        </h1>
                        <h1 className="text-md font-semibold md:text-xl text-center text-white drop-shadow-[0_2.2px_1.2px_rgba(0,0,0,0.8)]">
                          *Requires a Rog to fish*
                        </h1>
                        <h1 className="text-md font-semibold md:text-lg text-center text-white pb-5 drop-shadow-[0_2.2px_1.2px_rgba(0,0,0,0.8)]">
                          Powered by API3
                        </h1>
                      </>
                    )}

                    <div className="flex flex-col max-w-s items-center text-center space-y-2">
                      {isConnected && !minted && (
                        <>
                          <ClaimPrizeButton
                            listen={listen}
                            contractConfig={contractConfig}
                            setLoading={setLoading}
                            setMinted={setMinted}
                            setEventData={setEventData}
                          />
                          <button
                            className=" bg-blue-500 hover:bg-blue-600 rounded-full px-12 py-2  text-white font-bold"
                            onClick={delegateCheck}
                          >
                            Delegate Check
                          </button>

                          <ClaimPrizeButton
                            listen={listen}
                            contractConfig={contractConfig}
                            setLoading={setLoading}
                            setMinted={setMinted}
                            setEventData={setEventData}
                          />
                        </>
                      )}
                      {!isConnected && (
                        <>
                          <ConnectButton />
                        </>
                      )}
                    </div>
                    {minted && (
                      <div className="flex flex-col items-center text-center">
                        <h1 className="text-3xl md:text-6xl font-bold text-center md:pb-5 text-blue-400 ">
                          {eventData.length === 0 && (
                            <div className="animate-pulse drop-shadow-[0_2.2px_1.2px_rgba(0,0,0,0.8)]">
                              <p>Taking a minute </p>{" "}
                              <p>to pull from the Ocean</p>{" "}
                            </div>
                          )}
                          {eventData.length > 0 && (
                            <div className="drop-shadow-[0_2.2px_1.2px_rgba(0,0,0,0.8)]">
                              <p>Treasure Found! </p>
                            </div>
                          )}
                        </h1>

                        {eventData.length === 0 && (
                          <div className="flex flex-col items-center justify-center mb-10 md:mb-0">
                            <Image
                              src={fishingPull}
                              alt="fishing"
                              width={150}
                              height={150}
                            />
                          </div>
                        )}

                        <div className="flex flex-col md:flex-row space-x-3 m-5">
                          {eventData.map((numStr: any, index: any) => (
                            <Image
                              key={index}
                              src={prizeImages[numStr]}
                              width={150}
                              alt={`Prize ${numStr}`}
                            />
                          ))}
                        </div>

                        {eventData.length > 0 && (
                          <>
                            <h1 className="text-md font-semibold md:text-2xl text-center text-white drop-shadow-[0_2.2px_1.2px_rgba(0,0,0,0.8)]">
                              Check out your NFTs on OpenSea
                            </h1>
                            <a
                              className="text-xl font-bold text-white drop-shadow-[0_2.2px_1.2px_rgba(0,0,0,0.8)] inline-block whitespace-nowrap uppercase underline mb-5"
                              href={url}
                              target="_blank"
                            >
                              Fishing Treasures
                            </a>

                            <button
                              className=" bg-blue-500 hover:bg-blue-600 rounded-full px-12 py-2  text-white font-bold"
                              onClick={() => {
                                setMinted(false);
                                setEventData([]);
                              }}
                            >
                              Close
                            </button>
                          </>
                        )}
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
