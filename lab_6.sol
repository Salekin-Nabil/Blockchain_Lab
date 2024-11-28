// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Coursetro {
    struct Instructor {
      uint age;
      string fName;
      string lName;
   }

    mapping (address => Instructor) instructors;
    address[] public instructorAccts;

    function setInstructor(address _address, uint _age, string memory _fName, string memory _lName) public {

        instructors[_address].age = _age;
        instructors[_address].fName = _fName;
        instructors[_address].lName = _lName;
        
        instructorAccts.push(_address);
    }

    // Return a list of addresses from instructorAccts    
   function getInstructors() view public returns(address[] memory) {
      return instructorAccts;
   }
   
   // Retrieve a specific instructor based on a provided address 
   function getInstructor(address _address) view public returns (uint, string memory, string memory) {
      return (instructors[_address].age, instructors[_address].fName, instructors[_address].lName);
   }

   // Count how many instructors    
   function countInstructors() view public returns (uint) {
      return instructorAccts.length;
   }

}
