// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NikoSell is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    AggregatorV3Interface internal immutable maticPriceFeed;
    AggregatorV3Interface internal immutable bnbPriceFeed;

    IERC20 public NKO;
    uint256 public nkoPrice = 1e18;

    constructor(
        address _maticPriceFeed,
        address _bnbPriceFeed,
        address _nkoAddress
    ) {
        maticPriceFeed = AggregatorV3Interface(_maticPriceFeed);
        bnbPriceFeed = AggregatorV3Interface(_bnbPriceFeed);

        NKO = IERC20(_nkoAddress);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function updateNikoPrice(uint256 amount) external onlyRole(ADMIN_ROLE) {
        nkoPrice = amount;
    }

    function fundNiko(uint256 amount) external {
        NKO.safeTransferFrom(msg.sender, address(this), amount);
    }

    function retreiveNiko(uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(
            NKO.balanceOf(address(this)) >= amount,
            "Insuffient NKO balance for amount requested"
        );
        NKO.safeTransfer(msg.sender, amount);
    }

    function withdrawBalance(uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(
            address(this).balance >= amount,
            "Insuffient balance for amount requested"
        );

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send ETH");
    }

    function withdrawTokens(
        uint256 amount,
        address tokenAddress
    ) external onlyRole(ADMIN_ROLE) {
        IERC20 token = IERC20(tokenAddress);
        require(
            token.balanceOf(address(this)) >= amount,
            "Insuffient balance for amount requested"
        );
        token.safeTransfer(msg.sender, amount);
    }

    function buyNikoWithMatic(
        uint256 buyAmount
    ) external payable nonReentrant returns (bool) {
        uint256 matic = getMaticLatestPrice();
        uint256 cost = (buyAmount * ((nkoPrice * 1e18) / matic)) / 1e18;
        require(msg.value >= cost, "Sent insufficient MATIC");
        (bool sent, ) = address(this).call{value: cost}("");
        require(sent, "Failed to send ETH");
        NKO.safeTransfer(msg.sender, buyAmount);
        console.log("Buying: ", buyAmount, " Niko Tokens");
        console.log("Paying: ", cost, " MATIC");
        if (msg.value - cost > 0) {
            (bool sentBack, ) = msg.sender.call{value: msg.value - cost}("");
            require(sentBack, "Failed to send back remaining MATIC");
        }
        return sent;
    }

    function buyNikoWithBNB(uint256 buyAmount) external payable nonReentrant {
        uint256 bnbusd = getBNBLatestPrice();
        uint256 cost = (buyAmount * ((nkoPrice * 1e18) / bnbusd)) / 1e18;
        console.log("Buying: ", buyAmount, " Niko Tokens");
        console.log("Paying ", cost, " BNB");

        IERC20(0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3).safeTransferFrom(
            msg.sender,
            address(this),
            cost
        );
        NKO.safeTransfer(msg.sender, buyAmount);
    }

    function buyNikoWithDAI(uint256 buyAmount) external payable nonReentrant {
        uint256 cost = (buyAmount * nkoPrice) / 1e18;

        IERC20(0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063).safeTransferFrom(
            msg.sender,
            address(this),
            cost
        );
        NKO.safeTransfer(msg.sender, buyAmount);
    }

    function buyNikoWithBUSD(uint256 buyAmount) external payable nonReentrant {
        uint256 cost = (buyAmount * nkoPrice) / 1e18;

        IERC20(0xdAb529f40E671A1D4bF91361c21bf9f0C9712ab7).safeTransferFrom(
            msg.sender,
            address(this),
            cost
        );
        NKO.safeTransfer(msg.sender, buyAmount);
    }

    function getMaticLatestPrice() public view returns (uint256) {
        (, int256 price, , , ) = maticPriceFeed.latestRoundData();
        uint256 maticBased = uint256(price) * 1e10;
        return maticBased;
    }

    function getBNBLatestPrice() public view returns (uint256) {
        (, int256 price, , , ) = bnbPriceFeed.latestRoundData();
        uint256 bnbBased = uint256(price) * 1e10;
        return bnbBased;
    }

    receive() external payable {}

    fallback() external payable {}
}
