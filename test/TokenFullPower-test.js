const { expect } = require('chai');
const { ethers } = require('hardhat');

// ativar se for owner
// não ativar caso o contrato já esteja ativo
// verificar se o status é ATIVO

describe('Initializing', function () {
	let TFPower;
	let tFPower;
	let totalSupply;
	let owner;
	let accounts;
	const supplyDefault = 1000;

	beforeEach(async function () {
		[owner, ...accounts] = await ethers.getSigners();
		TFPower = await ethers.getContractFactory('TokenFullPower');
		tFPower = await TFPower.deploy(supplyDefault);
		await tFPower.deployed();
	});

	it('Should return the value passed on the builder as balance.', async function () {
		expect(await tFPower.balanceOf(owner.address)).to.equal(supplyDefault);
	});

	it('The initial status should be active', async function () {
		expect(await tFPower.state()).to.equal(1);
	});

	it('The entity that created the contract must be the owner', async function () {
		expect(await tFPower.whoIsOwner()).to.equal(owner.address);
	});
});

describe('Transfer', function () {
	let TFPower;
	let tFPower;
	let totalSupply;
	let owner;
	let accounts;
	const supplyDefault = 1000;
	const zeroWallet = '0x0000000000000000000000000000000000000000';

	beforeEach(async function () {
		[owner, ...accounts] = await ethers.getSigners();
		TFPower = await ethers.getContractFactory('TokenFullPower');
		tFPower = await TFPower.deploy(supplyDefault);
		await tFPower.deployed();
	});

	it('Should only transfer if status is active', async function () {
		const pausable = await tFPower.pausable();
		await pausable.wait();

		await expect(tFPower.transfer(accounts[0].address, 10)).to.be.revertedWith(
			'Contract is Paused'
		);
	});

	it('Should not be transferred if there is no balance in the wallet', async function () {
		await expect(
			tFPower.connect(accounts[0]).transfer(accounts[1].address, 10)
		).to.be.revertedWith('Insufficient Balance to Transfer');

		await expect(
			tFPower.connect(accounts[1]).transfer(accounts[2].address, 10)
		).to.be.revertedWith('Insufficient Balance to Transfer');

		await expect(
			tFPower.connect(accounts[2]).transfer(accounts[3].address, 10)
		).to.be.revertedWith('Insufficient Balance to Transfer');
	});

	it('Must transfer when there is a balance in wallet', async function () {
		const transfer1 = await tFPower.transfer(accounts[0].address, 10);
		await transfer1.wait();

		let currentBalance = supplyDefault;

		expect(await tFPower.balanceOf(accounts[0].address)).to.equal(10);
		currentBalance -= 10;
		expect(await tFPower.balanceOf(owner.address)).to.equal(currentBalance);

		const transfer2 = await tFPower.transfer(accounts[1].address, 10);
		await transfer2.wait();

		expect(await tFPower.balanceOf(accounts[1].address)).to.equal(10);
		currentBalance -= 10;
		expect(await tFPower.balanceOf(owner.address)).to.equal(currentBalance);
	});

	it('You should not send to a non-existent wallet', async function () {
		await expect(tFPower.transfer(zeroWallet, 10)).to.be.revertedWith(
			'Account address can not be 0'
		);
	});
});

describe('Mint', function () {
	let TFPower;
	let tFPower;
	let totalsupply;
	let owner;
	let accounts;
	const supplyDefault = 1000;
	const zeroWallet = '0x0000000000000000000000000000000000000000';

	beforeEach(async function () {
		[owner, ...accounts] = await ethers.getSigners();
		TFPower = await ethers.getContractFactory('TokenFullPower');
		tFPower = await TFPower.deploy(supplyDefault);
		await tFPower.deployed();
	});

	it('Should only minted if status is active', async function () {
		const pausable = await tFPower.pausable();
		await pausable.wait();

		await expect(tFPower.mint(accounts[0].address, 10)).to.be.revertedWith(
			'Contract is Paused'
		);
	});

	it('The minted value must be greater than 0', async function () {
		await expect(tFPower.mint(accounts[1].address, 0)).to.be.revertedWith(
			'Amount has to be greater than 0'
		);

		await expect(tFPower.mint(accounts[2].address, 0)).to.be.revertedWith(
			'Amount has to be greater than 0'
		);

		await expect(tFPower.mint(accounts[3].address, 0)).to.be.revertedWith(
			'Amount has to be greater than 0'
		);
	});

	it('Only the owner can mint tokens', async function () {
		await expect(tFPower.connect(accounts[0]).mint(accounts[1].address, 10)).to.be.revertedWith(
			'Must be the owner'
		);

		await expect(tFPower.connect(accounts[1]).mint(accounts[2].address, 10)).to.be.revertedWith(
			'Must be the owner'
		);

		await expect(tFPower.connect(accounts[2]).mint(accounts[3].address, 10)).to.be.revertedWith(
			'Must be the owner'
		);
	});

	it('Check totalSupply and wallets balance after mint', async function () {
		const transfer1 = await tFPower.mint(accounts[0].address, 10);
		await transfer1.wait();

		const oldSupply = supplyDefault;
		let totalsupply = supplyDefault;

		expect(await tFPower.balanceOf(accounts[0].address)).to.equal(10);
		totalsupply += 10;
		expect(await tFPower.balanceOf(owner.address)).to.equal(oldSupply);
		expect(await tFPower.totalSupply()).to.equal(totalsupply);

		const transfer2 = await tFPower.mint(accounts[1].address, 10);
		await transfer2.wait();

		expect(await tFPower.balanceOf(accounts[0].address)).to.equal(10);
		expect(await tFPower.balanceOf(accounts[1].address)).to.equal(10);
		totalsupply += 10;
		expect(await tFPower.balanceOf(owner.address)).to.equal(oldSupply);
		expect(await tFPower.totalSupply()).to.equal(totalsupply);
	});

	it('You should not send to a non-existent wallet', async function () {
		await expect(tFPower.mint(zeroWallet, 10)).to.be.revertedWith(
			'Account address can not be 0'
		);
	});
});

