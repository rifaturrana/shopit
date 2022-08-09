import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import { Login } from "./components/User/Login";
import { Register } from "./components/User/Register";
import ProductDetail from "./components/product/ProductDetail";
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path="/" component={Home} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/register" component={Register} exact />

          <Route path="/search/:keyword" component={Home} />

          <Route path="/product/:id" component={ProductDetail} exact />
        </div>
        <Footer />
      </div>
    </Router>
    // <Home />
  );
}

export default App;
