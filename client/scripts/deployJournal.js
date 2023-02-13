const hre = require("hardhat");

async function main() {
    const Journal = await hre.ethers.getContractFactory("Journal");
    const journal = await Journal.deploy(
        "Flow Journal", // Flow -> motion -> kinetic (signal kinetics)
        "SKSSJ", // Signal Kinetics -> Star Sailors -> Journal
        "100000000000000000" // 0.1 MATIC
    );

    await journal.deploted();
    console.log("Journal contract deployed to: ", journal.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });