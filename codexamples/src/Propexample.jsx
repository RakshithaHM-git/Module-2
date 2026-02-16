import React from 'react'
import { useState } from 'react'
import Diwali from './Diwali'
export default function Propexample() {
    const [uName, setUname] = useState("")
  return (
    <div>
    <input type='text'
    value = {uName}
    onChange={(e)=>setUname(e.target.value)}
    />
    <h1> Happy independence day {uName} </h1>
   <Diwali user = {uName} />
    </div>
  )
}