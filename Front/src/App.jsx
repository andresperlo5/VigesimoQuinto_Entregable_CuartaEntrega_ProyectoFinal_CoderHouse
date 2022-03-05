import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import HomePages from './Pages/HomePages'
import Pages404 from './Pages/Pages404'
import LoginPages from './Pages/LoginPages'
import Carrito from './Pages/CarritoPages'
import ProductoIdPages from './Pages/ProductoIdPages'
import AdminPages from './Pages/AdminPages'
import PrivateRoute from './Components/PrivateRoute'
import RecoveryPassPages from './Pages/RecoveryPassPages'

function App() {
  return (
    <Router>
      <Switch>
				<Route path="/recoverpass/:tokenId" component={RecoveryPassPages} />
        <PrivateRoute path="/admin" role={'admin'} component={AdminPages} />
        <Route path="/producto/:id" exact component={ProductoIdPages} />
        <Route path="/carrito" exact component={Carrito} />
        <Route path="/loginUser" exact component={LoginPages} />
        <Route path="/" exact component={HomePages} />
        <Route path="/" component={Pages404} />
      </Switch>
    </Router>
  );
}

export default App;
