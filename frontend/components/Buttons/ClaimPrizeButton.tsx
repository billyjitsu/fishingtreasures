import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import React from "react";
import type {
  UsePrepareContractWriteConfig,
  UseContractWriteConfig,
} from "wagmi";
import { useEffect } from "react";

interface ClaimPrizeButtonProps {
  address: string;
  listen: any; // TODO: make this properly typed to an address + ABI
  contractConfig: any; // TODO: make this properly typed to an address + ABI
  provider: any; // TODO: make this properly typed to an address + ABI
  setLoading: (value: React.SetStateAction<boolean>) => void;
  setMinted: (value: React.SetStateAction<boolean>) => void;
  setEventData: (value: React.SetStateAction<any>) => void;
}

const ClaimPrizeButton = ({
  address,
  provider,
  listen,
  contractConfig,
  setLoading,
  setMinted,
  setEventData,
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

  // const{ data: waitData } = useWaitForTransaction({
  //   hash: collectData?.hash,
  //  // confirmationCount: 1,
  // } as any);

  //   const temp = async ()=> {
  //      let newTEmp: any = provider?.getLogs({
  //     address: contractConfig.address,
  //     fromBlock: 36734939 ,
  //     toBlock: "latest",

  //   });
  //   console.log(newTEmp)
  // }

  //TransferBatch (index_topic_1 address operator, index_topic_2 address from, index_topic_3 address to, uint256[] ids, uint256[] values)
  listen.on("TransferBatch", (from: any, to: any, value: any, event: any) => {
    
    // if (to.toLowerCase() === address.toLowerCase()) {

      let transferEvent = {
        // from: from,
        // to: to,
        // value: value,
        eventData: event.map((bigNum: { toString: () => any }) => bigNum.toString()
        ),
      };
      console.log("EventData:", transferEvent.eventData);
      setEventData(transferEvent.eventData);
      //console.log(JSON.stringify(transferEvent, null, 4))
    // }
  });

  // console.log("temp data",temp);
  // const log = data.logs.find((log) => log.address === contractAddress);

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

  // useEffect(() => {
  //   temp();
  //     })
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

export { ClaimPrizeButton };
