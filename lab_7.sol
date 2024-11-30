// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Base Contract
contract Owned {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }
}

// Derived Contract
contract Courses is Owned {
    struct Instructor {
        uint age;
        bytes16 fName; // First name stored as bytes16
        bytes16 lName; // Last name stored as bytes16
    }

    // Mapping Instructor struct to an Ethereum address.
    mapping(address => Instructor) public instructors;
    address[] public instructorAccts;

    event InstructorInfo(
        bytes16 fName,
        bytes16 lName,
        uint age
    );

    /// Set instructor details
    /// @param _address Address of the instructor
    /// @param _age Age of the instructor
    /// @param _fName First name of the instructor (string)
    /// @param _lName Last name of the instructor (string)
    function setInstructor(
        address _address,
        uint _age,
        string memory _fName,
        string memory _lName
    ) public onlyOwner {
        // Convert strings to bytes16
        bytes16 fNameBytes = stringToBytes16(_fName);
        bytes16 lNameBytes = stringToBytes16(_lName);

        // Update or create the instructor details
        instructors[_address] = Instructor({
            age: _age,
            fName: fNameBytes,
            lName: lNameBytes
        });

        // Add the address to the list if it's a new instructor
        if (!_addressExists(_address)) {
            instructorAccts.push(_address);
        }

        emit InstructorInfo(fNameBytes, lNameBytes, _age);
    }

    /// Return a list of addresses from instructorAccts
    function getInstructors() public view returns (address[] memory) {
        return instructorAccts;
    }

    /// Retrieve a specific instructor based on a provided address
    function getInstructor(address _address)
        public
        view
        returns (uint, bytes16, bytes16)
    {
        Instructor memory instructor = instructors[_address];
        return (instructor.age, instructor.fName, instructor.lName);
    }

    /// Count how many instructors
    function countInstructors() public view returns (uint) {
        return instructorAccts.length;
    }

    /// Check if an address already exists in the instructorAccts array
    function _addressExists(address _address) internal view returns (bool) {
        for (uint i = 0; i < instructorAccts.length; i++) {
            if (instructorAccts[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function stringToBytes16(string memory source) internal pure returns (bytes16 result) {
    bytes memory tempBytes = bytes(source);
    require(tempBytes.length <= 16, "String is too long for bytes16");

    for (uint i = 0; i < tempBytes.length; i++) {
        result |= bytes16(tempBytes[i] & 0xFF) >> (i * 8);
    }
}

}
