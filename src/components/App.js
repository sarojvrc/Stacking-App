import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import Tether_Token from '../build/Tether_Token.json';
import Dummy_Token from '../build/Dummy_Token.json';
import Staking_Dapp from '../build/Staking_Dapp.json';
import { Component } from 'react';
import Main from './Main';
import Navbar from './Navbar';

class App extends Component{
  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  //load all the smart contracts
  async loadBlockchainData(){
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})

    const networkId = await web3.eth.net.getId()

    //for tether token
    const TetherTokenData = Tether_Token.netwoks[networkId]
    if(TetherTokenData){
      const tetherToken = new web3.eth.Contract(Tether_Token.abi,TetherTokenData.address)
      this.setState({tetherToken})
      let tethertokenbalance = await tetherToken.methods.balance(this.state.account).call()
      this.setState({tethertokenbalance : tethertokenbalance.toString()})

    }else {
      window.alert('Tether token contract not deployed to detected network.')
    }

    //for dummy token
    const DummyTokenData = Dummy_Token.netwoks[networkId]
    if(DummyTokenData){
      const dummyToken = new web3.eth.Contract(Dummy_Token.abi,DummyTokenData.address)
      this.setState({dummyToken})
      let dummytokenbalance = await dummyToken.methods.balance(this.state.account).call()
      this.setState({dummytokenbalance : dummytokenbalance.toString()})

    }else {
      window.alert('Dummy token contract not deployed to detected network.')
    }

    //for staking daap 
    const StakingDappData = Staking_Dapp.netwoks[networkId]
    if(StakingDappData){
      const stakingDapp = new web3.eth.Contract(Staking_Dapp.abi,StakingDappData.address)
      this.setState({stakingDapp})
      let stakingdappbalance = await stakingDapp.methods.statkingBalance(this.state.account).call()
      this.setState({stakingdappbalance : stakingdappbalance.toString()})

    }else {
      window.alert('Staking Dapp contract not deployed to detected network.')
    }

    this.setState({ loading: false })
  }

  
  //load web3 to connect with MetaMask to daap
  async loadWeb3(){
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        console.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
  }


  //for staking token function
  stateTokens = (amount) => {
    this.setState({loading : true})
    this.state.tetherToken.methods.approve(this.state.stakingDapp.address, amount).send({from : this.state.account}).on('transactionHash',(hash) => {
      this.state.stakingDapp.methods.stateTokens(amount).send({from: this.state.account}).on('trasactionHash',(hash) => {
        this.setState({loading : false})
      })
    })
  }

  //for unstaking token function
  unstateTokens = (amount) => {
    this.setState({loading : true})
    this.state.stakingDapp.methods.unstakeTokens().send({from: this.state.account}).on('trasactionHash',(hash) => {
      this.setState({loading : false})
    })
  }

  //make a constructor to initialize the project
  constructor(props){
    super(props)
    this.state = {
      account : '0x0',
      tetherToken: {},
      dummyToken: {},
      tethertokenbalance: '0',
      dummytokenbalance: '0',
      stakingdappbalance: '0',
      loading: true
    }
  }

  render(){

    let content
    if(this.state.loading){
      content = <p id='loader' className="text-center">Loading...</p>
    } else{
      content = <Main
        tethertokenbalance = {this.state.tethertokenbalance}
        dummytokenbalance = {this.state.dummytokenbalance}
        stakingdappbalance = {this.state.stakingdappbalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens = {this.unstakeTokens}
      /> 
    }
    
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="https://www.blockchain-council.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

}

// function App1() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
