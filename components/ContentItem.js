
import React, { useState, useEffect } from 'react';
import { useMoralis, useChain, useWeb3Contract, useWeb3ExecuteFunction} from "react-moralis"
import {Moralis} from 'moralis'
import mainContract from 'constants/Main.json'
import sign from 'functions/sign'
import DeleteContent from 'components/DeleteContent'


export default function ContentItem(props) {

  const [contentType, setContentType] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState(null);
  const [first, setfirst] = useState(true);
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
       if(isWeb3Enabled && isAuthenticated && first && !isLoading && props.contentID && user){
        setfirst(false)
        const options = {
          abi: contractABI,
          contractAddress: contractAddress,
          functionName: "getContent",
          params: {
            _contentID: props.contentID,
            _signature: user.attributes.authData.moralisEth.signature,
            _message: sign(user.attributes.authData.moralisEth.data)
          }
        }
        runContractFunction({params:options})
       }
       if(!first && data){
        setContentType(Moralis.Units.Token(data[2], "0"))
        setName(data[0])
        setDescription(data[1])
        setUrl(data[3])
       }
    }  
  });


  let contentTypeBlock = ''

  if(contentType == 0){

    contentTypeBlock = <span className="block text-base  text-blue-600 font-semibold tracking-wide uppercase">
    Image
  </span>
    
  }else if (contentType == 1){

    contentTypeBlock = <span className="block text-base  text-blue-600 font-semibold tracking-wide uppercase">
    Video
  </span>
    
  }

    return (
      <div className="pb-5 border-b border-gray-200">
<div className="relative py-10 bg-white overflow-hidden">
      <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
        <div className="relative h-full text-lg max-w-prose" aria-hidden="true">
          <svg
            className="absolute top-12 left-full transform translate-x-32"
            width={404}
            height={384}
            fill="none"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width={404} height={384} fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
          </svg>
          <svg
            className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
            width={404}
            height={384}
            fill="none"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width={404} height={384} fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
          </svg>
          <svg
            className="absolute bottom-12 left-full transform translate-x-32"
            width={404}
            height={384}
            fill="none"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="d3eb07ae-5182-43e6-857d-35c643af9034"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width={404} height={384} fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)" />
          </svg>
        </div>
      </div>
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="text-lg max-w-prose">
          <h1>
            {contentTypeBlock}
            <span className="mt-2 block text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {name}
            </span>
            {props.canEdit && props.contentID ? <DeleteContent contentID={props.contentID} canEdit={props.canEdit}/> : ''}
          </h1>
          <p className="mt-8 text-xl text-gray-500 leading-8">
            {description}
          </p>
        </div>
        <div className="mt-6 prose prose-blue prose-lg text-gray-500 mx-auto">
          
          <figure>
            <img
              className="w-full rounded-lg"
              src={url}
              width={1310}
              height={873}
            />
          </figure>
        </div>
      </div>
    </div>

</div>

    )


}