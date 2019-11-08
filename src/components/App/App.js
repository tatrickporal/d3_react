import React, {Component} from 'react';
import './App.css';
import Graph from '../Graph/Graph';
import ButtonsContainer from '../Button/ButtonsContainer';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            filter:"All",
            allCars: [],
            countries: {}, 
        };
    }

    componentDidMount(){
        fetch("https://gist.githubusercontent.com/scottburton11/66a921c458f9500a773a6b0ac65006df/raw/629bfd6a3125e3428bd85a53231bd8018c407a65/Javascript%2520Working%2520With%2520Data%2520Challenge%2520data")
          .then(resp => resp.json())
          .then(data => {
            var countryHash = {};
            countryHash["All"] = true;
            data.forEach(car =>{
                if(!countryHash[car["Vehicle Country"]])
                    countryHash[car["Vehicle Country"]] = true;
            });
            
            this.setState({
                isLoaded: true,
                allCars: data,
                countries: countryHash
            });
          },
          (error) => {
            console.error(error);
          });
    }

    filterCallback(filter){
        this.setState({filter:filter})
    }

    render() {
        const { error, isLoaded, allCars, countries, filter } = this.state;
        const filteredCars = (filter !== "All") ? 
            allCars.filter(car => car["Vehicle Country"] === filter) : allCars;
        const sortedCars = filteredCars.sort((carA,carB) => carA["Year"] - carB["Year"]);
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className="App">
                    <h1>
                        Car Score by Country over time ( {filter} ) 
                    </h1>
                    <ButtonsContainer buttons={Object.keys(countries)} callback={this.filterCallback.bind(this)}/>
                    <Graph data={sortedCars}/>
                </div>
            );
        }
    }
}

export default App;