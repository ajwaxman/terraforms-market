import logo from './logo.svg';
import './App.css';
import testData from './testData.json';
import '@themesberg/flowbite';
import { useEffect, useMemo, useState } from "react";
import React from 'react';
import { render } from '@testing-library/react';
import { orderBy } from 'lodash'



let originalData = testData.results;


// console.log(originalData);
// console.log(sortedByPrice);
// console.log(sortedById);
// console.log(sortedBySeed);

// console.log("Sorted data");
// console.log(sortedData);


class Header extends React.Component {
  render() {
    return (
      < div className = "bg-white" >
        <div className="max-w-7xl mx-auto py-8 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight lg:text-3xl">🌱 Terraforms Seed Finder.</p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">Find hidden gems without the hassle. </p>
          </div>
        </div>
      </div >
    );
  }
}

class ListContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = { data: originalData }
    this.handleChange = this.handleChange.bind(this);
  }

  // const _ = require('lodash');
  // let sortedByPrice = _.orderBy(originalData, 'price', 'asc')
  // let sortedById = _.orderBy(originalData, "id", 'asc');
  // let sortedBySeed = _.orderBy(originalData, "seed", 'desc');

  handleChange(event) {
    this.setState({ value: event.target.value });
    console.log("Calling handle change from ListSort");
    // console.log(this.state.data);
    console.log(this.state.value);
  }

  render() {
    return(
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="-ml-4 -mt-2 mb-6 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Listings
            </h3>
          </div>
          <div className="ml-4 mt-2 flex-shrink-0">
            <div>
              <span className="font-bold text-sm text-gray-700">Sort By:</span>
              <select defaultValue="0" value={this.state.value} onChange={this.handleChange} id="sort" name="sort" className=" ml-4 mt-1 inline w-36 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md">
                <option value="0" label="Price">Price</option>
                <option value="1" label="Seed">Seed</option>
                <option value="2" label="ID">ID</option>
              </select>
            </div>
          </div>
        </div>
        <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {originalData.map((terraform) => (
            <li className="relative" key={terraform.id}>
              <div className="group block w-full aspect-w-7 aspect-h-10 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-gray-500 overflow-hidden">
                <img src="/terraform.png" alt="" className="object-cover pointer-events-none group-hover:opacity-75"></img>
              </div>
              <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">Terraform #{terraform.id}</p>
              <p className="block text-sm font-medium text-gray-600 pointer-events-none">Seed: {terraform.seed} · <img alt="ETH" className="h-3 mb-0.5 mr-1 ml-1 inline" src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg" size="1"></img>{terraform.price}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

}



function App() { 

  return (
    <div className="App">
      <Header></Header>
      <ListContainer></ListContainer>
    </div>
  );
}

export default App;
