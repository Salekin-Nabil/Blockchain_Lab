// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Coursetro {
    string fName;
    uint age;
    address owner;

    event Instructor(
      string name,
      uint age
   );

   constructor() {   
        owner = msg.sender;
    }

    // Only the owner of the contract will call this function. 
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function setInstructor(string memory _fName, uint _age) onlyOwner public {
        fName = _fName;
        age = _age;
        emit Instructor(_fName, _age);
    }

    function getInstructor() public view returns(string memory, uint) {
        return (fName, age);
    }

}
