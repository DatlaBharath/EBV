const { deployments, getNamedAccounts, ethers } = require("hardhat")
const { assert, expect } = require("chai")

describe("ebv", async () => {
  let userName = "bharath"
  let Ebv, ebv;
  let deployerAddress;
  let owner,addr1,addr2,addrs;
  beforeEach(async () => {
    Ebv = await ethers.getContractFactory("Ebv");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    ebv = await Ebv.deploy();
  })
  describe("Adding Candidate Users", function() {
    it("Should add candidate user", async function() {
      await ebv.addCandidateUser("Alice", addr1.address, "alice@example.com", "Qualification", "YearPO");
      const candidate = await ebv.getCandidate();
      expect(candidate.length).to.equal(1);
      expect(candidate[0].name).to.equal("Alice");
      expect(candidate[0].add).to.equal(addr1.address);
    });

    it("Should not add duplicate candidate users", async function() {
      await ebv.addCandidateUser("Bob", addr2.address, "bob@example.com", "Qualification", "YearPO");
      await ebv.addCandidateUser("Bob", addr2.address, "bob@example.com", "Qualification", "YearPO");
      const candidate = await ebv.getCandidate();
      expect(candidate.length).to.equal(1);
    });
    it("Should not add candidate if already exists", async function() {
      await ebv.addCandidateUser("Charlie", addr1.address, "charlie@example.com", "Qualification", "YearPO");
      const initialCandidateCount = (await ebv.getCandidate()).length;
      await ebv.addCandidateUser("Charlie", addr1.address, "charlie@example.com", "Qualification", "YearPO");
      const finalCandidateCount = (await ebv.getCandidate()).length;
      expect(finalCandidateCount).to.equal(initialCandidateCount);
    });
  
    it("Should add candidate if not already exists", async function() {
      await ebv.addCandidateUser("David", addr1.address, "david@example.com", "Qualification", "YearPO");
      const initialCandidateCount = (await ebv.getCandidate()).length;
      await ebv.addCandidateUser("Eve", addr2.address, "eve@example.com", "Qualification", "YearPO");
      const finalCandidateCount = (await ebv.getCandidate()).length;
      expect(finalCandidateCount).to.equal(initialCandidateCount + 1);
    });
  });
  describe("Adding Recruiter Users", function() {
    it("Should add recruiter user", async function() {
      await ebv.addRecruiterUser("Alice", addr1.address, "alice@example.com", "Company A");
      const recruiters = await ebv.getRecruiter();
      expect(recruiters.length).to.equal(1);
      expect(recruiters[0].name).to.equal("Alice");
      expect(recruiters[0].add).to.equal(addr1.address);
    });

    it("Should not add duplicate recruiter users", async function() {
      await ebv.addRecruiterUser("Bob", addr2.address, "bob@example.com", "Company B");
      await ebv.addRecruiterUser("Bob", addr2.address, "bob@example.com", "Company B");
      const recruiters = await ebv.getRecruiter();
      expect(recruiters.length).to.equal(1);
    });
    it("Should not add recruiter if already exists", async function() {
      await ebv.addRecruiterUser("Charlie", addr1.address, "charlie@example.com", "Company C");
      const initialRecruiterCount = (await ebv.getRecruiter()).length;
      await ebv.addRecruiterUser("Charlie", addr1.address, "charlie@example.com", "Company C");
      const finalRecruiterCount = (await ebv.getRecruiter()).length;
      expect(finalRecruiterCount).to.equal(initialRecruiterCount);
    });
  
    it("Should add recruiter if not already exists", async function() {
      await ebv.addRecruiterUser("David", addr1.address, "david@example.com", "Company D");
      const initialRecruiterCount = (await ebv.getRecruiter()).length;
      await ebv.addRecruiterUser("Eve", addr2.address, "eve@example.com", "Company E");
      const finalRecruiterCount = (await ebv.getRecruiter()).length;
      expect(finalRecruiterCount).to.equal(initialRecruiterCount + 1);
    });
  });

  describe("Constructor", function() {
    it("Should set the owner to the deployer", async function() {
      expect(await ebv.i_owner()).to.equal(owner.address);
    });
  });
  describe("Candidate Validation", function() {
    it("Should return true if candidate exists with matching username and address", async function() {
      await ebv.addCandidateUser("Alice", addr1.address, "alice@example.com", "Qualification", "YearPO");
      const isValid = await ebv.candidateValidate("Alice", addr1.address);
      expect(isValid).to.be.true;
    });

    it("Should return false if candidate exists with matching address but different username", async function() {
      await ebv.addCandidateUser("Alice", addr1.address, "alice@example.com", "Qualification", "YearPO");
      const isValid = await ebv.candidateValidate("Bob", addr1.address);
      expect(isValid).to.be.false;
    });

    it("Should return false if candidate does not exist with the given address", async function() {
      const isValid = await ebv.candidateValidate("Alice", addr1.address);
      expect(isValid).to.be.false;
    });

    it("Should return false if candidate array is empty", async function() {
      const isValid = await ebv.candidateValidate("Alice", addr1.address);
      expect(isValid).to.be.false;
    });
  });
  describe("Recruiter Validation", function() {
    it("Should return true if recruiter exists with matching username and address", async function() {
      await ebv.addRecruiterUser("Alice", addr1.address, "alice@example.com", "Company A");
      const isValid = await ebv.recruiterValidate("Alice", addr1.address);
      expect(isValid).to.be.true;
    });

    it("Should return false if recruiter exists with matching address but different username", async function() {
      await ebv.addRecruiterUser("Alice", addr1.address, "alice@example.com", "Company A");
      const isValid = await ebv.recruiterValidate("Bob", addr1.address);
      expect(isValid).to.be.false;
    });

    it("Should return false if recruiter does not exist with the given address", async function() {
      const isValid = await ebv.recruiterValidate("Alice", addr1.address);
      expect(isValid).to.be.false;
    });

    it("Should return false if recruiter array is empty", async function() {
      const isValid = await ebv.recruiterValidate("Alice", addr1.address);
      expect(isValid).to.be.false;
    });
  });

  describe("Uploading Candidate Document", function() {
    it("Should upload candidate document", async function() {
      const docName = "Document A";
      const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hash"));
      const ipfsHash = "ipfsHash";

      await ebv.uplodeCandidateDocument(docName, docHash, ipfsHash);

      const uploadedDocuments = await ebv.getArray(owner.address);
      expect(uploadedDocuments.length).to.equal(1);
      expect(uploadedDocuments[0].docName).to.equal(docName);
      expect(uploadedDocuments[0].docHash).to.equal(docHash);
      expect(uploadedDocuments[0].ipfs).to.equal(ipfsHash);

      const verifiedHashes = await ebv.getToBeVerified();
      expect(verifiedHashes.length).to.equal(1);
      expect(verifiedHashes[0]).to.equal(docHash);
    });

    it("Should mark the document as verified if already exists", async function() {
      const docName = "Document A";
      const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hash"));
      const ipfsHash = "ipfsHash";

      await ebv.uplodeCandidateDocument(docName, docHash, ipfsHash);
      await ebv.hashArray(docHash);
      await ebv.hashVerify(docHash);

      const verifiedHashes = await ebv.getToBeVerified();
      expect(verifiedHashes.length).to.equal(1);
    });
  });
  describe("Hash Array", function() {
    it("Should add document hash to array", async function() {
      const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hash"));

      await ebv.hashArray(docHash);

      const arrHash = await ebv.arrHash(0);
      expect(arrHash).to.equal(docHash);
    });
  });

  describe("Hash Verify", function() {
    it("Should verify the hash and set its status to true", async function() {
      const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hash"));
      await ebv.hashArray(docHash);
      
      // Verify the hash
      await ebv.hashVerify(docHash);

      const verifiedHashes = await ebv.getToBeVerified();
      expect(verifiedHashes.length).to.equal(0); // Hash should not be in the to-be-verified list
    });

    it("Should not verify the hash if it does not exist in arrHash", async function() {
      const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hash"));
      const anotherHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("another_hash"));
      await ebv.hashArray(docHash);

      // Verify a different hash
      await ebv.hashVerify(anotherHash);

      const verifiedHashes = await ebv.getToBeVerified();
      expect(verifiedHashes.length).to.equal(0); // Hash should remain in the to-be-verified list
    });
  });
  describe("Owner Validation", function() {
    it("Should return true if provided username and address match the owner's", async function() {
      const username = "bharath";
      const address = owner.address;

      const isValid = await ebv.ownerValidate(username, address);

      expect(isValid).to.be.true;
    });

    it("Should return false if provided username and address do not match the owner's", async function() {
      const username = "bharath";
      const address = addr1.address;

      const isValid = await ebv.ownerValidate(username, address);

      expect(isValid).to.be.false;
    });

    it("Should return false if provided address does not match the owner's", async function() {
      const username = "bharath";
      const address = addr1.address;

      const isValid = await ebv.ownerValidate(username, address);

      expect(isValid).to.be.false;
    });
  });
  describe("Get Verified Documents", function() {
    it("Should return verified documents for the given address", async function() {
      const docName = "Document A";
      const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hash"));
      const ipfsHash = "ipfsHash";

      // Upload a document and verify its hash
      await ebv.uplodeCandidateDocument(docName, docHash, ipfsHash);
      await ebv.hashArray(docHash);
      await ebv.hashVerify(docHash);

      // Retrieve verified documents for the owner's address
      const verifiedDocuments = await ebv.getVerifiedDocuments(owner.address);

      expect(verifiedDocuments.length).to.equal(1);
      expect(verifiedDocuments[0].docName).to.equal(docName);
      expect(verifiedDocuments[0].docHash).to.equal(docHash);
      expect(verifiedDocuments[0].ipfs).to.equal(ipfsHash);
    });

    it("Should return an empty array if no verified documents exist for the given address", async function() {
      // Retrieve verified documents for an address with no uploaded documents
      const verifiedDocuments = await ebv.getVerifiedDocuments(addr1.address);

      expect(verifiedDocuments.length).to.equal(0);
    });
  });

  describe("Get Non-Verified Documents", function() {
    it("Should return non-verified documents for the given address", async function() {
      const docName = "Document A";
      const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hash"));
      const ipfsHash = "ipfsHash";

      // Upload a document but do not verify its hash
      await ebv.uplodeCandidateDocument(docName, docHash, ipfsHash);

      // Retrieve non-verified documents for the owner's address
      const nonVerifiedDocuments = await ebv.getNonVerifiedDocuments(owner.address);

      expect(nonVerifiedDocuments.length).to.equal(1);
      expect(nonVerifiedDocuments[0].docName).to.equal(docName);
      expect(nonVerifiedDocuments[0].docHash).to.equal(docHash);
      expect(nonVerifiedDocuments[0].ipfs).to.equal(ipfsHash);
    });

    it("Should return an empty array if no non-verified documents exist for the given address", async function() {
      // Retrieve non-verified documents for an address with no uploaded documents
      const nonVerifiedDocuments = await ebv.getNonVerifiedDocuments(addr1.address);

      expect(nonVerifiedDocuments.length).to.equal(0);
    });

    it("Should return an empty array if all documents for the given address are verified", async function() {
      const docName = "Document A";
      const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hash"));
      const ipfsHash = "ipfsHash";

      // Upload a document and verify its hash
      await ebv.uplodeCandidateDocument(docName, docHash, ipfsHash);
      await ebv.hashArray(docHash)
      await ebv.hashVerify(docHash);

      // Retrieve non-verified documents for the owner's address
      const nonVerifiedDocuments = await ebv.getNonVerifiedDocuments(owner.address);

      expect(nonVerifiedDocuments.length).to.equal(0);
    });
  });
  describe("Get To-Be-Verified Hashes", function() {
    it("Should return hashes that need to be verified", async function() {
      const docHash1 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hash1"));
      const docHash2 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hash2"));

      // Upload documents but do not verify their hashes
      await ebv.uplodeCandidateDocument("Document 1", docHash1, "ipfsHash1");
      await ebv.uplodeCandidateDocument("Document 2", docHash2, "ipfsHash2");

      // Retrieve hashes that need to be verified
      const toBeVerifiedHashes = await ebv.getToBeVerified();

      expect(toBeVerifiedHashes.length).to.equal(2);
      expect(toBeVerifiedHashes[0]).to.equal(docHash1);
      expect(toBeVerifiedHashes[1]).to.equal(docHash2);
    });


    it("Should return an empty array if no hashes need to be verified", async function() {
      // Retrieve hashes that need to be verified when no documents are uploaded
      const toBeVerifiedHashes = await ebv.getToBeVerified();

      expect(toBeVerifiedHashes.length).to.equal(0);
    });
  });
  describe("Get Recruiters", function() {
    it("Should return recruiters array", async function() {
      const recruiters = await ebv.getRecruiter();
      expect(recruiters.length).to.equal(0); // Initially, the array should be empty
    });
  });

  describe("Get Candidates", function() {
    it("Should return candidates array", async function() {
      const candidates = await ebv.getCandidate();
      expect(candidates.length).to.equal(0); // Initially, the array should be empty
    });
  });

  describe("Get Candidate by Address", function() {
    it("Should return candidate by address", async function() {
      // Add a candidate
      await ebv.addCandidateUser("Candidate A", addr1.address, "email", "qualification", "yearPO");

      // Get the candidate by address
      const candidate = await ebv.getRCandidate(addr1.address);

      expect(candidate.name).to.equal("Candidate A");
      expect(candidate.add).to.equal(addr1.address);
    });

    it("Should return default user if candidate not found", async function() {
      // Get a candidate by address when no candidates exist
      const candidate = await ebv.getRCandidate(addr1.address);

      expect(candidate.name).to.equal("none");
      expect(candidate.add).to.equal(owner.address);
    });
  });

  describe("Get Candidate by Name", function() {
    it("Should return candidate by name", async function() {
      // Add a candidate
      await ebv.addCandidateUser("Candidate B", addr1.address, "email", "qualification", "yearPO");

      // Get the candidate by name
      const candidate = await ebv.getRbnCandidate("Candidate B");

      expect(candidate.name).to.equal("Candidate B");
      expect(candidate.add).to.equal(addr1.address);
    });

    it("Should return default user if candidate not found", async function() {
      // Get a candidate by name when no candidates exist
      const candidate = await ebv.getRbnCandidate("Nonexistent Candidate");

      expect(candidate.name).to.equal("none");
      expect(candidate.add).to.equal(owner.address);
    });
  });

  describe("Get Recruiter by Address", function() {
    it("Should return recruiter by address", async function() {
      // Add a recruiter
      await ebv.addRecruiterUser("Recruiter A", addr1.address, "email", "company");

      // Get the recruiter by address
      const recruiter = await ebv.getRRecruiter(addr1.address);

      expect(recruiter.name).to.equal("Recruiter A");
      expect(recruiter.add).to.equal(addr1.address);
    });

    it("Should return default user2 if recruiter not found", async function() {
      // Get a recruiter by address when no recruiters exist
      const recruiter = await ebv.getRRecruiter(addr1.address);

      expect(recruiter.name).to.equal("none");
      expect(recruiter.add).to.equal(owner.address);
    });
  });
});
