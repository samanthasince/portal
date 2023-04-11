import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

class WeatherWidget extends LitElement {
  static properties = {
    _data: {type: Array, state: true},
    _cityData: {type: Array, state: true},
    longitude: {type: Number, state: true },
    latitude: {type: Number, state: true},
    image: {type: String, state: true},
  }

  static BASE_URL='https://api.open-meteo.com/v1/forecast?';
  static city_URL='https://get.geojs.io/v1/ip/geo.json';

  static styles = css`
  :host {
    display: block;
    background-color: rgb(243, 242, 238);
    padding: 15px;
    color: rgb(100, 100, 100);
    font-size:14px;
    box-shadow: 0 3px 4px -2px rgba(0,0,0,.22);
    margin-bottom:20px;
    background-image: var(--my-custom-element-background-image)    ;
    border-radius: 20px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: bottom;
  }
  p{
    text-align: center;
    color: rgb(100, 100, 100);
    font-size:14px;
    font-family: 'Jost';
  }
  h1{
    color: #373a36;
  font-size: 20px;
  color:white;
  }
  .temp{
    color: white;
    font-size: 50px;
    margin: 0;
  }
  .location{
    font-size: 30px;
    color: white;
    margin: 0px;
  }
  .date{
    color: white;
    margin: 0;
    font-size: 18px;
  }
  .more-info p{
    color:white;
    
  }
  .more-info p:first-child{
    margin-right:8px;
    
  }
  .more-info{
    display:flex;
    justify-content: center;
    
  }
  `;

  constructor() {
    super();
    const date = new Date();
    console.log(date.getHours());
    if(date.getHours()>=7 && date.getHours()<19){
      
      this.image='https://media.istockphoto.com/id/947314334/photo/blue-sky-with-bright-sun.jpg?s=612x612&w=0&k=20&c=XUlLAWDXBLYdTGIl6g_qHQ9IBBw4fBvkVuvL2dmVXQw=';
    }
    else{
      
      this.image='https://images.unsplash.com/photo-1617375996248-0e57941f3f3c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bmlnaHQlMjB0aW1lfGVufDB8fDB8fA%3D%3D&w=1000&q=80'
    
    }
    

      this.longitude=151.1147422;
    this.latitude=-32.7813283;

      this.fetchWeather();
 
    
  }

  connectedCallback(){
    super.connectedCallback();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log(`Latitude: ${this.latitude}`);
        console.log(`Longitude: ${this.longitude}`);
        this.fetchWeather();
       
      }, error => {
        console.error(error);
      });
      
   
    };
    
  }
  fetchWeather() {
    const url = WeatherWidget.BASE_URL+"latitude="+this.latitude+"&longitude="+this.longitude+"&current_weather=true";
    console.log(url);
    fetch(url)
      .then(response => response.json())
      .then(data => {
          this._data = data.current_weather; 
      });
      fetch(WeatherWidget.city_URL)
      .then(response => response.json())
      .then(data => {
          this._cityData = data.city; 
      });
  }
  render() {
    
    const date = new Date();

    const currentDay= String(date.getDate()).padStart(2, '0');

    const currentMonth = String(date.getMonth()+1).padStart(2,"0");

    const currentYear = date.getFullYear();

    const currentDate = `${currentDay}/${currentMonth}/${currentYear}`;

    if(this._data){
      return html`
      <style>
          :host {
            --my-custom-element-background-image: url('${this.image}');
          }
        </style>
      <div class="weather-widget">
      <p class="location">${this._cityData}</p>
        <p class="temp">${this._data.temperature}°</p>
        <p class="date">${currentDate}</p>
        <div class="more-info">
        <p>Windspeed: ${this._data.windspeed}</p>
        <p>Wind Direction: ${this._data.winddirection}</p>
        </div>
       
      </div>
        
      `
    }
    else{
      return html `
      <p>Loading...</p>
      `
    }
  }
}

customElements.define('widget-weather', WeatherWidget);