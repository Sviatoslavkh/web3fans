import React, { useState, useEffect } from 'react';
import { useMoralis, useChain, useWeb3Contract, useWeb3ExecuteFunction} from "react-moralis"
import {Moralis} from 'moralis'
import mainContract from 'constants/Main.json'
import { useRouter } from 'next/router'
import Navigation from 'components/Navigation';
import CreatorProfile from 'components/CreatorProfile'
import ContentItem from 'components/ContentItem'
import ContentEmpty from 'components/ContentEmpty'
import Loading from 'components/Loading'
import Lougout from 'components/Logout'



export default function Content(props) {

  const router = useRouter()
  const [loading, setLoaded] = useState(true);
  const [creator, setCreator] = useState(null);
  const [first, setfirst] = useState(true);
  const [subscriptionIsActive, setSubscriptionIsActive] = useState(false);
  const { isAuthenticated, chainId, isWeb3Enabled, enableWeb3, account, user, isLoggingOut } = useMoralis()
  const contractABI = mainContract.abi
  const contractAddress = mainContract.address
  //

  const { data, error, runContractFunction, isFetching, isLoading } = useWeb3Contract({
            abi: contractABI,
            contractAddress: contractAddress,
            functionName: "getSubscriptionByCreatorAddress",
            params: {
              _creator: props.creator,
              _follower: account
            },
          });

    useEffect( () => {
      
      setLoaded(false)
  
      if(!loading){
        if(!isAuthenticated || isLoggingOut){
           router.push('/login')
         }
         if(!isWeb3Enabled){
          enableWeb3()
         }
         if(props.creator != null){
          setCreator(props.creator)

         }
         if(isWeb3Enabled && isAuthenticated && first && !isLoading && !subscriptionIsActive){
            if(account.toLocaleLowerCase() == props.creator.toLocaleLowerCase()){
              setSubscriptionIsActive(true)
            }else if(account != props.creator && data == null && error == null){
              runContractFunction()
            }
          setfirst(false)
         }
         if(data != null){
          setSubscriptionIsActive(data[3])
         }
         if(error != null){
          setSubscriptionIsActive(false)
         }
      }  
    });



  return (

      <div>
        {
          creator == null 
          ? 
          <Loading/> 
          :
          subscriptionIsActive && props.contentIDs
          ?
          props.contentIDs.map((contentID) => (
            <ContentItem key={Moralis.Units.Token(contentID, "0")} contentID = {Moralis.Units.Token(contentID, "0")}/>
          ))
          :
              <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Subscription is not Active</h3>
              <p className="mt-1 text-sm text-gray-500">Please, buy a subscrtiption to get an access to creator's content</p>
              <div className="mt-6">
              </div>
            </div>
        }
        </div>

  )
}