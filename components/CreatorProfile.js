import React, { useState, useEffect } from 'react';
import { useMoralis, useChain, useWeb3Contract} from "react-moralis"


export default function CreatorsProfile(props) {

  const [loading, setLoaded] = useState(true);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [accountAddress, setAccountAddress] = useState(null);
  const { account } = useMoralis()
    

  const creator = props.creator;

  let subsStatus = ''
  let subsbutton = ''

  if(creator != null && creator.address.toLowerCase() != accountAddress.toLowerCase() && accountAddress != null){
        if(subscriptionActive){
      subsbutton = <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
        <button
          type="button"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
        >
          Prolongue ${creator.subscriptionPrice}
        </button>
      </div>

      subsStatus =<span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                            Active subscription
                          </span>

    }else{
      subsbutton = <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
        <button
          type="button"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
        >
          Subscribe ${creator.subscriptionPrice}
        </button>
      </div>

    subsStatus =<span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
  Subscription not active
  </span>
    }
  }else if(creator != null && creator.address.toLowerCase() == accountAddress.toLowerCase()){
      
    subsbutton = <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
      <button
        type="button"
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
        onClick={props.goToAddContent}
      >
        Add content
      </button>
    </div>

    subsStatus =<span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          Your account
                        </span>

  }
  

  useEffect( () => {
    
    setLoaded(false)

    if(!loading && account && accountAddress == null){
      setAccountAddress(account)
      
    }  
  });
  


    return (
        
      <div className="mx-auto mt-6 px-4 sm:px-6 md:flex md:items-start md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0">
                <div className="relative">
                  {creator != null ? <img
                    className="h-16 w-16 rounded-full"
                    src={creator.image}
                    alt={creator.name}
                  /> 
                  :
                  <div className="animate-pulse rounded-full bg-slate-200 h-10 w-10"/>
                  }
                  <span className="absolute inset-0 shadow-inner rounded-full" aria-hidden="true" />
                </div>
              </div>
              <div>
              {creator != null ? <h1 className="text-2xl font-bold text-gray-900">{creator.name}</h1> : <div className="animate-pulse h-2 bg-slate-200 rounded col-span-2"/>}
                {subsStatus}
               
                {creator != null ?  <p className="text-sm font-medium text-gray-500">
                {creator.description}
                </p>
                   : <div className="animate-pulse h-2 bg-slate-200 rounded col-span-2"/>}
              </div>
            </div>
            <div>
              {subsbutton}
            
            </div>
          </div>

    )


}


