import React, { useState, useEffect } from 'react';
import { useS3Upload } from 'next-s3-upload';
import Navigation from 'components/Navigation';
import { useMoralis, useChain, useWeb3Contract, useMoralisFile} from "react-moralis"
import { useRouter } from 'next/router'
import ErrorModal from 'components/ErrorModal'
import mainContract from 'constants/Main.json'
import SwitchNetworkModal from 'components/SwitchNetworkModal';
import TransactionModal from 'components/TransactionModal'

export default function AddContent() {

    const router = useRouter()
    const { isAuthenticated, chainId, isWeb3Enabled, enableWeb3, user } = useMoralis()
    const {
      error,
      isUploading,
      moralisFile,
      saveFile,
    } = useMoralisFile();
    const { runContractFunction } = useWeb3Contract()
    const contractABI = mainContract.abi
    const contractAddress = mainContract.address

    let [loading, setLoaded] = useState(true);
    let [transactionModalOpen, setTransactionModalOpen] = useState(false);
    let [imageUrl, setImageUrl] = useState('');
    let [videoUrl, setVideoUrl] = useState('');
    let [contentType, setContentType] = useState(0);
    let [creatorName, setCreatorName] = useState(null);
    let [creatorDescription, setCreatorDescription] = useState(null);
    let [formIsReady, setFormIsReady] = useState(false);
    let [videoValid, setVideoValid] = useState(true);
    let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();
  

    let handleFileChange = async file => {
      saveFile(file.name, file, { saveIPFS: true })
    };

    let handleNameChange = (event) =>{
        setCreatorName(event.target.value);
      }

    let handleDescriptionChange = (event) =>{
        setCreatorDescription(event.target.value);
      }

      let handleContenTypeChange = (event) =>{
        setContentType(event.target.value);
      }
      let handleVideoChange = (event) =>{
        setVideoUrl(event.target.value);
        setVideoValid(validateYouTubeUrl(event.target.value))
      }
    
    let hundleRegistration = async (tx) =>{
        await tx.wait(1);
        let address = await user.get("ethAddress")
        router.push(`/creators/${address}`)
    }

    let handleSubmit = async (event) =>{
        event.preventDefault();
        if(creatorName && creatorDescription && imageUrl.length>0 ){
          let link = ''
          if(contentType == 0){
            link = imageUrl
          }else if(contentType == 1){
            link = videoUrl
          }
            setTransactionModalOpen(true)
            await runContractFunction({
                    params: {
                    abi: contractABI,
                    contractAddress: contractAddress,
                    functionName: "addContent",
                    params: {
                        _name: creatorName,
                        _description: creatorDescription,
                        _contentType: contentType,
                        _link: link
                    }
                    },
                    onSuccess: hundleRegistration,
                    onError: (error) => {
                        setTransactionModalOpen(false)
                        console.log(error)
                    },
                })
          }
        
      }


      function validateYouTubeUrl(url){
              if (url != undefined || url != '') {
                  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
                  var match = url.match(regExp);
                  if (match) {
                      return true
                  }
                  else {
                      return false
                  }
              }else{
                return false
              }
      }
    

    useEffect(() => {
      
      setLoaded(false)
  
      if(!loading){
        if(!isAuthenticated){
           router.push('/login')
         }else if(moralisFile != null && moralisFile != undefined){
          if(moralisFile['_ipfs']){
            if(moralisFile['_ipfs'] != imageUrl){
              setImageUrl(moralisFile['_ipfs'])
            }
          }

         }

         //switchNetwork("0x4")
         if(!isWeb3Enabled){
          enableWeb3()
         }
      }  

      if(creatorName && creatorDescription && ((imageUrl.length>0 && contentType == 0) || (validateYouTubeUrl(videoUrl) && contentType == 1))){
        setFormIsReady(true)
      }else{
        setFormIsReady(false)
      }

    });

    

  return (

    <div className="min-h-full">
    <SwitchNetworkModal/>
    <TransactionModal open={transactionModalOpen}/>
    <ErrorModal/>
    <Navigation authrizationComplete={true} navLinks={[
        { name: 'Creators', href: '/creators', current: false },
        { name: 'Add content', href: `/creators/${router.query.creator}/addcontent`, current: true }
          ]}/>
    <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <form className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Add new content</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>

          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Content title
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md shadow-sm">
                
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                    onChange={handleNameChange}
                  />
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              Content description
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                  defaultValue={''}
                  onChange={handleDescriptionChange}
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              Content type
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
              <fieldset className="mt-4">
                  <legend className="sr-only">Notification method</legend>
                  <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                      <div key="image" className="flex items-center">
                        <input
                          id="image"
                          name="notification-method"
                          type="radio"
                          defaultChecked={true}
                          value={0}
                          onChange={handleContenTypeChange}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="image" className="ml-3 block text-sm font-medium text-gray-700">
                          Image
                        </label>
                      </div>
                      <div key="video" className="flex items-center">
                        <input
                          id="video"
                          name="notification-method"
                          type="radio"
                          value={1}
                          onChange={handleContenTypeChange}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="video" className="ml-3 block text-sm font-medium text-gray-700">
                          Video
                        </label>
                      </div>

                  </div>
                </fieldset>
              </div>
            </div>

            {contentType == 0 ?
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <div className="flex items-center">
                <FileInput onChange={handleFileChange} />
                <button
                  type="button"
                  className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={openFileDialog}
                >
                  {imageUrl ? 'Change image' : 'Add image'}
                </button>
                
              </div>
              <div>
                <img className="rounded-lg object-cover shadow-lg" src={imageUrl} alt="" />
              </div>
            </div>
          </div>
             : 
             <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                Video
              </label>
              <div className="mt-1 flex rounded-md ">
                
                    Coming soon

            
                  
                </div>

                
            </div>
            
             }

            
            

            
          </div>
        </div>

        
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Clear
          </button>
          <button
            type="submit"
            className=" disabled:opacity-20 ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={!formIsReady}
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </form>
            
  
          </div>
        </main>
      </div>
    </div>

  )
}