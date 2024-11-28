// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Coursetro {
    string fName;
    uint age;

    constructor() {
      fName= 'Gary';
      age = 34;
   }

    function setInstructor(string memory _fName, uint _age) public {
        fName = _fName;
        age = _age;
    }

    function getInstructor() public view returns(string memory, uint) {
        return (fName, age);
    }

}
