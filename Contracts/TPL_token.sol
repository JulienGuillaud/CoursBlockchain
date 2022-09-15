// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TPL_token is ERC20{
    constructor() ERC20("TrashPlaceToken", "TPL"){
        _mint(msg.sender,10000*10**18);
    }
}