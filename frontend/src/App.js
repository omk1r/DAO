import { Button, Container, Form, Table } from "react-bootstrap";
import "./App.css";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";
import Web3 from "web3";

function App() {
  const [user, setUser] = useState("");
  const [contract, setContract] = useState();
  const [connected, setConnected] = useState(false);
  const [proposalAmount, setProposalAmount] = useState("");
  const [proposalAddress, setProposalAddress] = useState("");
  const [proposals, setProposals] = useState([]);
  const contractAddress = "0x7e1868e9Fc46f6Ec7131987f0e33C19A6593c403";

  let provider = typeof window !== "undefined" && window.ethereum;

  const connect = async () => {
    try {
      if (!provider) return alert("Please install Metamask");
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length) {
        setUser(accounts[0]);
        setConnected(true);
      }
    } catch (error) {
      alert(error);
    }
  };

  const getContract = async () => {
    try {
      const web3 = new Web3(provider);
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      setContract(contract);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchProposal = async () => {
      if (contract) {
        const count = await contract.methods.proposalCount().call();
        const fetchedProposals = [];
        for (let i = 1; i <= count; i++) {
          const proposal = await contract.methods.proposals(i).call();
          fetchedProposals.push(proposal);
        }
        setProposals(fetchedProposals);
        console.log(fetchedProposals);
        console.log(count);
      }
    };

    fetchProposal();
  }, [contract]);

  useEffect(() => {
    getContract();
  }, []);

  const createProposal = async (e) => {
    try {
      const web3 = new Web3(provider);
      const amount = web3.utils.toWei(proposalAmount.toString(), "ether");
      await contract.methods
        .createProposal(amount, proposalAddress)
        .send({ from: user, value: web3.utils.toWei("10", "wei") });
      setProposalAmount(0);
      setProposalAddress("");
      refreshProposals();
    } catch (error) {
      console.log(error);
    }
  };

  const handleMember = async () => {
    const web3 = new Web3(provider);
    const gasPrice = await web3.eth.getGasPrice();
    const amountInWei = web3.utils.toWei("10", "wei");
    await contract.methods.becomeMember().send({
      from: user,
      value: amountInWei,
      gasPrice: gasPrice,
    });
  };

  const handleVote = async (proposalId, vote) => {
    if (user) {
      await contract.methods
        .voteOnProposal(proposalId, vote)
        .send({ from: user });
    }
    refreshProposals();
  };

  const handleExecute = async (proposalId) => {
    await contract.methods.executeProposal(proposalId).send({
      from: user,
    });
    refreshProposals();
  };

  const refreshProposals = async () => {
    const count = await contract.methods.proposalCount().call();
    const fetchedProposals = [];
    for (let i = 1; i <= count; i++) {
      const proposal = await contract.methods.proposals(i).call();
      fetchedProposals.push(proposal);
    }
    setProposals(fetchedProposals);
  };

  return (
    <>
      <Container>
        <h1 className="text-center">DAO</h1>
        <div className="connect-button">
          <Button onClick={() => connect()}>
            {connected ? user.slice(0, 4) + "..." + user.slice(38) : "Connect"}
          </Button>
        </div>

        <div className="create-proposal">
          <h3>Create Proposal</h3>
          <Form
            onSubmit={(e) => {
              e.preventDefault(); // Prevents the default form submission behavior
              createProposal(); // Call the createProposal function directly
            }}
          >
            <Form.Group>
              <Form.Label>Amount (ETH)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={proposalAmount}
                onChange={(e) => setProposalAmount(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={proposalAddress}
                onChange={(e) => setProposalAddress(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="submitbtn">
              Create proposal
            </Button>
          </Form>
        </div>

        <div className="member-button">
          <Button variant="secondary" onClick={() => handleMember()}>
            Become A Member
          </Button>
        </div>
        <p>(Only members can create or vote on proposals)</p>
        <div className="ongoing-proposal">
          <h3>Ongoing Proposal</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Creator</th>
                <th>Amount</th>
                <th>Send To</th>
                <th>Total Yes Votes</th>
                <th>Total No Votes</th>
                <th>End Time</th>
                <th>Executed</th>
                <th>Vote</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal) => (
                <tr key={proposal.id}>
                  <td>{proposal.id.toString()}</td>
                  <td>{proposal.creator}</td>
                  <td>
                    {Web3.utils
                      .fromWei(proposal.amount.toString(), "ether")
                      .toString()}
                  </td>
                  <td>{proposal.sendTo}</td>
                  <td>{proposal.totalYesVotes.toString()}</td>
                  <td>{proposal.totalNoVotes.toString()}</td>
                  <td>
                    {new Date(Number(proposal.endTime) * 1000).toLocaleString()}
                  </td>

                  <td>{proposal.executed ? "Yes" : "No"}</td>
                  <td>
                    <Button
                      variant="success"
                      disabled={proposal.executed}
                      onClick={() => handleVote(proposal.id, true)}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="danger"
                      disabled={proposal.executed}
                      onClick={() => handleVote(proposal.id, false)}
                    >
                      No
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="success"
                      disabled={proposal.executed}
                      onClick={() => handleExecute(proposal.id)}
                    >
                      Execute
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  );
}

export default App;
