import { TicketsContextProvider } from "../context/tickets";
import App from "next/app";
import "ress"
import "../style.scss"

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <TicketsContextProvider>
        <Component {...pageProps} />
      </TicketsContextProvider>
    );
  }
}
export default MyApp;