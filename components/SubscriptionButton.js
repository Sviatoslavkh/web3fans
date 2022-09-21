import React, { useState, useEffect } from 'react';
import { useMoralis, useChain, useWeb3Contract, useWeb3ExecuteFunction} from "react-moralis"
import {Moralis} from 'moralis'
import mainContract from 'constants/Main.json'

export default function SubscriptionButton(props) {
    const contractABI = mainContract.abi
    const contractAddress = mainContract.address
    const [loading, setLoaded] = useState(true);
    const [first, setfirst] = useState(true);
    const [subscriptionActive, setSubscriptionActive] = useState(false);
    const [selfContent, setSelfContent] = useState(false);

    const { isAuthenticated, chainId, isWeb3Enabled, enableWeb3, account, user, isLoggingOut } = useMoralis()

    const { data, error, runContractFunction, isFetching, isLoading } = useWeb3Contract();

      let hundleTransaction = async (tx) =>{
        
        await tx.wait(1);
        props.setTransactionModalOpen(false)
    }

    let handleSubmit = async (event) =>{
        event.preventDefault();
        if(props.msgValue && props.creatorAddress){
            props.hideSubscriptionModal()
            props.showTransactionModal(true)
            await runContractFunction({
                    params: {
                        abi: contractABI,
                        contractAddress: contractAddress,
                        functionName: "buySubscription",
                        msgValue: props.msgValue,
                        params: {
                            _creatorAddress: props.creatorAddress
                        },
                      },
                    onSuccess: hundleTransaction,
                    onError: (error) => {
                        console.log(error)
                        props.showTransactionModal(false)
                    },
                })
          }
        
      }

      return (
                <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                onClick={handleSubmit}>
                Confirm
                </button>
      )


}