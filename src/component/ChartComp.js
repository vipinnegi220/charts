import React, { Component } from 'react'
import Chart from "react-apexcharts";

export default class ChartComp extends Component {
  constructor(props){
  super(props);

  this.state = {
    totalDataChart: {
      options: {
          chart: {
              id: 'area-datetime',
          },
          grid: {
              show: false
          }, title: {
              text: "lyra-finance",
              style: {
                  fontSize: '14px', fontWeight: 'bold', color: "#fcdf03"
              }
          }, stroke: {
              curve: 'smooth'
          }, xaxis: {
              type: "datetime"
          }, dataLabels: {
              enabled: false
          }, yaxis: {
              show: false
          }, colors: ["#fcdf03"],
          tooltip: {
              y: {
                  formatter: (value) => { return value.toFixed(2) }
              }, theme: "dark"
          }, selection: 365,
      },
      series: [
          {
              name: 'Market Price',
              data: [[]]

          }
      ]
  }
  
  }
  };

  fetchData = async () => {
    let chartData = await fetch('https://api.llama.fi/summary/fees/lyra?dataType=dailyFees');
    let jsonChartData = await chartData.json()
    this.setState({ totalDataChart: { options: this.state.totalDataChart, series: [{ name: 'Market Price', data: jsonChartData.totalDataChart }] } })
   

}


componentDidMount() {
    this.fetchData()
    this.interval = setInterval(() => this.fetchData(), 2000);
}
  render() {
    return (
      <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={this.state.totalDataChart.options}
            series={this.state.totalDataChart.series}
            type="area"
            width="1500"
            height="500"
          />
        </div>
      </div>
    </div>
    )
  }
}
