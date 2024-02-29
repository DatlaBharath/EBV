const { deployments, getNamedAccounts, ethers } = require("hardhat")
const { assert, expect } = require("chai")

describe("ebv", async () => {
  let userName = "bharath"
  let deployer, ebv;
  let deployerAddress;
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    ebv = await ethers.getContract("Ebv", deployer);
    deployerAddress = await ethers.provider.getSigner(deployer).getAddress();
  })
  describe("constucter", async () => {
    it("Owner Stored", async () => {
      assert.equal(await ebv.i_owner(), deployerAddress);
    })
  })
  describe("Canadidate", async () => {
    let res;
    beforeEach(async () => {
      await ebv.addCandidateUser(userName, ebv.address);
      await ebv.addCandidateUser(userName, ebv.address);
      res = await ebv.candidate(0);
    })

    it("userName stored", async () => {
      assert.equal(res.name, userName);
    })

    it("address stored", async () => {
      assert.equal(res.add, ebv.address);
    })
    it("candidate validation valid input", async () => {
      response = await ebv.candidateValidate(userName, ebv.address);
      assert.equal(response, true);
    })
    it("candidate validation invalid address", async () => {
      response = await ebv.candidateValidate(userName, deployerAddress);
      assert.equal(response, false);
    })
    it("candidate validation invalid username", async () => {
      response = await ebv.candidateValidate("revi", ebv.address);
      assert.equal(response, false);
    })
  })
  describe("recruiter", async () => {
    let res;
    beforeEach(async () => {
      await ebv.addRecruiterUser(userName, ebv.address);
      res = await ebv.recruiter(0);
    })
    it("userName stored", async () => {
      assert.equal(res.name, userName);
    })

    it("address stored", async () => {
      assert.equal(res.add, ebv.address);
    })
    it("recruiter validation valid address", async () => {
      response = await ebv.recruiterValidate(userName, ebv.address);
      assert.equal(response, true);
    })
    it("recruiter validation invalid address", async () => {
      response = await ebv.recruiterValidate(userName, deployerAddress);
      assert.equal(response, false);
    })
    it("recruiter validation invalid username", async () => {
      response = await ebv.recruiterValidate("ravi", ebv.address);
      assert.equal(response, false);
    })
  })
  describe("Document", async () => {
    let res;
    beforeEach(async () => {
      await ebv.uplodeCandidateDocument("NCERT", "AN5630Y");
      res = await ebv.userData(deployerAddress, 0);
    })

    it("Document Name Stored", async () => {
      assert.equal(res.docName, "NCERT");
    })
    it("Document Id Stored", async () => {
      assert.equal(res.docId, "AN5630Y");
    })
  })
  describe("OwnerPower", async () => {
    let res;
    beforeEach(async () => {
      await ebv.hashArray("NCERT", "AN5630Y");
      res = await ebv.arrHash(0);
    })
    it("Document Hash Stored", async () => {
      assert.isTrue(res != null);
    })
    it("Owner name verification", async () => {
      assert.equal(await ebv.i_ownerName(), "bharath");
    })
    it("Owner Stored", async () => {
      assert.equal(await ebv.i_owner(), deployerAddress);
    })
  })
});
