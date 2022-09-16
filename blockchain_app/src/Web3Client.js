import Web3 from 'web3';
import { abi } from './contract_abi';


// let myAccount = (!!window && window.ethereum._state.accounts != null) ? window.ethereum._state.accounts[0] : null;
let myAccount;
let contract;

export const initWeb3 = (_setConnectButtonState) => {
   let provider = window.ethereum;

   if (typeof provider !== 'undefined') {
      _setConnectButtonState((previousState) => {
         return {...previousState, text: "Connecting...", style: {color:"#444"}}
      });
      provider.request({ method: 'eth_requestAccounts' }).then(accounts => {
         _setConnectButtonState((previousState) => {
            return {...previousState, text: "Connected", style: {color:"rgb(0 170 11)"}}
         });
         if(!isNaN(accounts)){
            myAccount = accounts[0];
         }
      }).catch(err => {
         _setConnectButtonState((previousState) => {
            return {...previousState, text: "Connect wallet", style: {color:"#444"}}
         });
         console.error(err);
      })
   }
   window.ethereum.on('accountsChanged', (accounts) => {
      myAccount = accounts[0];
      console.log("Account is now : ", myAccount);
   });
   const web3 = new Web3(provider)
   // const networkId = web3.eth.net.getId();
   contract = new web3.eth.Contract(abi, "0x469247301473aB9936Aca13bDA50a806344787E0");

};

// function checkIfConnectedOrSessionSaved(){
//    if(!myAccount || myAccount === null || myAccount === undefined || myAccount === ""){
//       if(!isNaN(window.ethereum._state.accounts[0])){
//          myAccount = window.ethereum._state.accounts[0];
//          return true;
//       }else{
//          return false;
//       }
//    }else{
//       return true
//    }
// }

export const getMyPixels = async () => {
   console.log("My account is: ", myAccount);
   console.log("Contract is: ", contract);
   return await contract.methods.getPixelsByOwner(myAccount).call({from: myAccount}).then((res) => {
      console.log("Res : ",res);
      return res;
   })
}

export const searchPixels = async (address) => {
   console.log("Search : ", address);
   return await contract.methods.getPixelsByOwner(address).call({from: myAccount}).then((res) => {
      console.log("Res : ",res);
      return res;
   })
}

