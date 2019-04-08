import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
class App extends Component {

  constructor(props){
    super(props);
    this.state={
      searchInput:'',
      recommendations:[]
    }
    this.onInput = this.onInput.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }


  onInput(e){
    this.setState({
      searchInput:e.target.value
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
							'rating': venueResponse.rating
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
    return (
		<div className="uk-container uk-fex uk-flex-center uk-padding App">
			<div>
        <h2>Lunch Place</h2>
        <p>Choose a venue for lunch, highest votes is your lunch destination today!.</p>
				<div className="search-box uk-flex uk-flex-center">
          <div className="uk-search uk-search-default uk-flex uk-width-1-3">
				  	<input className="uk-search-input" type="search"  value={this.state.searchInput} placeholder="Where?" onChange={this.onInput} />
						<button type="submit" onClick={this.onSearch} className="uk-button uk-button-primary">Search</button>
						</div>
					</div>
				<div className="searchResults uk-flex uk-flex-center">
					<table className="uk-table uk-width-5-6">
						<thead>
							<tr>
								{this.state.recommendations.map((venue,i) => 
								(
								<th>
									<h2>{venue.name}</h2>
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
							<tr>
								<td>

								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
}

export default App;
