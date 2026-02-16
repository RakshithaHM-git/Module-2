import React from 'react'
import { useEffect } from 'react'
export default function Useeffect1() {
    const [count, setCount] = React.useState(0);
    useEffect(() => {
  console.log('Component mounted')});
;
  return (
    <div>
        <h1>UseEffect Example</h1>
        <button onClick={() => setCount(count + 1)}>
            Click Me</button>
        <p>Count: {count}</p>
        <button> hi </button>
    </div>
  )
}