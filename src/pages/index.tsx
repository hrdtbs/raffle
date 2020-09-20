import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { useDispatchTickets } from "../context/tickets";

export default function Home() {
  const setTickets = useDispatchTickets()
  const router = useRouter()
  const [groupCount, setGroupCount] = useState([true])
  return (
    <section>
      <header>
        <h1>Raffle box</h1>
      </header>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const rateArr = new FormData(event.currentTarget).getAll("ratio") as string[];
          const textsArr = new FormData(event.currentTarget).getAll("texts") as string[];

          let tickets: [string, number][] = []
          textsArr.map(str => str.split("\n")).forEach((texts, index) => {
            texts.forEach((text_) => {
              const text = text_.trim()
              if(text){
                tickets.push([text, Number(rateArr[index])])
              }
            })
          })
          if(tickets){
            setTickets(tickets)
            router.push("/raffle")
          }
        }}
      >
        {groupCount.map((_, key) => {
          return (
            <details key={key} open={key === groupCount.length - 1}>
              <summary>Group {key}</summary>
              <fieldset>
                <input name="ratio" type="number" min={0} max={100} step={0.1} defaultValue={0.5}/>
                <textarea name="texts" cols={30} rows={10}></textarea>
              </fieldset>
            </details>
          )
        })}
          <button type="button" onClick={() => setGroupCount(prev => [...prev, true])}>ADD GROUP</button>
          <button type="submit">SUBMIT</button>
      </form>
    </section>
  );
}
