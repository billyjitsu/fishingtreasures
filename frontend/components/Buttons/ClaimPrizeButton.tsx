import {
    usePrepareContractWrite,
    useContractWrite,
  } from "wagmi";
  import React from "react";
  import type {
    UsePrepareContractWriteConfig,
    UseContractWriteConfig,
  } from "wagmi";
  
  interface ClaimPrizeButtonProps {
    contractConfig: any; // TODO: make this properly typed to an address + ABI
    setLoading: (value: React.SetStateAction<boolean>) => void;
    setMinted: (value: React.SetStateAction<boolean>) => void;
  }
  
  const ClaimPrizeButton = ({
    contractConfig,
    setLoading,
    setMinted,
  }: ClaimPrizeButtonProps) => {
    //Claim Prize
    const { config: collectConfig, data: dataCollect } = usePrepareContractWrite({
      ...contractConfig,
      functionName: "letsGoFishing",
      overrides: {
        gasLimit: 1500000,
      },
      onError(error: any) {
        console.log("Error", error);
      },
    } as unknown as UsePrepareContractWriteConfig);
  
    const {
      data: collectData,
      writeAsync: goFish,
      isLoading: iscollectLoading,
      isSuccess: iscollectSuccess,
    } = useContractWrite(collectConfig as UseContractWriteConfig);
  
    const goFishFunction = async () => {
      try {
        if (typeof goFish === "function") {
          let nftTxn = await goFish?.();
          setLoading(true);
          await nftTxn.wait();
          setLoading(false);
          setMinted(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    ///////////////////////////////////////////////////////
    return (
      <>
        <button
          className=" bg-blue-500 hover:bg-blue-600 rounded-full px-12 py-2  text-white font-bold"
          onClick={goFishFunction}
        >
          Fish
        </button>
      </>
    );
  };
  
  export {ClaimPrizeButton}