import React, { useState, useEffect } from 'react';
import { useMoralis, useChain, useWeb3Contract} from "react-moralis"
import {Moralis} from 'moralis'
import mainContract from 'constants/Main.json'
import { useRouter } from 'next/router'
import Navigation from 'components/Navigation';
import CreatorProfile from 'components/CreatorProfile'
import ContentItem from 'components/ContentItem'
import ContentEmpty from 'components/ContentEmpty'
import Loading from 'components/Loading'
import Content from 'components/Content'
import Balance  from 'components/Balance';
import SwitchNetworkModal from 'components/SwitchNetworkModal';
import TransactionModal from 'components/TransactionModal'


export default function Creator() {

  const router = useRouter()
  let [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [loading, setLoaded] = useState(true);
  const [creator, setCreator] = useState(null);
  const [first, setfirst] = useState(true);
  const { isAuthenticated, chainId, isWeb3Enabled, enableWeb3, account } = useMoralis()
  const contractABI = mainContract.abi
  const contractAddress = mainContract.address

  let goToAddContent = () =>{
    router.push(`/creators/${router.query.creator}/addcontent`)
  }

  function showTransactionModal(open){
    setTransactionModalOpen(open)
  }
  

    const { data, error, runContractFunction, isFetching, isLoading } =
    useWeb3Contract({
      abi: contractABI,
      contractAddress: contractAddress,
      functionName: "findCreatorDataByAdress",
      params: {
        _creatorAddress: router.query.creator
      },
    });

    useEffect( () => {
      
      setLoaded(false)
  
      if(!loading){
        if(!isAuthenticated){
           router.push('/login')
         }
         if(!isWeb3Enabled){
          enableWeb3()
         }
         if(isWeb3Enabled && creator == null && first && !isLoading){
          runContractFunction()
          setfirst(false)
         }
         if(data != null && creator == null){
          
          setCreator({
              name: data[0],
              description: data[1],
              image: data[2],
              subscriptionPrice: Moralis.Units.Token(data[4], "0"),
              url: `/creators/${data[3]}`,
              content: data[5],
              address: data[3]
          })
         }
      }  
    });


  return (

      <div className="min-h-full">
       <SwitchNetworkModal/>
       <TransactionModal open={transactionModalOpen}/>
        <Navigation authrizationComplete={true} navLinks={[
        { name: 'Creators', href: '/creators', current: false },
        { name: (creator != null ? creator.name : ''), href: `/creators/${router.query.creator}`, current: true }
          ]}/>
        <div className="py-10">
            <header>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">Creator profile</h1>
              </div>
            </header>
            <main>
              <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Replace with your content */}
                <CreatorProfile creator={creator} goToAddContent = {goToAddContent} showTransactionModal={showTransactionModal}/>
                <Balance showTransactionModal={showTransactionModal}/>

                <h2 className="text-3xl mt-6 font-bold leading-tight text-gray-900">Content list</h2>
                {data == null ? <Loading/> : data[5].length ==0 ? <ContentEmpty/> : <Content creator ={router.query.creator} contentIDs = {creator!=null ? creator.content : []}/>}
                
                {/* /End replace */}
              </div>
            </main>
          </div>
        </div>

  )
}