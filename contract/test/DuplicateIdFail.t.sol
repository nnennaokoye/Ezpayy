// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/Ezpay.sol";

contract DuplicateIdFailTest is Test {
    Ezpay public ezpay;
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        ezpay = new Ezpay();
    }

    function testCannotCreateDuplicateBillSameUser() public {
        vm.startPrank(user1);
        
        bytes32 billId = keccak256(abi.encodePacked(user1, uint256(1)));
        
        // First creation should succeed
        ezpay.createBill(billId, address(0), 1 ether);
        
        // Second creation with same ID should fail
        vm.expectRevert(Ezpay.BillAlreadyExists.selector);
        ezpay.createBill(billId, address(0), 2 ether);
        
        vm.stopPrank();
    }

    function testCannotCreateDuplicateBillDifferentUsers() public {
        bytes32 billId = keccak256(abi.encodePacked("shared", uint256(1)));
        
        // User1 creates bill
        vm.prank(user1);
        ezpay.createBill(billId, address(0), 1 ether);
        
        // User2 tries to create bill with same ID - should fail
        vm.prank(user2);
        vm.expectRevert(Ezpay.BillAlreadyExists.selector);
        ezpay.createBill(billId, address(0), 2 ether);
    }

    function testCannotCreateDuplicateWithDifferentTokens() public {
        vm.startPrank(user1);
        
        bytes32 billId = keccak256(abi.encodePacked(user1, uint256(1)));
        address tokenAddress = address(0x123);
        
        // Create ETH bill
        ezpay.createBill(billId, address(0), 1 ether);
        
        // Try to create ERC20 bill with same ID
        vm.expectRevert(Ezpay.BillAlreadyExists.selector);
        ezpay.createBill(billId, tokenAddress, 100 ether);
        
        vm.stopPrank();
    }

    function testCannotCreateDuplicateWithDifferentAmounts() public {
        vm.startPrank(user1);
        
        bytes32 billId = keccak256(abi.encodePacked(user1, uint256(1)));
        
        // Create bill with 1 ETH
        ezpay.createBill(billId, address(0), 1 ether);
        
        // Try to create bill with same ID but different amount
        vm.expectRevert(Ezpay.BillAlreadyExists.selector);
        ezpay.createBill(billId, address(0), 2 ether);
        
        vm.stopPrank();
    }

    function testCannotCreateZeroAmountBill() public {
        vm.startPrank(user1);
        
        bytes32 billId = keccak256(abi.encodePacked(user1, uint256(1)));
        
        // Try to create bill with zero amount
        vm.expectRevert(Ezpay.InvalidAmount.selector);
        ezpay.createBill(billId, address(0), 0);
        
        vm.stopPrank();
    }

    function testCanCreateAfterFirstBillIsPaid() public {
        vm.startPrank(user1);
        
        bytes32 billId = keccak256(abi.encodePacked(user1, uint256(1)));
        
        // Create first bill
        ezpay.createBill(billId, address(0), 1 ether);
        
        vm.stopPrank();
        
        // Different user pays the bill
        vm.deal(user2, 2 ether);
        vm.prank(user2);
        ezpay.payBill{value: 1 ether}(billId);
        
        // Original user tries to create bill with same ID again - should still fail
        vm.prank(user1);
        vm.expectRevert(Ezpay.BillAlreadyExists.selector);
        ezpay.createBill(billId, address(0), 1 ether);
    }

    function testUniqueIdsWithSameParameters() public {
        vm.startPrank(user1);
        
        // Create bills with different nonces
        bytes32 billId1 = keccak256(abi.encodePacked(user1, uint256(1)));
        bytes32 billId2 = keccak256(abi.encodePacked(user1, uint256(2)));
        
        // Both should succeed since IDs are different
        ezpay.createBill(billId1, address(0), 1 ether);
        ezpay.createBill(billId2, address(0), 1 ether);
        
        assertEq(ezpay.totalBills(), 2);
        
        vm.stopPrank();
    }

    function testStatePersistsAfterFailedCreation() public {
        vm.startPrank(user1);
        
        bytes32 billId = keccak256(abi.encodePacked(user1, uint256(1)));
        
        // Create first bill
        ezpay.createBill(billId, address(0), 1 ether);
        uint256 totalBillsBefore = ezpay.totalBills();
        
        // Try to create duplicate
        vm.expectRevert(Ezpay.BillAlreadyExists.selector);
        ezpay.createBill(billId, address(0), 2 ether);
        
        // State should remain unchanged
        assertEq(ezpay.totalBills(), totalBillsBefore);
        
        Ezpay.Bill memory bill = ezpay.getBill(billId);
        assertEq(bill.amount, 1 ether); // Original amount preserved
        
        vm.stopPrank();
    }
} 