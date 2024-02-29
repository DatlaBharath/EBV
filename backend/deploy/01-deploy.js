const { network} = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    // const chainId = network.config.chainId
    log("----------------------------------------------------")
    log("Deploying Ebv...")
    const ebv = await deploy("Ebv", {
        from: deployer,
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`Ebv deployed at ${ebv.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.HHAPI
    ) {
        await verify(ebv.address)
    }
}

module.exports.tags = ["all", "ebv"]