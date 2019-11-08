import React, {Component} from 'react';
import './Graph.css'
import * as d3 from "d3";

class Graph extends Component {
    constructor(props){
        super(props);
        this.state = {
            interacted:false,
        }
    }
    componentDidMount(){
        // Once component is mounted draw
        this._draw();
    }
    componentDidUpdate(prevProps) {
        // Draw updataed props data
        this._draw();
    }

    _draw(){
        this._clear(); // Clear before drawing
        // Dimension Information
        const data = this.props.data;
        const svg = d3.select("#line-graph")
        const margin = {top:10,right:10,left:50,bottom:50};
        const width =(window.innerWidth*.75) 
            - margin["left"] - margin["right"];
        const height = parseInt(svg.attr('height'),10) - margin["top"] - margin["bottom"];
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        //x axis  
        const xScale = d3.scaleTime()
            .domain([new Date(data[0]["Year"]), new Date(data[data.length-1]["Year"])])
            .range([0,width]);
        const xAxis = d3.axisBottom(xScale);
        const xAxisG = g.append('g').call(xAxis)
            .attr('class','axis x-axis')
            .attr('transform', `translate(0, ${height})`);
        g.append("g")			
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis
                .tickSize(-height)
                .tickFormat("")
            )
        g.append("text")             
            .attr("transform","translate(" + (width/2) 
                + " ," + (height + margin.bottom - 10) + ")")
            .attr("class", "axis-label")
            .text("Year");
        
        // y axis
        const yScale = d3.scaleLinear()
            .domain([0,100])
            .range([height,0]);
        const yAxis = d3.axisLeft(yScale)
            .ticks(5);
        const yAxisG = g.append('g').call(yAxis)
            .attr('class','axis y-axis');
        g.append("g")			
            .attr("class", "grid")
            .call(yAxis
                .tickSize(-width)
                .tickFormat("")
            )
        g.append("text")             
            .attr("y",-margin.left + 20)
            .attr("x",0 - (height / 2))
            .attr("transform", "rotate(-90)")
            .attr("class", "axis-label")
            .text("Total Score");
    
        // line generation
        const lineGenerator = d3.line()
            .x(d => xScale(new Date(d["Year"])))
            .y(d => yScale(parseInt(d["Total Score"])))
            .curve(d3.curveStep);
        const line = g.append("path")
            .attr('class', 'line-path')
            .attr('d', lineGenerator(data));
  
        // circle functionality
        g.selectAll('circle').data(data)
            .enter().append('circle')
            .attr('cy', d => yScale(parseInt(d["Total Score"])))
            .attr('cx', d => xScale(new Date(d["Year"])))
            .attr('r', 4)
            .on("mouseover", function(){
                var circle =  d3.select(this);
                var d = circle.data()[0];
                var x = xScale(new Date(d["Year"]));
                var xOffset = (x > width/2) ? (x-width/2): 0;
                var yOffset = (yScale(parseInt(d["Total Score"])) > height/2) ? -30: 20;

                circle.attr('r', 12);
                g.append("text")
                    .attr('x', x - xOffset)
                    .attr('y', yScale(parseInt(d["Total Score"])) - yOffset)
                    .attr("fill","black")
                    .attr("class","graph-selection")
                    .text("Score "+ d["Total Score"] + ", " 
                        + d["Year"] + " " + d["Make"] + " " + d["Model"]);
            })
            .on("mouseout", function(){
                d3.select(this)
                    .transition()
                    .attr('r', 4)
                d3.selectAll(".graph-selection")
                    .transition()
                    .delay(5)
                    .style("opacity","0")
                    .remove();
            });

  
    }
    _clear(){
        d3.selectAll(".axis").remove();
        d3.select(".line-path").remove();
        d3.selectAll("circle").remove();
        d3.selectAll(".grid").remove();
    }
    render() {
        return (
            <div>
                <svg id="line-graph" width="75%" height="400px"/>
            </div>
        );
    }
}

export default Graph;