import React, { useState, useEffect } from 'react';
import { useMoralis, useChain, useWeb3Contract, useWeb3ExecuteFunction} from "react-moralis"
import {Moralis} from 'moralis'
import mainContract from 'constants/Main.json'
import { optimizeFonts } from 'next.config';



export default function CreatorsProfile(props) {

  const [loading, setLoaded] = useState(true);
  const [first, setfirst] = useState(true);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [selfContent, setSelfContent] = useState(false);
  const [accountAddress, setAccountAddress] = useState(null);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState(null);
  const { isAuthenticated, chainId, isWeb3Enabled, enableWeb3, account, user, isLoggingOut } = useMoralis()
  const contractABI = mainContract.abi
  const contractAddress = mainContract.address


  const { data, error, runContractFunction, isFetching, isLoading } = useWeb3Contract();
    


 
  

  useEffect( () => {
    
    setLoaded(false)
    if(!loading && props.creator != null){
    if(!loading && account && accountAddress == null){
      setAccountAddress(account)
    }  
    if(isWeb3Enabled && isAuthenticated && first && !isLoading && accountAddress != null && !subscriptionActive){
      if(account.toLocaleLowerCase() == props.creator.address.toLocaleLowerCase()){
        setSubscriptionActive(true)
        setSelfContent(true)
      }else if(account.toLocaleLowerCase() != props.creator.address.toLocaleLowerCase() && data == null && error == null){
        let options = {
          abi: contractABI,
          contractAddress: contractAddress,
          functionName: "getSubscriptionByCreatorAddress",
          params: {
            _creator: props.creator.address,
            _follower: account
          },
        }
        runContractFunction({params: options})
      }
      setfirst(false)
      }
      if(data != null){
        let date = new Date(Moralis.Units.Token(data[2], "0") * 1000)
        setSubscriptionActive(data[3])
        setSubscriptionEndDate(date.toISOString().split('T')[0])
      }
      if(error != null){
        setSubscriptionActive(false)
      }
    }
  });
  


    return (
        
      <div className="mx-auto mt-6 px-4 sm:px-6 md:flex md:items-start md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0">
                <div className="relative">
                  {props.creator != null ? <img
                    className="h-16 w-16 rounded-full"
                    src={props.creator.image}
                    alt={props.creator.name}
                  /> 
                  :
                  <div className="animate-pulse rounded-full bg-slate-200 h-10 w-10"/>
                  }
                  <span className="absolute inset-0 shadow-inner rounded-full" aria-hidden="true" />
                </div>
              </div>
              <div>
              {props.creator != null ? <h1 className="text-2xl font-bold text-gray-900">{props.creator.name}</h1> : <div className="animate-pulse h-2 bg-slate-200 rounded col-span-2"/>}
                
               
                {props.creator != null ?  <p className="text-sm font-medium text-gray-500">
                {props.creator.description}

                </p>
                   : <div className="animate-pulse h-2 bg-slate-200 rounded col-span-2"/>}
                {subscriptionActive 
                ? <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                            {!selfContent ? 'Active subscription'  : 'Your subscription'}
                            {subscriptionEndDate != null ? ` (till ${subscriptionEndDate})` : ''}
                          </span>
                :
                <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">Subscription not active</span>
                }
              </div>
            </div>
            <div>
              {selfContent 
              ? 
              <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                  onClick={props.goToAddContent}
                >
                  Add content
                </button>
              </div>
              :
              subscriptionActive
              ?
              <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                  onClick={props.showSubscriptionModal}
                >
                  Prolongue ${props.creator.subscriptionPrice}
                </button>
              </div>
              :
              <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
                <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                onClick={props.showSubscriptionModal}>
                {props.creator != null ? `Subscribe \$${props.creator.subscriptionPrice}` : 'Subscribe'}
                </button>
              </div>
              }
            
            </div>
          </div>

    )


}


