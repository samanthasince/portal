import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

class IPAddresWidget extends LitElement {
  static properties = {
    _data: {type: Array, state: true},
  }

  static BASE_URL='https://api.ipify.org/?format=json';

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
  }

  connectedCallback(){
    super.connectedCallback();
        fetch(IPAddresWidget.BASE_URL)
          .then(response => response.json())
          .then(data => {
              this._data = data; 
          });
    
    
  }
  render() {
    if(this._data){
      return html`
      <h2>Your Public IP Address:</h2>
       <p>${this._data.ip}</p>
      `
    }
    else{
      return html `
      <p>Loading...</p>
      `
    }
  }
}

customElements.define('widget-ipaddress', IPAddresWidget);