import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import './components/widget-block.js';
import './components/blog-block.js';
import './components/widget-column.js';
import './components/ad-widget.js';
import './components/login-widget.js';
import './components/holiday-widget.js';
import './components/date-widget.js';
import './components/weather-widget.js';
import './components/currency-widget.js';
import './components/ipaddress-widget.js';
import './components/task-widget.js';

class Comp2110Portal extends LitElement {
  static properties = {
    header: { type: String },
  }

  static styles = css`
    :host {
      min-height: 100vh;   
      font-size: 14pt;
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: lightgoldenrodyellow;
    }

    main {
      display: flex;
      padding: 0 15px;
    }

    .app-footer {
      font-size: 12px;
      align-items: center;
      background: black;
      color: white;
      margin: 0;
      padding: 10px 0;
      letter-spacing: 0.05em;
      margin-top: 30px;
    }

    .app-footer a {
      margin-left: 5px;
    }
    header{
      padding: 15px 0px;
      background: black;
      margin-bottom: 30px;
    }
    header img{
      position: absolute;
      left: 30px;
    }
    h1{
      margin: 0px;
      color: white;
      padding: 15px 0;
      font-size: 20px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    @media(max-width:767px){
       main{
          display: block;
      }
      header img {
        position: unset;
    }
    }

  `;

  constructor() {
    super();
    this.header = 'COMP2110 Portal';
  }

  render() {
    return html`
      <header>
      <img src="/../src/assets/images/mqlogo-resized.svg">
        <h1>${this.header}</h1>
        
      </header>

      <main>
        <widget-column>
        <login-widget></login-widget>
        <widget-weather header="Date"></widget-weather>
          
          <widget-holiday header="Holiday"></widget-holiday>
        </widget-column>
        <blog-block></blog-block>       
        <widget-column>
        <task-block></task-block>
        <widget-currency header="First Widget"></widget-currency>
         
          
          <widget-ipaddress header="Fourth Widget"></widget-ipaddress>
          <widget-date header="Date"></widget-date>
          <ad-widget></ad-widget>
        </widget-column>
      </main>

      <p class="app-footer">
        A product of the COMP2110 Web Development Collective &copy; 2023
      </p>
    `;
  }
}

customElements.define('comp2110-portal', Comp2110Portal);