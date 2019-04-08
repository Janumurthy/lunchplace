import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
class App extends Component {

  constructor(props){
    super(props);
    this.state={
      searchInput:'',
			recommendations:[],
			participants:[],
			name:'',
			optVenue:''
    }
    this.onChange = this.onChange.bind(this);
	this.onSearch = this.onSearch.bind(this);
	this.addParticipant = this.addParticipant.bind(this);
  }


  onChange(e){
    this.setState({
      [e.target.name]:e.target.value
    })
  }

  addParticipant(){
		const participantsArr = this.state.participants;
	  participantsArr.push({
			name:this.state.name,
			option:this.state.optVenue
		})
		/*Update the optedBy for each venue based on the options chosen by participants */
		this.state.recommendations.map((venue,i) => {
			console.log(i)
			this.state.participants.forEach(participant => {
				console.log(participant.option);
				if(participant.option == i){
					venue.optedBy+=1;
					console.log(venue.optedBy);
				}
			});
		});
		console.log(this.state.recommendations);
	  this.setState({
			participants:participantsArr
	  })
  }

  onSearch(){
      //Nullify state for every search to avoid concantenation of results*/
      this.state.recommendations=[];
      const params={
          client_id:'SXRAZRB5WMNUECIOO2CU0YSWT1RK4ZECXSTLWSVPWIFRCQSE' ,
          client_secret:'IE3NIO4PNHDB3X52J5VB5Y15MSKE2IUZQ4FD2ZUL4ZFOOUWN',
          near: `${this.state.searchInput}`,
          query: 'lunch',
          v: '20180323',
          limit:3
      }
      /*Get most popular 3 venues based on the geo code */
      const urlParam = 'https://api.foursquare.com/v2/venues/search?' + new URLSearchParams(params);
      $.ajax({
        method: 'GET',
        url: urlParam,
        success: ((result)=>{
          if(result.response.venues){
    
            result.response.venues.forEach(venue => {
              const params={
                client_id:'SXRAZRB5WMNUECIOO2CU0YSWT1RK4ZECXSTLWSVPWIFRCQSE' ,
                client_secret:'IE3NIO4PNHDB3X52J5VB5Y15MSKE2IUZQ4FD2ZUL4ZFOOUWN',
                v: '20180323',
              }
              /*Get venue specific details like URL, Category and Rating for each venue*/
              const getVenueDetails =  'https://api.foursquare.com/v2/venues/'+venue.id + '?' + new URLSearchParams(params);
              $.ajax({
                  method: 'GET',
                  url: getVenueDetails,
                  success: ((result)=>{
					const venues = this.state.recommendations;
					const venueResponse = result.response.venue;
					if(venueResponse){
						venues.push({
							'id': venue.id,
							'name': venue.name,
							'category': venueResponse.categories[0] ? venueResponse.categories[0].name : '', 
							'url': venueResponse.url,
							'rating': venueResponse.rating,
							'optedBy':0
						});
						console.log(venues);
						this.setState({
							recommendations: venues  
						})
					}
                }),
                error: ((error)=>{
                  console.log(error);
                })
              });  
            });
            
          }
        }), 
        error: ((error)=>{
          console.log(error);
        })
    });

}
  
  render() {
	console.log(this.state.recommendations);
	console.log(this.state.participants);
    return (
		<div className="uk-container uk-fex uk-flex-center uk-padding App">
			<div>
				<h2>Lunch Place</h2>
				<p>Choose a venue for lunch, highest votes is your lunch destination today!.</p>
				<div className="search-box uk-flex uk-flex-center">
					<div className="uk-search uk-search-default uk-flex uk-width-1-3">
						<input className="uk-search-input" type="search" name="searchInput" value={this.state.searchInput} placeholder="Where?" onChange={this.onChange} />
						<button type="submit" onClick={this.onSearch} className="uk-button uk-button-primary">Search</button>
					</div>
				</div>
				{this.state.recommendations.length ? 
					<div className="searchResults uk-flex uk-flex-center">
						<div>
							<table className="uk-table uk-width-5-6">
								<thead>
									<tr>
										<th>Participants</th>
										{this.state.recommendations.map((venue,i) => 
										(
										<th key={i}>
										{venue.url ?
										<h2><a href={venue.url} target="_blank">{venue.name}</a>	</h2>
										:
										<h2>{venue.name}</h2>
										}
										{venue.category ?
											<p>{venue.category}</p>
											: null
										}
										{venue.rating ?
											<p>{venue.rating}</p>
											: null
										}
										</th>
										))}
									</tr>
								</thead>
								<tbody>
									{this.state.participants.length ? this.state.participants.map((participant,i) => (
										<tr>
											<td>
												<p>{participant.name}</p>
											</td>
											{this.state.recommendations.map((venue,i)=>(
												<td>{i==participant.option ? 'Yes' : 'No'}</td>
											))}
										</tr>
									)):''}
									<tr>
										<td>
											<input className="uk-width-1-1" type="text" name="name" defaultValue='' value={this.state.name} placeholder="" onChange={this.onChange}/>
										</td>
										<td>
											<div class="radio">
												<input type="radio" id='0' name="optVenue" value="0" onChange={this.onChange}/>
											</div>
										</td>
										<td>
											<div class="radio">
												<input type="radio" id='1' name="optVenue"  value="1" onChange={this.onChange}/>
											</div>
										</td>
										<td>
											<div class="radio">
												<input type="radio" id='2' name="optVenue"  value="2" onChange={this.onChange}/>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
							<button type="button" className="uk-button uk-button-secondary" onClick={this.addParticipant}>Add Participant</button>
						</div>
					</div>
				:
				''
				}
			</div>
		</div>
	);
}
}

export default App;
