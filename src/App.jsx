import logo from './logo.svg';
import './App.css';
import testData from './testData.json';
import '@themesberg/flowbite';
import { useEffect, useMemo, useState } from "react";
import React from 'react';
import { render } from '@testing-library/react';
import { orderBy, chunk, flatten } from 'lodash'
import longLoopIds from './data/long-loops.json'
import longLoopIdsWithSeed from './data/long-loops-with-seed.json'
import { findRenderedComponentWithType } from 'react-dom/test-utils';
import { utils as etherUtils, BigNumber } from 'ethers'

let longLoopBatchOne = longLoopIds.slice(0,20);
let longLoopBatchTwo = longLoopIds.slice(20,40);
let longLoopBatchThree = longLoopIds.slice(40,longLoopIds.length);

let longLoopsApiData = [];
let longLoops = [];



class Terraform {
  constructor (id, price, seed, image, link) {
    this.id = id;
    this.price = price;
    this.seed = seed;
    this.image = image;
    this.link = link;
    longLoops.push(this);
  }
}


const options = { method: 'GET' };

let batchOneUrl = 'https://api.opensea.io/api/v1/assets?collection=terraforms&'
batchOneUrl += longLoopBatchOne.map((id) => `token_ids=${id}`).join('&')

let batchTwoUrl = 'https://api.opensea.io/api/v1/assets?collection=terraforms&'
batchTwoUrl += longLoopBatchTwo.map((id) => `token_ids=${id}`).join('&')


const fetchTerraForms = async (ids: string[]) => {
  let url = 'https://api.opensea.io/api/v1/assets?collection=terraforms&'
  url += ids.map((id) => `token_ids=${id}`).join('&')

  const res = await fetch(url, options);
  const json = await res.json();
  let newArray = longLoopsApiData.concat(json.assets);
  longLoopsApiData = newArray;
  return json.assets;
}

async function fetchLongLoops() {
  await fetchTerraForms(longLoopBatchOne);
  await fetchTerraForms(longLoopBatchTwo);
  await fetchTerraForms(longLoopBatchThree);
  await longLoopsApiData.forEach((t, index) => {
    if (t.sell_orders) {
      // console.log(t);
      // console.log(t);
      new Terraform(
        t.token_id,
        etherUtils.formatUnits(BigNumber.from(t.sell_orders[0].current_price.split('.')[0])),
        longLoopIdsWithSeed[0][t.token_id]["seed"],
        t.image_url,
        t.permalink
      );
    }
  });
  // await longLoopIdsWithSeed.forEach((i, index) => {
  //   console.log(i);
  // });
  await console.log(longLoops)

}

fetchLongLoops()


class Header extends React.Component {
  render() {
    return (
      < div className = "bg-white" >
        <div className="max-w-7xl mx-auto py-8 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight lg:text-3xl">🌱 Seed Sniper.</p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">Find hidden gems.</p>
          </div>
        </div>
      </div >
    );
  }
}

class ListContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = { data: longLoops, fetchInProgress: true }
    this.state.value = "price";
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    console.log("componentDidMount");
    console.log(longLoops);
    console.log(this.fetchInProgress);
    console.log(this.state.fetchInProgress);
  }

  componentWillUnmount() {
    console.log("componentWillUnount");
    console.log(longLoops);
  }

  componentDidUpdate() {
    console.log("componentDidUpdate");
    console.log(longLoops);
  }


  // const _ = require('lodash');
  // let sortedByPrice = _.orderBy(originalData, 'price', 'asc')
  // let sortedById = _.orderBy(originalData, "id", 'asc');
  // let sortedBySeed = _.orderBy(originalData, "seed", 'desc');

  handleChange(event) {
    const _ = require('lodash');
    // console.log(event.target.value);
    this.state.value = event.target.value;
    this.setState({ value: event.target.value });
    switch (this.state.value) {
      case "price":
        console.log("sort by price");
        this.state.data = _.orderBy(longLoops, item => parseFloat(item.price), 'asc');
        break;
      case "seed":
        console.log("sort by seed");
        this.state.data = _.orderBy(longLoops, "seed", 'desc');
        break;
      default:
        console.log("sort by id");
        this.state.data = _.orderBy(longLoops, "id", 'asc');
        break;
    }
  }

  render() {

    if (!this.state.fetchInProgress){
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
                <select value={this.state.value} onChange={this.handleChange} id="sort" name="sort" className=" ml-4 mt-1 inline w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md">
                  <option value="price" label="Price (Low to High)">Price (Low to High)</option>
                  <option value="seed" label="Seed (High to Low)">Seed (High to Low)</option>
                  {/* <option value="id" label="ID">ID</option> */}
                </select>
              </div>
            </div>
          </div>
          <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            {this.state.data.map((terraform) => (
              <li className="relative" key={terraform.id}>
                <div className="cursor-pointer group block w-full aspect-w-7 aspect-h-10 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-gray-500 overflow-hidden">
                  <img src={terraform.image} alt="" className="object-cover pointer-events-none group-hover:opacity-75"></img>
                </div>
                <button type="button" className="absolute inset-0 focus:outline-none">
                  <span className="sr-only">View Terraform DetailsC</span>
                </button>
                <p className="mt-2 block text-sm font-medium text-gray-900 pointer-events-none">Seed: {terraform.seed} · <img alt="ETH" className="h-3 mb-0.5 mr-1 ml-1 inline" src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg" size="1"></img>{terraform.price}</p>
                <p className="mt-o block text-sm font-medium text-gray-600 truncate pointer-events-none">Terraform #{terraform.id}</p>
              </li>
            ))}
          </ul>
        </div>
      );

    } else {
      return (
        <div className="h-56 grid grid-cols-1 gap-4 content-center">
          <img className="items-center" style={{margin: "0 auto"}} src="/42.gif"></img>
          <p font-bold>Locating the rares...</p>
        </div>
      )
    }
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
