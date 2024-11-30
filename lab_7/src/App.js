import React, { useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [events, setEvents] = useState([]);
  const [instructorCount, setInstructorCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inserted, setInserted] = useState(false);

  // Replace with your contract's ABI and address
  const ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes16",
          "name": "fName",
          "type": "bytes16"
        },
        {
          "indexed": false,
          "internalType": "bytes16",
          "name": "lName",
          "type": "bytes16"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "age",
          "type": "uint256"
        }
      ],
      "name": "InstructorInfo",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_age",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_fName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_lName",
          "type": "string"
        }
      ],
      "name": "setInstructor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "countInstructors",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "getInstructor",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "bytes16",
          "name": "",
          "type": "bytes16"
        },
        {
          "internalType": "bytes16",
          "name": "",
          "type": "bytes16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getInstructors",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "instructorAccts",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "instructors",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "age",
          "type": "uint256"
        },
        {
          "internalType": "bytes16",
          "name": "fName",
          "type": "bytes16"
        },
        {
          "internalType": "bytes16",
          "name": "lName",
          "type": "bytes16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  const contractAddress = '0xc053A84238a0c178aD781b56ACef94B69B45c3d1';

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          setAccount(accounts[0]);
        })
        .catch((err) => {
          console.error('Error fetching accounts:', err);
        });

      const contractInstance = new web3Instance.eth.Contract(ABI, contractAddress);
      setContract(contractInstance);

      // Fetch instructor count
      contractInstance.methods
        .countInstructors()
        .call()
        .then((count) => {
          console.log("Count: ", count.toString());
          setInstructorCount(count.toString());
        })
        .catch((err) => {
          console.error('Error fetching instructor count:', err);
        });

      // Fetch past events
      contractInstance.getPastEvents('InstructorInfo', {
        fromBlock: 0,
        toBlock: 'latest',
      })
        .then((fetchedEvents) => {
          const parsedEvents = fetchedEvents.map((event) => ({
            fName: web3Instance.utils.hexToAscii(event.returnValues.fName).replace(/\u0000/g, '').trim(),
            lName: web3Instance.utils.hexToAscii(event.returnValues.lName).replace(/\u0000/g, '').trim(),
            age: event.returnValues.age,
            blockHash: event.blockHash,
          }));
          setInserted(false);
          console.log("Event: ", parsedEvents);
          setEvents(parsedEvents);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching events:', err);
          setLoading(false);
        });
      
    } else {
      console.error('MetaMask not detected. Please install MetaMask!');
    }
    
  }, [inserted]);

  const handleUpdateInstructor = (event) => {
    event.preventDefault();
    const fName = event.target.fName.value;
    const lName = event.target.lName.value;
    const age = event.target.age.value;

    if (!contract || !account) {
      console.error('Contract or account is not initialized');
      return;
    }

    setLoading(true);

    contract.methods
      .setInstructor(account, age, fName, lName)
      .send({ from: account })
      .then((receipt) => {
        setInserted(true);
        console.log('Transaction successful:', receipt);
        alert('Instructor updated successfully!');
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error during transaction:', err);
        alert('Transaction failed. See console for details.');
        setLoading(false);
      });
  };

  return (
    <div className="body">
      <div className="container">
        <h1>Coursetro Instructor</h1>
        <h3>There are {instructorCount} Instructors</h3>
        <h2>Instructor Info</h2>
      {loading ? (
        <img src="https://cdn.pixabay.com/animation/2023/10/08/03/19/03-19-26-213_256.gif" alt="Loading..." />
      ) : (
        events.map((event, index) => (
          <div key={index}>
            <p>{`${event.fName} ${event.lName} (${event.age} years old)`}</p>
            <p>{`Block Hash: ${event.blockHash}`}</p>
          </div>
        ))
      )}
        
        <form onSubmit={handleUpdateInstructor}>
          <div>
          <label htmlFor="fName">First Name</label>
          <input id="fName" name="fName" type="text" required />
          </div>
          <div>
          <label htmlFor="lName">Last Name</label>
          <input id="lName" name="lName" type="text" required />
          </div>
          <div>
          <label htmlFor="age">Instructor Age</label>
          <input id="age" name="age" type="number" required />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Instructor'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
