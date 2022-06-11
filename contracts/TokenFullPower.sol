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
    uint8 public constant decimals = 3; //Default dos exemplos é sempre 18
    uint256 private totalsupply;
    Status contractState;

    mapping(address => uint256) private addressToBalance;

    // Events
    event Transfer(address sender, address receiver, uint256 amount);

    // Modifiers
    modifier isOwner() {
        require(msg.sender == owner, "Must be the owner");
        _;
    }

    modifier isActive() {
        require(contractState == Status.ACTIVE, "Contract is Paused");
        _;
    }

    //Constructor
    constructor(uint256 total) {
        totalsupply = total;
        addressToBalance[address(msg.sender)] = totalsupply;
        owner = msg.sender;
        contractState = Status.ACTIVE;
    }

    function state() public view returns(Status) {
        return contractState;
    }

    function whoIsOwner() public view returns(address) {
        return owner;
    }
    //Public Functions
    // Retornar o valor carregado
		// Ver se o total suply está na carteira do contrato
		// ao inicializar verificar se o status está ativo
		// checar se o onwer é a pessoa que criou o contrato
    function totalSupply() public view returns (uint256) {
        return totalsupply;
    }

    function balanceOf(address tokenOwner) public view returns (uint256) {
        return addressToBalance[tokenOwner];
    }

		// transferir somente como status ativo
		// transferir se tiver saldo
		// futuro ** verificar se o evento foi emitido caso dê certo
		// verificar se os balanços mudaram corretamente
		// verificar se não envia para uma carteira impossível ou inexistente
    function transfer(address receiver, uint256 quantity)
        public
        isActive
        returns (bool)
    {
        require(
            quantity <= addressToBalance[msg.sender],
            "Insufficient Balance to Transfer"
        );
        require(address(receiver) != address(0), "Account address can not be 0");
        addressToBalance[msg.sender] = addressToBalance[msg.sender] - quantity;
        addressToBalance[receiver] = addressToBalance[receiver] + quantity;

        emit Transfer(msg.sender, receiver, quantity);
        return true;
    }

		// transferir somente como status ativo
		// transferir se for owner
		// verificar se não envia para uma carteira impossível ou inexistente
		// verificar saldo da pessoa e do total suply após o mint
		// não mintar caso o amount seja 0
    function mint(address account, uint256 amount)
        public
        isOwner
        isActive
        returns (bool)
    {
        require(address(account) != address(0), "Account address can not be 0");
        require(amount > 0, "Amount has to be greater than 0");
        addressToBalance[account] += amount;
        totalsupply += amount;

        return true;
    }

		// queimar somente como status ativo
		// queimar se for owner
		// verificar se não envia para uma carteira impossível ou inexistente
		// não queimar caso o saldo da carteira não tenha saldo o bastante
    function burn(address account, uint256 amount)
        public
        isOwner
        isActive
        returns (bool)
    {
        require(address(account) != address(0), "Account address can not be 0");
        require(
            addressToBalance[account] >= amount,
            "Account does not have enough funds"
        );
        addressToBalance[account] -= amount;
        totalsupply -= amount;

        return true;
    }

		// pausar se for owner
		// não pausar caso o contrato já esteja pausado
		// verificar se o status é PAUSED
    function pausable() public isOwner returns (bool) {
        require(contractState == Status.ACTIVE, "Contract is already Paused");
        contractState = Status.PAUSED;
        return true;
    }


		// ativar se for owner
		// não ativar caso o contrato já esteja ativo
		// verificar se o status é ATIVO

    function activable() public isOwner returns (bool) {
        require(contractState == Status.PAUSED, "Contract is already Active");
        contractState = Status.ACTIVE;
        return true;
    }
}
