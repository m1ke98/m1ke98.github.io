import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import GET_TRANSFERS from "./graphql/subgraph";

import Interface from "./components/Interface.js";
import Home from "./components/Home.js";
import Navbar from "./components/Navbar.js";
import FlashLoans from "./components/FlashLoans.js";

function App() {
  const ethereum = window.ethereum;

  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [address, setAddress]= useState();

  if (ethereum) {
    ethereum.on('accountsChanged', function (accounts) {
      setAddress(accounts[0]);
    });
  }

  useEffect(() => {
    async function getAccount() {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAddress(accounts[0]);
    }
    getAccount();
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);
  
  return (
    <Router>
      <div class="app">
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/interface">
            <Interface user={address}/>
          </Route>
          <Route path="/flashloans">
            <FlashLoans user={address}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;