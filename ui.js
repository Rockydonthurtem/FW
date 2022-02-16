'use strict';
const React = require('react');
const Table = require('ink-table')
const {useState, useEffect} = require('react');
const axios = require('axios');
const {Text, Newline} = require('ink');
const csv = require('csv-parser');
const fs = require('fs');
const { readCharities, readProfile } = require("./read-helpers");
const App = ({charities, profileInfo}) => {

	const [randomCharities, setRandomCharities] = useState([])
	let twelveRandomCharities = []
	let hasAniamlRelated = []
	useEffect(() => {
		let allCharities = []
		let getProfile = ""

		const promise1 = readCharities(charities).then((res) => {allCharities.push(res)})
		const promise2 = readProfile(profileInfo).then((res) => {getProfile = res})
		Promise.all([promise1, promise2]).then((values) => {
			handleCharity(allCharities, getProfile)
		});
	}, [])

	const handleCharity = (charityGroup, profileGroup) => {
		
		charityGroup = charityGroup.flat() 
		const parsedData = [];
		for(let row of charityGroup){
			parsedData.push(row)
		}
		
		let countAnimalRelated = 0
		let newAnimalArr = ""
		for (let j = 0; j < charityGroup.length; j++) {
			let animalRandomIndex = Math.floor(Math.random() * charityGroup.length)
			
			if(countAnimalRelated < 4){
				if(charityGroup[animalRandomIndex].category == 'ANIMAL_RELATED'){					
					hasAniamlRelated.push(charityGroup.splice(animalRandomIndex,1))
					countAnimalRelated = countAnimalRelated + 1
				}
			}
		}
		
		let maxLength = 12 - hasAniamlRelated.length 

		for (let i = 0; i < maxLength; i++) {
			let randomIndex = Math.floor(Math.random() * charityGroup.length)
			let count = 0
			if(profileGroup.state.toLowerCase() == charityGroup[randomIndex]['state'].toLowerCase()){
				count = count + 1
			}
			if(count < 5 && profileGroup.state.toLowerCase() == charityGroup[randomIndex]['state'].toLowerCase()){continue;}
			twelveRandomCharities.push(charityGroup[randomIndex])
		}

		setRandomCharities([...twelveRandomCharities, ...hasAniamlRelated].flat(1))
	}
		let test = randomCharities.map((charity,i) => (
			<Text key={i}>
				{charity.id} | {charity.name} | {charity.state} | {charity.category} | {charity.feature}
 				<Newline />
			</Text>
		))
		
	return (<Text>{test}</Text>)
}

module.exports = App;
