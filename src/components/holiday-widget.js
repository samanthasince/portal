import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

class HolidayWidget extends LitElement {
  static properties = {
    header: { type: String },
    _country: {type: String, state: true},
    _data: {type: Array, state: true},
    _split: {type: Array, state: true},
    regionNames: {type: String, state: true},
    _optionCountry: {type: Array},
    selectedCountry:{type:String, state: true},
  }

  static BASE_URL='https://date.nager.at/api/v2/publicholidays/2023/';

  static styles = css`
    :host {
      display: block;
      background-color: rgb(243, 242, 238);
      padding: 15px;
      color: rgb(100, 100, 100);
      font-size:14px;
      box-shadow: 0 3px 4px -2px rgba(0,0,0,.22);
      margin-bottom:20px;
    }
    table{
      text-align: left;
    }
    table,th,td,tr {
      border: 1px solid transparent;
      border-collapse: collapse;
  }
  td,th{
    padding:5px;
  }
  td{
    font-size: 14px;
    font-family: 'Jost';
  }
  h1{
    color: #373a36;
    font-size: 20px;
  }
  select{
    background: #f6f6f6;
    color: black;
    border-radius: 5px;
    letter-spacing: 0.05em;
    padding: 5px;
    margin-bottom:20px;
  }
  label{
    color: rgb(100, 100, 100);
    font-size:14px;
    margin-bottom: 8px;
    display: block;
  }
  thead{
    background: gray;
    color:white;
  }
  tbody tr:nth-child(even){
    background:rgb(215, 215, 215);
  }
  `;

  constructor() {
    super();
    this._country= 'AU';
    this.selectedCountry="AU";
    this.regionNames = new Intl.DisplayNames(
      ['en'], {type: 'region'}
    );
  }

  connectedCallback(){
    super.connectedCallback();
    this.renderAllCountry();
    this.renderCountry();
    
    
  }

  changeCountry(e){
    this._country=e.target.value;
    console.log(this._country);
    this.renderCountry();
  }

  renderCountry(){
    const url = HolidayWidget.BASE_URL+this._country;
    console.log('log',url);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            this._data = data; 
        });
  }

  renderAllCountry(){
    const apiUrl = 'https://date.nager.at/api/v3/AvailableCountries';
    fetch(apiUrl)
      .then(response => response.json())
      .then(countries => {
        this._optionCountry = countries;
      })
  }

  render() {
    if(this._data){
        return html`
        <h1>Public Holiday in ${this.regionNames.of(this._country)}</h1>
        <label>Select Country: </label>
        <select @change=${this.changeCountry}>
        ${
          this._optionCountry.map(country => 
            
            country.countryCode ==="AU" ?
            html `<option value="${country.countryCode}" selected> ${country.name}
            </option>`
            :
            html
            `<option value="${country.countryCode}" > ${country.name}
            </option> `

          
        ) };
        
        </select>
        <table>
          <tr>
            <thead>
              <th>Date</th>
              <th>Public Holiday</th>
              <th>Counties</th>
            </thead>
          </tr>
          <tbody>
            ${this._data.map(item => html`
            <tr>
              
                  <td>${item.date}</td>
                  <td>${item.name}</td>
                  <td>${item.counties || 'All'}</td>
              
            </tr>
            `)}
            </tbody>
          </table>  
        `;  
    }
    else{
        return html`
        <p>Loading...</p>
        `
    }
  }
}

customElements.define('widget-holiday', HolidayWidget);