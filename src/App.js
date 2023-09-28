import React, { Component } from 'react'
import  ChartComp from './component/ChartComp';

export default class App extends Component {
constructor(){
  super();
  this.state={
    name: "lyra",
    Data: {}
  }

}

fetchData =async()=>{
  let data = await fetch('https://api.llama.fi/summary/fees/lyra?dataType=dailyFees');
  let jsonData= await data.json();
  this.setState({name:this.state.name,Data:jsonData})
}

componentDidMount(){
  this.fetchData()
}
  render() {
    return (
      <div>
       <ChartComp/>
      </div>
    )
  }
}
