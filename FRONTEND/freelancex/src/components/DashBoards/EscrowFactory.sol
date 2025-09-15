// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Escrow.sol";

contract EscrowFactory {
    address[] public allEscrows;

    event EscrowCreated(address indexed escrowAddress, address indexed client, address indexed freelancer);

    function createEscrow(address client, address freelancer) external returns (address) {
        Escrow escrow = new Escrow(client, freelancer);
        allEscrows.push(address(escrow));
        emit EscrowCreated(address(escrow), client, freelancer);
        return address(escrow);
    }

    function getAllEscrows() external view returns (address[] memory) {
        return allEscrows;
    }
}
