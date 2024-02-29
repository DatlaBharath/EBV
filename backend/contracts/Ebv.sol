// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract Ebv {
    struct user {
        string name;
        address add;
        string email;
        string qualification;
        string yearPO;
    }
    struct user2 {
        string name;
        address add;
        string email;
        string company;
    }
    struct document {
        string docName;
        bytes32 docHash;
        string ipfs;
    }

    struct verifyStat {
        bytes32 hashValue;
        bool status;
    }

    mapping(address => document[]) public userData;

    function getArray(address _address) public view returns (document[] memory) {
        return userData[_address];
    }

    address immutable public i_owner;
    string public i_ownerName = "bharath";
    user[] public candidate;
    user2[] public recruiter;
    bytes32[] public arrHash;
    verifyStat[] public VerifiedHash;

    constructor() {
        i_owner = msg.sender;
    }

    function addCandidateUser(string memory _username, address _address,string memory _email,string memory _qualification,string memory _yearPO) public {
        uint check = 0;
        for (uint256 i = 0; i < candidate.length; i++) {
            if (candidate[i].add == _address) {
                check = 1;
            }
        }
        if (check == 0) {
            candidate.push(user(_username, _address,_email,_qualification,_yearPO));
        }
    }

    function addRecruiterUser(string memory _username, address _address,string memory _email,string memory _company) public {
        uint check = 0;
        for (uint256 i = 0; i < recruiter.length; i++) {
            if (recruiter[i].add == _address) {
                check = 1; 
            }
        }
        if (check == 0) {
            recruiter.push(user2(_username, _address, _email,_company));
        }
    }


    function candidateValidate(string memory _username, address _address) public view returns (bool) {
        for (uint256 i = 0; i < candidate.length; i++) {
            if (candidate[i].add == _address) {
                return keccak256(abi.encodePacked(candidate[i].name)) == keccak256(abi.encodePacked(_username));
            }
        }
        return false;
    }

    function recruiterValidate(string memory _username, address _address) public view returns (bool) {
        for (uint256 i = 0; i < recruiter.length; i++) {
            if (recruiter[i].add == _address) {
                return keccak256(abi.encodePacked(recruiter[i].name)) == keccak256(abi.encodePacked(_username));
            }
        }
        return false;
    }

    function uplodeCandidateDocument(string memory _docName, bytes32 _docHash, string memory _ipfs) public {
        userData[msg.sender].push(document(_docName, _docHash,_ipfs));
        uint k = 0;
        for (uint256 j = 0; j < VerifiedHash.length; j++) {
            if (VerifiedHash[j].hashValue == _docHash) {
                k = 1;
            }
        }
        if (k == 0) {
            VerifiedHash.push(verifyStat(_docHash, false));
        }
    }

    // function documentPush(string memory _docName) public {
    //     uint k = 0;
    //     for (uint256 i = 0; i < userData[msg.sender].length; i++) {
    //         if (keccak256(abi.encodePacked(userData[msg.sender][i].docName)) == keccak256(abi.encodePacked(_docName))) {
    //             for (uint256 j = 0; j < VerifiedHash.length; j++) {
    //                 if (VerifiedHash[j].hashValue == userData[msg.sender][i].docHash) {
    //                     k = 1;
    //                 }
    //             }
    //             if (k == 0) {
    //                 VerifiedHash.push(verifyStat(userData[msg.sender][i].docHash, false));
    //             }
    //         }
    //     }
    // }

    function hashArray(bytes32 _docHash) public {
        arrHash.push(_docHash);
    }

    function hashVerify(bytes32 _hash) public {
        for (uint256 i = 0; i < arrHash.length; i++) {
            if (arrHash[i] == _hash) {
                for (uint256 j = 0; j < VerifiedHash.length; j++) {
                    if (VerifiedHash[j].hashValue == _hash) {
                        VerifiedHash[j].status = true;
                    }
                }
            }
        }
    }

    function ownerValidate(string memory _username, address _address) public view returns (bool) {
        if (i_owner == _address) {
            return keccak256(abi.encodePacked(i_ownerName)) == keccak256(abi.encodePacked(_username));
        }
        return false;
    }

    function getVerifiedDocuments(address _address) public view returns (document[] memory) {
        document[] memory k = getArray(_address);
        document[] memory l = new document[](k.length);
        uint lIndex = 0;
        uint t = 0;
        for (uint i = 0; i < k.length; i++) {
            t = 0;
            for (uint j = 0; j < VerifiedHash.length; j++) {
                if (VerifiedHash[j].hashValue == k[i].docHash && VerifiedHash[j].status == true) {
                    t = 1;
                    break;
                }
            }
            if (t == 1) {
                l[lIndex] = k[i];
                lIndex++;
            }
        }
        assembly {
            mstore(l, lIndex)
        }
        return l;
    }

    function getNonVerifiedDocuments(address _address) public view returns (document[] memory) {
        document[] memory k = getArray(_address);
        document[] memory l = new document[](k.length);
        uint lIndex = 0;
        uint t;
        for (uint i = 0; i < k.length; i++) {
            t = 0;
            for (uint j = 0; j < VerifiedHash.length; j++) {
                if (VerifiedHash[j].hashValue == k[i].docHash && VerifiedHash[j].status == true) {
                    t = 1;
                }
            }
            if (t == 0) {
                l[lIndex] = k[i];
                lIndex++;
            }
        }
        assembly {
            mstore(l, lIndex)
        }
        return l;
    }

    function getToBeVerified() public view returns (bytes32[] memory) {
        bytes32[] memory l = new bytes32[](VerifiedHash.length);
        uint lIndex = 0;
        for (uint i = 0; i < VerifiedHash.length; i++) {
            if (!VerifiedHash[i].status) {
                l[lIndex] = VerifiedHash[i].hashValue;
                lIndex++;
            }
        }
        return l;
    }

    function getCandidate() public view returns (user[] memory) {
        return candidate;
    }

    function getRCandidate(address _address) public view returns (user memory) {
        for (uint256 i = 0; i < candidate.length; i++) {
            if (candidate[i].add == _address) {
                return candidate[i];
            }
        }
        return user('none',msg.sender,'none','none','0');
    }
    function getRbnCandidate(string memory _name) public view returns (user memory) {
        for (uint256 i = 0; i < candidate.length; i++) {
            if (keccak256(abi.encodePacked(candidate[i].name)) == keccak256(abi.encodePacked(_name))) {
                return candidate[i];
            }
        }
        return user('none',msg.sender,'none','none','0');
    }
    function getRRecruiter(address _address) public view returns (user2 memory) {
        for (uint256 i = 0; i < recruiter.length; i++) {
            if (recruiter[i].add == _address) {
                return recruiter[i];
            }
        }
        return user2('none',msg.sender,'none','none');
    }
    modifier ownerPower() {
        require(msg.sender == i_owner, "Only owner can call this function");
        _;
    }
}