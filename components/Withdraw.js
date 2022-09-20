import React, { useState, useEffect } from 'react';
import { useMoralis, useChain, useWeb3Contract, useWeb3ExecuteFunction} from "react-moralis"
import sign from 'functions/sign'
import mainContract from 'constants/Main.json'
import {Moralis} from 'moralis'





export default function Withdraw(props) {
  
    const [loading, setLoaded] = useState(true);
    const contractABI = mainContract.abi
    const contractAddress = mainContract.address
    const { isAuthenticated, chainId, isWeb3Enabled, enableWeb3, account, user, isLoggingOut } = useMoralis()
    const { data, error, runContractFunction, isFetching, isLoading } = useWeb3Contract();

    useEffect( () => {
      
      setLoaded(false)
  
      if(!loading){
         if(!isWeb3Enabled){
          enableWeb3()
         }
      }  
    });

    const handleWithdraw = async() =>{
        e.preventDefault();
        props.showTransactionModal(true)
          await runContractFunction({
            params: {
            abi: contractABI,
            contractAddress: contractAddress,
            functionName: "creatorWithdraw"
            },
            onSuccess: props.resetbalance(),
            onError: (error) => {
                console.log(error)
                showTransactionModal(false)
            },
        })
      }


    return (
        <div>
        {props.active == true ? <button
            type="button"
            className="inline-flex items-center rounded border border-transparent bg-blue-500 px-2.5 py-1.5 text-xs font-medium text-blue-00 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"        
            onClick={handleWithdraw}
            >
            Withdraw
          </button>
        :
            ''
        }
        </div>
    )


}