//SPDX_License-Identifier: UNLICENSED

pragma solidity >=0.4.22 <0.9.0;  //version of the solidity

import "./Dummy_Token.sol";
import "./Tether_Token.sol";

contract Staking_Dapp{

    string public name = "Staking Dapp";
    address public owner;
    Dummy_Token public dummy_token; //instance from imported file
    Tether_Token public tether_token;

    address[] public stakers;
    mapping (address=>uint) public statkingBalance;
    mapping(address => bool) public hasstaked;
    mapping(address => bool) public isstaking;

    constructor(Dummy_Token _dummyToken, Tether_Token _tetherToken) public{
        dummy_token = _dummyToken;
        tether_token = _tetherToken;
        owner = msg.sender;
    }

    //function for staking the tokens
    function stakeToken(uint _amount) public{
        require(_amount > 0, "Amount can not be zero");
        tether_token.transferfrom(msg.sender, address(this), _amount);
        statkingBalance[msg.sender] = statkingBalance[msg.sender] + _amount;

        if(!hasstaked[msg.sender]){
            stakers.push(msg.sender);
        }

        isstaking[msg.sender] = true;
        hasstaked[msg.sender] = true;
    }

    //function for unstaking the tokens
    function unstakeTokens() public{
        uint balance = statkingBalance[msg.sender]; //balance fetched into a variable
        require(balance >0, "staking balance is zero"); //we check if balance zero or not
        tether_token.transfer(msg.sender, balance); //transfered the balance to user
        statkingBalance[msg.sender] = 0; // set the balance to zero
        isstaking[msg.sender] = false; //updated the staking status
    }

    //function for issuing tokens
    function issuedommy() public{
        require(msg.sender == owner, "Caller of the function must be the owner");
        for(uint i=0; i<stakers.length; i++){
            address recipient = stakers[i];
            uint balance = statkingBalance[recipient];
            if(balance > 0){
                dummy_token.transfer(recipient, balance);
            }
        }
    }

}