import React, { useState, useEffect } from 'react';
import { useMoralis, useChain, useWeb3Contract, useWeb3ExecuteFunction} from "react-moralis"
import sign from 'functions/sign'
import mainContract from 'constants/Main.json'
import {Moralis} from 'moralis'





export default function DeleteContent(props) {
  
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

    let finishWithdraw = async (tx) =>{
      await tx.wait(1);
  }

    const handleDelete = async(e) =>{
        e.preventDefault();
          await runContractFunction({
            params: {
            abi: contractABI,
            contractAddress: contractAddress,
            functionName: "deleteContent",
            params: {
              _contentID: props.contentID
            }
            },
            onSuccess: finishWithdraw,
            onError: (error) => {
                console.log(error)
            },
        })
      }


    return (
        <div>
        {props.canEdit == true ? <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"        
            onClick={handleDelete}
            >
            Delete content
          </button>
        :
            ''
        }
        </div>
    )


}