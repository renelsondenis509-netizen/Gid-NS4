import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class EB extends React.Component {
  state = { err: null }
  static getDerivedStateFromError(e) { return { err: e } }
  render() {
    if (this.state.err) return (
      <div style={{color:'red',padding:20,background:'#111',height:'100vh',overflow:'auto'}}>
        <b>ERREUR:</b><br/>
        {this.state.err.message}<br/><br/>
        <pre style={{fontSize:10}}>{this.state.err.stack}</pre>
      </div>
    )
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <EB><App /></EB>
)
