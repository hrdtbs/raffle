import { useEffect, useState } from "react";
import {  useTickets } from "../context/tickets";

const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
const removeEmojis = (string: string) => {
  return string.replace(regex, '');
}

const timestamp = new Date().toLocaleDateString('en-US', { weekday: "short", year: 'numeric', month: 'short', day: 'numeric' })


const Ticket = ({index, win, name, small}: {index: number, win?: boolean, name?: string, small?: boolean}) => {
  const [screenname, username] = removeEmojis(name || "").split(",")
  return (
    <div className={`ticket-ui ${small ? "small" : ""}`}>
      <div className="head">No.{`${index**2}`.padStart(6, "0")}</div>
      <div className="body">
        <div>
          {username ? (
            <>
              <h4 className="username">{username}</h4>
              <p className="screenname">
                {screenname}
              </p>
            </>
          ): (
            <h4 className="username">{username}</h4>
          )}
          <p className="timestamp">{timestamp}</p>
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
         { winners.slice().reverse().map(([w, i]) => {
          return <Ticket name={w} index={i} win small/>
        })}
       </div>
      ): null}
    </div>
  );
}
