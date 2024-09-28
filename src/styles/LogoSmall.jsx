import { Component } from "react";
import footerlogo from "/logo.png";
class LogoSmall extends Component {
  render() {
    return <img alt="logo" style={{ width: "200px" }} src={footerlogo}></img>;
  }
}

export default LogoSmall;
