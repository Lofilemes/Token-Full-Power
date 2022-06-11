const { expect } = require("chai");
const { ethers } = require("hardhat");

// Retornar o valor carregado
// Ver se o total suply está na carteira do contrato
// ao inicializar verificar se o status está ativo
// checar se o onwer é a pessoa que criou o contrato

// transferir somente como status ativo
// transferir se tiver saldo
// futuro ** verificar se o evento foi emitido caso dê certo
// verificar se os balanços mudaram corretamente
// verificar se não envia para uma carteira impossível ou inexistente

// mintar somente como status ativo
// mintar se for owner
// verificar se não envia para uma carteira impossível ou inexistente
// verificar saldo da pessoa e do total suply após o mint
// não mintar caso o amount seja 0
// queimar somente como status ativo
// queimar se for owner
// verificar se não envia para uma carteira impossível ou inexistente
// não queimar caso o saldo da carteira não tenha saldo o bastante
// pausar se for owner
// não pausar caso o contrato já esteja pausado
// verificar se o status é PAUSED
// ativar se for owner
// não ativar caso o contrato já esteja ativo
// verificar se o status é ATIVO

describe("TokenFullPower", function () {

  let TFPower;
	let tFPower;
	let totalSupply;
	let owner;
	let accounts;

	beforeEach(async function() {
		[owner, ...accounts] = await ethers.getSigners()
		TFPower = await ethers.getContractFactory("TokenFullPower");
		tFPower = await TFPower.deploy(1000);
		await tFPower.deployed();
	})

  // it("Should return the new greeting once it's changed", async function () {
  //   expect(await tFPower.greet()).to.equal("Hello, world!");

  //   const setGreetingTx = await tFPower.setGreeting("Hola, mundo!");

  //   // wait until the transaction is mined
  //   await setGreetingTx.wait();

  //   expect(await tFPower.greet()).to.equal("Hola, mundo!");
  // });
});
