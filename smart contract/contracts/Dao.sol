// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DAO {
    struct Proposal {
        uint256 id;
        address creator;
        uint256 amount;
        address payable sendTo;
        uint256 totalYesVotes;
        uint256 totalNoVotes;
        uint256 endTime;
        bool executed;
    }

    uint256 public proposalCount;
    mapping(address => bool) public members;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public voted;

    event ProposalCreated(uint256 id, uint256 amount, address payable sendTo);
    event VotedProposal(uint256 proposalId, bool vote);
    event ProposalExecuted(uint256 proposalId, uint256 amount, address payable sendTo);

    modifier onlyMember() {
        require(members[msg.sender], "Only members can call this function");
        _;
    }

    modifier proposalExists(uint256 proposalId) {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        _;
    }

    modifier proposalNotExecuted(uint256 proposalId) {
        require(!proposals[proposalId].executed, "Proposal has already been executed");
        _;
    }

    function becomeMember() public payable {
        require(msg.value >= 10 wei, "You have to send at least 10 wei");
        require(!members[msg.sender], "You are already a member");
        members[msg.sender] = true;
    }

    function createProposal(uint256 amount, address payable sendTo) public payable onlyMember {
        require(msg.value >= 10 wei, "You need to send 10 wei to create a proposal");
        uint256 proposalId = proposalCount + 1;
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.creator = msg.sender;
        proposal.amount = amount;
        proposal.sendTo = sendTo;
        proposal.endTime = block.timestamp + 2 minutes;
        proposalCount++;
        emit ProposalCreated(proposalId, amount, sendTo);
    }

    function voteOnProposal(uint256 proposalId, bool vote) public onlyMember proposalExists(proposalId) {
        require(!voted[msg.sender][proposalId], "You have already voted");
        require(proposals[proposalId].endTime >= block.timestamp, "Voting has ended for this proposal");

        voted[msg.sender][proposalId] = true;
        Proposal storage proposal = proposals[proposalId];
        if (vote) {
            proposal.totalYesVotes += 1;
        } else {
            proposal.totalNoVotes += 1;
        }
        emit VotedProposal(proposalId, vote);
    }

    function executeProposal(uint256 proposalId)
        public
        onlyMember
        proposalExists(proposalId)
        proposalNotExecuted(proposalId)
    {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.endTime <= block.timestamp, "Voting for this proposal has not ended yet");
        require(proposal.totalYesVotes > proposal.totalNoVotes, "More members voted against the proposal");
        require(proposal.amount <= address(this).balance, "Contract does not have enough balance");

        proposal.executed = true;
        address payable receiver = proposal.sendTo;
        receiver.transfer(proposal.amount);

        emit ProposalExecuted(proposalId, proposal.amount, proposal.sendTo);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
