import { ethers } from "hardhat";

async function main() {

  const _airnode = "0xa0AD79D995DdeeB18a14eAef56A549A04e3Aa1Bd"; // Nodary Airnode Tesnet
  const pudgyAddress = "0xc688e3d988a2713D55Eeb4c15888D8A6492EEe8B"; // Pudgy Penguins
  const lilpAddress = "0x34c42692c009Fe2E9d7e2b419Aa183d18CaDf2b9"; // Lil Pudgys
  const rogsAddress = "0x1EFcB45D3154369F39A4Cf2D5b6256DEf5c942C1"; // Pudgy Present 
  const NFTURI = "https://7q6a6lnjfy7bmfszdz6riql5avkbuznnubama3s27y2bvysktxaa.arweave.net/_DwPLakuPhYWWR59FEF9BVQaZa2gQMBuWv40GuJKncA/"; 

  // const PP = await ethers.getContractFactory("PudgyPenguins");
  // const pp = await PP.deploy();
  // await pp.deployed();
  // console.log("PP deployed to:", pp.address);

  // const LilP = await ethers.getContractFactory("LilPudgys");
  // const lilp = await LilP.deploy();
  // await lilp.deployed();
  // console.log("lilp deployed to:", lilp.address);  

  // const ROGS = await ethers.getContractFactory("PudgyPresent");
  // const rogs = await ROGS.deploy();
  // await rogs.deployed();
  // console.log("Rogs deployed to:", rogs.address);

  const Fish = await ethers.getContractFactory("TreasureHunt");
  const fish = await Fish.deploy(_airnode, pudgyAddress, lilpAddress, rogsAddress, NFTURI);
  await fish.deployed();
  console.log("Fish deployed to:", fish.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
