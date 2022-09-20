import React, { useState, useEffect } from 'react';
import { useMoralis, useChain, useWeb3Contract} from "react-moralis"
import {Moralis} from 'moralis'
import mainContract from 'constants/Main.json'


export default function CreatorRowInAList(props) {

    const [loading, setLoaded] = useState(true);
    const [creator, setCreator] = useState(null);
    const [first, setfirst] = useState(true);
    const { isAuthenticated, chainId, isWeb3Enabled, enableWeb3 } = useMoralis()
    const contractABI = mainContract.abi
    const contractAddress = mainContract.address
  

    const { data, error, runContractFunction, isFetching, isLoading } =
    useWeb3Contract({
      abi: contractABI,
      contractAddress: contractAddress,
      functionName: "findCreatorDataByAdress",
      params: {
        _creatorAddress: props.creatorAddress
      },
    });

    useEffect(() => {
      
        setLoaded(false)
    
        if(!loading){
          if(!isAuthenticated){
             router.push('/login')
           }
           //switchNetwork("0x4")
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
                url: `/creators/${data[3]}`
            })
           }
        }  
      });


    


        return(                      
                    <tr key = {props.creatorAddress}>
                        <td key ='name-and-image' className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                            <div key ='image' className="h-10 w-10 flex-shrink-0">
                              {creator == null ? <div className="animate-pulse rounded-full bg-slate-200 h-10 w-10"></div> : <img className="h-10 w-10 rounded-full" src={creator.image} alt="" />}
                            </div>
                            <div key ='name' className="ml-4">
                              <div className="font-medium text-gray-900">
                              {creator == null ? <div className="animate-pulse h-2 bg-slate-200 rounded col-span-2"></div> : creator.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td key ='description' className="px-3 py-4 text-sm text-gray-500 sm:invisible md:invisible lg:visible xl:visible 2xlvisible">
                          <div className="text-gray-900">
                          {creator == null ? <div className="animate-pulse h-2 bg-slate-200 rounded col-span-2"></div> : creator.description}
                            </div>
                        </td>
                        <td key ='price' className="px-3 py-4 text-sm text-gray-500">
                          {creator == null ? <div className="animate-pulse h-2 bg-slate-200 rounded col-span-2"></div> : `$${creator.subscriptionPrice}/Month`}
                        </td>
                        <td key ='view' className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        
                          <a href={creator == null ? '#' : creator.url} className="text-indigo-600 hover:text-indigo-900">View</a>
                        </td>
                      </tr>
                      )
}