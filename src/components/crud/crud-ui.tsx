'use client'

import { Keypair, PublicKey } from '@solana/web3.js'
import { ellipsify } from '../ui/ui-layout'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useCrudProgram, useCrudProgramAccount } from './crud-data-access'
import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { IconChevronsDownLeft } from '@tabler/icons-react'

export function CrudCreate() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const { crate_entry } = useCrudProgram();
  const {publicKey} = useWallet();  

const isFormValid = title.trim() !== '' && message.trim() !== '';


const handleSubmit = () =>{
      if(publicKey && isFormValid){
        crate_entry.mutateAsync({title, message, owner: publicKey});
      }
    };

    if(!publicKey)
      return <p>Connnect your wallet</p>
    
      return (
        <div> 
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
          <button  className="btn btn-xs btn-secondary btn-outline" onClick={handleSubmit} disabled={!isFormValid}>Create</button>
      </div>
      );                              

}

export function CrudList() {
  const { accounts, getProgramAccount } = useCrudProgram()

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <CrudCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  )
}

function CrudCard({ account }: { account: PublicKey }) {
  const { accountQuery, update_entry, delete_entry } = useCrudProgramAccount({
    account,
  })

  const[message, setMessage] = useState("") ;
  const title = accountQuery.data?.title || '';
  const {publicKey} = useWallet();  

const isFormValid =  message.trim() !== '';

const handleUpdateSubmit = () =>{
      if(publicKey && isFormValid){
        update_entry.mutateAsync({ title, message, owner: publicKey}, {
          onSuccess: () => {
            accountQuery.refetch();
            setMessage(message);
          },
        }
          
        );
      }
    };

    const handleDelete = () =>{
      const title = accountQuery.data?.title ;
      <h2 className="card-title justify-center text-3xl cursor-pointer" onClick={() => accountQuery.refetch()}>
      {title}
    </h2>
                if (title) {
                  return delete_entry.mutateAsync( title);

                }
    };

    if(!publicKey)
      return <p>Connnect your wallet</p>
    

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h1 className="card-title justify-center text-3xl cursor-pointer" onClick={() => accountQuery.refetch()}>
            {accountQuery.data?.title}
          </h1>
          <h2> {accountQuery.data?.message}</h2>
          <div> 
      </div>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
          <div className="text-center space-y-4">
          <button  className="btn btn-xs btn-secondary btn-outline"
           onClick={handleUpdateSubmit} disabled={update_entry.isPending}
           >Update</button>
      </div>
          </div>
          <div className="text-center space-y-4">
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={handleDelete}
              disabled={delete_entry.isPending}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

   
  )
}
