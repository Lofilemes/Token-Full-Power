//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

contract TokenFullPower {
	//Enums
	enum Status {
		PAUSED,
        ACTIVE
    } 

	//Properties
	address private owner;
    string public constant name = "TokenFullPower";
    string public constant symbol = "TFP";
    uint8 public constant decimals = 3;  //Default dos exemplos é sempre 18
    uint256 private totalsupply;
	Status contractState;

    mapping(address => uint256) private addressToBalance;

    // Events
    event Transfer(address sender, address receiver, uint256 amount);
 
	// Modifiers
    modifier isOwner {
		require(msg.sender == owner);
	_;
	}

	modifier isActive {
		require(contractState == Status.ACTIVE, "Contract is Paused");
	_;
	}

	//Constructor
    constructor(uint256 total) {
        totalsupply = total;
        addressToBalance[address(this)] = totalsupply;
		owner = msg.sender;
		contractState = Status.ACTIVE;
    }

    //Public Functions
    function totalSupply() public view returns(uint256) {
        return totalsupply;
    }

    function balanceOf(address tokenOwner) public view returns(uint256) {
        return addressToBalance[tokenOwner];
    }

    function transfer(address receiver, uint256 quantity) public isActive returns(bool) {
        require(quantity <= addressToBalance[msg.sender], "Insufficient Balance to Transfer");
        addressToBalance[msg.sender] = addressToBalance[msg.sender] - quantity;
        addressToBalance[receiver] = addressToBalance[receiver] + quantity;

        emit Transfer(msg.sender, receiver, quantity);
        return true;
	}

	function mint(address account, uint256 amount) public isOwner isActive returns(bool) {
		require(address(account) != address(0), "Account address can not be 0");
		require(amount > 0, "Amount has to be greater than 0");
		addressToBalance[account] += amount;
		totalsupply += amount;

		return true;
	}

	function burn(address account, uint256 amount) public isOwner isActive returns(bool) {
		require(address(account) != address(0), "Account address can not be 0");
		require(addressToBalance[account] >= amount, "Account does not have enough funds");
		addressToBalance[account] -= amount;
		totalsupply -= amount;

		return true;
	}

	function pausable() public isOwner returns(bool){
		require(contractState == Status.ACTIVE, "Contract is already Paused");
		contractState = Status.PAUSED;
		return true;
	}

	function activate() public isOwner returns(bool){
		require(contractState == Status.PAUSED, "Contract is already Active");
		contractState = Status.ACTIVE;
		return true;
	}
}