import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { getUser, storeUser, deleteUser} from '../auth.js';
import { BASE_URL } from '../config.js';

class LoginWidget extends LitElement {
  static properties = {
    loginUrl: { type: String },
    user: {type: String, state: true }
  }

  static styles = css`
    :host {
        display: block;
        box-shadow: rgba(0, 0, 0, 0.22) 0px 3px 4px -2px;
      max-width: 400px;
      margin: auto auto 30px;
      padding: 30px 15px;
      background: white;
    }
    form{
      
    }
    p strong{
      color: rgb(166, 25, 46);
    }
    
    .login-btn, button{
      font-family: 'DynaPuff';
      background: rgb(166, 25, 46);
      color: white;
      box-shadow: none;
      border: 0px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 8px 20px;
      border-radius: 30px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      transition: all .3s
    }
    .login-btn:hover, button:hover{
      background:black;
    }
    p{
      text-align: center;
    color: rgb(100, 100, 100);
    font-size:14px;
    }
    input[name='username'],input[name='password']{
      width: calc(100% - 30px);
      display: block;
      background: rgb(243, 242, 238);
      border: 0px;
      border-radius: 20px;
      height: 40px;
      color: black;
      margin-bottom: 20px;
      padding: 0px 15px;
      font-family: 'DynaPuff';
    }
    h1{
      color: #373a36;
    font-size: 20px;
    }
    `;

  constructor() {
    super();
    this.loginUrl = `${BASE_URL}users/login`;
    this.user = getUser();
  }

  submitForm(event) { 
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    fetch(this.loginUrl, {
        method: 'post',
        body: JSON.stringify({username, password}),
        headers: {'Content-Type': 'application/json'}
    }).then(result => result.json()).then(response => {
        this.user = response;
        storeUser(response);
    })
  }

  logout() {
    deleteUser();
    this.user = null;
  }

  render() {
    if (this.user) {
        return html`<p>Logged in as <strong>${this.user.name}</strong></p><button @click=${this.logout}>Logout</button>`
    } 
    return html`
    
      <form @submit=${this.submitForm}>
      <h1>Login to COMP2110 Portal</h1>
          <input name="username" placeholder="Username">
          <input type="password" name="password" placeholder="Password">
          <input type='submit' value='Login' class="login-btn">
      </form>`;
    
  }
}


customElements.define('login-widget',  LoginWidget);