import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

class DateWidget extends LitElement {
  static properties = {
    month: {type: Number},
    day: {type: Number},
    _data: {type: Array, state: true},
  }

  static BASE_URL='http://numbersapi.com/';

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
  p{
    text-align: center;
    color: rgb(100, 100, 100);
    font-size:14px;
    font-family: 'Jost';
  }
  h2{
    color: #373a36;
  font-size: 20px;
  }
  `;

  constructor() {
    super();
    const currentDate = new Date();
    this.month= currentDate.getMonth()+1;
    this.day= currentDate.getDate();
    console.log(this.month, this.day);
  }

  async connectedCallback(){
    super.connectedCallback();
    const url = DateWidget.BASE_URL+this.month+'/'+this.day+'/date';
    console.log('log',url);
    const response = await fetch(url);
     this._data = await response.text();
    console.log(this._data);
    
  }


  render() {
    return html`
      <h2>Random fact on this day</h2>
      <p>${this._data}</p>
    `
  }
}

customElements.define('widget-date', DateWidget);