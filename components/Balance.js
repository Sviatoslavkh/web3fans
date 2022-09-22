import React, { useState, useEffect } from 'react';
import { useMoralis, useChain, useWeb3Contract, useWeb3ExecuteFunction} from "react-moralis"
import sign from 'functions/sign'
import mainContract from 'constants/Main.json'
import {Moralis} from 'moralis'
import Withdraw from './Withdraw';





export default function Balance(props) {
  
    const [loading, setLoaded] = useState(true);
    const [first, setfirst] = useState(true);
    const [balance, setBalance] = useState(null);
    const contractABI = mainContract.abi
    const contractAddress = mainContract.address
    const { isAuthenticated, chainId, isWeb3Enabled, enableWeb3, account, user, isLoggingOut } = useMoralis()
    const { data, error, runContractFunction, isFetching, isLoading } = useWeb3Contract();

    function resetbalance(){
      setBalance(null)
      props.showTransactionModal(false)
      setfirst(true)
    }

    useEffect( () => {
      
      setLoaded(false)
  
      if(!loading){
         if(!isWeb3Enabled){
          enableWeb3()
         }
         if(isWeb3Enabled && isAuthenticated && first && !isLoading && user){
          setfirst(false)
          const options = {
            abi: contractABI,
            contractAddress: contractAddress,
            functionName: "getCreatorBalance",
            params: {
              _signature: user.attributes.authData.moralisEth.signature,
              _message: sign(user.attributes.authData.moralisEth.data)
            }
          }
          runContractFunction({params:options})
         }
         if(data && balance == null){
          setBalance(Moralis.Units.FromWei(data))
         }
      }  
    });


    return (

      <div key='balance' className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">Balance</dt>
        {balance != null ? <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{balance} MATIC</dd> : <div className="animate-pulse h-2 bg-slate-200 rounded col-span-2 w-24"></div>}
        {balance > 0 ? <Withdraw resetbalance= {resetbalance} active={true}  showTransactionModal={props.showTransactionModal}/> : <Withdraw active={false}/>}
      </div>

    )


}