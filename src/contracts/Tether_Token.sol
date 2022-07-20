//SPDX_License-Identifier: UNLICENSED

pragma solidity >=0.4.22 <0.9.0;  //version of the solidity

contract Tether_Token{

    string public name = "dummy Tether token";
    string public sysbol = "Tether";
    uint public totalsupply = 1000000000000000000000000; //10 million tokens plus 10**18 because of weig
    uint public decimal = 18;

    //event to transfer a token
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    );

    //event for approve
    event Approve(
        address indexed _owner,
        address indexed _spender,
        uint _value
    );

    //create a mapping 
    mapping(address => uint256) public balance;
    mapping(address => mapping(address => uint256)) public allowance;

    //create a constructor for balance
    constructor() public{
        balance[msg.sender] = totalsupply;
    }

    //create a function to transfer the balance
    function transfer(address _to, uint _value) public returns(bool success){
        require(balance[msg.sender] >= _value);
        balance[msg.sender] -= _value;
        balance[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    //function to approve
    function approve(address _spender, uint256 _value) public returns(bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approve(msg.sender, _spender, _value);
        return true;
    }

    //create function for transfer from
    function transferfrom(address _from, address _to, uint256 _value) public returns(bool success){
        require(_value <= balance[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balance[_from] -= _value;
        balance[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

}