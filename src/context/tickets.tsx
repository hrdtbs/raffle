import { createContext, useContext, useState } from "react";


const TicketsContext = createContext<[string, number][]>([])
const DispatchTicketsContext = createContext<React.Dispatch<React.SetStateAction<[string, number][]>>>(() => {})

export const useTickets = () => {
  return useContext(TicketsContext)
}

export const useDispatchTickets = () => {
  return useContext(DispatchTicketsContext)
}

export const TicketsContextProvider: React.FC = ({children}) => {
  const [texts, setTickets] = useState<[string, number][]>([])
  return (
    <TicketsContext.Provider value={texts}>
      <DispatchTicketsContext.Provider value={setTickets}>
        {children}
      </DispatchTicketsContext.Provider>
    </TicketsContext.Provider>
  )
}