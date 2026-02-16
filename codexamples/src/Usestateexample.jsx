import React from 'react'
import { useState } from 'react'
export default function Usestateexample() {
const [userName , setUsername] = useState("radhika")
  return (
    <div>
    <input type="text" value = {userName} 
    onChange={(e)=>setUsername(e.target.value)}/>
    <h1> Happy new year {userName} </h1>
    </div>
  )
}