const GettingStarted = () => {
  return (
    <>
      <h1>Getting Started</h1>
      <p className="gray-text">
        Documentation for how to use ctrlX, the protocol for real-time finance.
      </p>
      {/* <p>
        This is a technical account on how to integrate Sablier into your own
        application. If you have questions, please join the #development channel
        in the Sablier Discord server; our team, and members of the community,
        look forward to helping you.
      </p>
      <p>What we will cover:</p>
      <ol>
        <li>Smart contract architecture and ABI</li>
        <li>Networks and typical gas costs </li>
        <li>How to create, withdraw from and cancel streams </li>
        <li>
          How to create, withdraw from and cancel {'"'}compounding{'"'} streams
        </li>
      </ol> */}

      <h2>Codebase</h2>
      <p>
        The ctrlX protocol codebase is hosted on <a>GitHub</a> and the source
        code for each contract is verified on the blockchain brower.
      </p>

      <h2>Minimal Architecture</h2>
      <p>
        We designed the protocol with simplicity in mind: one monolith smart
        contract that adheres to the{" "}
        <a href="https://eips.ethereum.org/EIPS/eip-1620" target="blank">
          ERC-1620
        </a>{" "}
        standard.
      </p>

      <h2>Application Binary Interface</h2>
      <p>
        Depending on what web3 library you{"'"}re using, you may need to get
        hold of the ctrlX ABI (Application Binary Interface). The ABI acts as an
        interface between two program modules, one of which is the smart
        contract and the other the machine code.
      </p>

      {/* <p>There are two ways to obtain it:</p> */}
      {/* <ol>
        <li>
          Copy Sablier.json from <a>sablierhq/sablier-abis​</a>
        </li>
        <li>
          Clone <a>sablierhq/sablier</a> and compile the contract yourself
        </li>
      </ol> */}
      <h2>Networks</h2>
      <p>
        ctrlX wroks on the Polygon blockchain network (under construction)
        {/* Depending on what blockchain network you want to use ctrlX with you will
        need a specific contract address. */}
      </p>
    </>
  );
};

export default GettingStarted;
