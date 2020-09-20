import { useEffect, useState } from "react";
import {  useTickets } from "../context/tickets";


const Ticket = ({index, win, name, small}: {index: number, win?: boolean, name?: string, small?: boolean}) => {
  return (
    <div className={`ticket-ui ${small ? "small" : ""}`}>
      <div className="head">No.{`${index**2}`.padStart(6, "0")}</div>
      <div className="body">
        <div>
          <h4>
            {name}
          </h4>
          <p className="timestamp">{new Date().toLocaleDateString('en-US', { weekday: "short", year: 'numeric', month: 'short', day: 'numeric', hour: "numeric", minute: "numeric", second: "numeric" })}</p>
        </div>
        <div className="stamp">
          <div className={`stampinner ${win ? "ok" : ""}`}>
            {win ? "Win": null}
          </div>
        </div>
      </div>
    </div>
  )
}

let timer = 0
export default function Home() {
  const tickets = useTickets()
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState(0)
  const [winner, setWinner] = useState<string>()
  const [firstRun, setFirstRun] = useState(false)

  const cleanTimer = () => {
    window.clearInterval(timer)
  }
  useEffect(() => {
    if(winner === undefined && firstRun){
      timer = window.setInterval(() => {
        setIndex(prev => (prev + Math.floor(Math.random() * tickets.length)) % tickets.length)
        setCount(prev => prev + 1)
      }, 100)
    }
    return cleanTimer
  },[winner, firstRun])

  const [winners, setWinners] = useState<[string, number][]>([])

  useEffect(() => {
    if(count < 10) return
    const value = Math.random()
    const ticket = tickets[index]
    if(value * 100 < ticket[1] && !winners.some(([w]) => ticket[0] === w)){
      setWinner(tickets[index][0])
      cleanTimer()
    }
  },[index, count])


  return (
    <div>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "300px",
      }}>
        <Ticket win={!!winner} index={index} name={winner || tickets?.[index]?.[0]}/>
      </div>
        <div role="button" onClick={() => {
          if(winner){
            setWinners(prev => [...prev, [winner, index]])
            setWinner(undefined)
          }else{
            setFirstRun(true)
          }
        }} className="btn-run" style={{marginBottom: 32}}>RUN</div>
      {winners.length > 0 ? (
       <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center"
       }}>
         { winners.map(([w, i]) => {
          return <Ticket name={w} index={i} win small/>
        })}
       </div>
      ): null}
    </div>
  );
}
