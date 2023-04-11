/**
 * A Blog widget that displays blog posts pulled from 
 * an API
 * 
 * <blog-block></blog-block>
 */

import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { BASE_URL } from '../config.js';
import { getUser } from '../auth.js';

class BlockBlock extends LitElement {

  static properties = {
    _posts: { state: true },
    user: {state: true},
    _tasks: { state: true },
    auth: {state: true},
    showForm: {state: true},
  }

  static styles = [
    css`
 
  :host {
    margin: 1em;
  }
  .blogpost {
    text-align: left;
    background: white;
    padding: 10px 20px;
    border: 1px solid #d7d8d7;
    margin-bottom: 25px;
    border-bottom: 3px solid #a6192e;
  }
  .blogpost h2 {
    text-transform: capitalize;
    color: rgb(166, 25, 46);
    font-weight: bold;
  }
  .blogpost h3 {
    text-transform: capitalize;
    font-size: 16px;
    color: rgb(100, 100, 100);
  }
  .blogpost p {
    font-size: 18px;
    color: #252525;
    letter-spacing: 0.03em;
    font-family: 'Jost', sans-serif;

  }
  .logon{
    font-style: italic;
    background-image: linear-gradient(180deg,#828282,#646464);
    padding: 10px;
    color: white;
    border-radius: 5px;
    font-size: 14px;
  }
  #blog-form{
    display: block;
    box-shadow: rgba(0, 0, 0, 0.22) 0px 3px 4px -2px;
    margin: auto auto 30px;
    padding: 30px 15px;
    background-image: url(https://marketing.ttw.com.au/hubfs/Imported%20sitepage%20images/Projects/Featured/Macquarie-University-Library-C3C-1.jpg);
    background-repeat: no-repeat;
    background-size: cover;
  }
  .inner-div{
    max-width: 400px;
    margin: auto;
    background: rgba(255, 255, 255, 0.6);
    padding: 30px;
    border-radius: 30px;
  }
  label{
    display: block;
    text-align: left;
    color: black;
    font-size:14px;
    margin-bottom: 8px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  input{
    width: calc(100% - 30px);
      display: block;
      background: rgb(243, 242, 238);
      border: 0px;
      height: 40px;
      color: black;
      margin-bottom: 20px;
      padding: 0px 15px;
      font-family: 'DynaPuff', cursive;
  }
  textarea{
    width: calc(100% - 30px);
      display: block;
      background: rgb(243, 242, 238);
      border: 0px;
      height: 100px;
      color: black;
      margin-bottom: 20px;
      padding: 0px 15px;
      font-family: 'DynaPuff', cursive;
  }
  button{
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
  h1{
    color: #373a36;
  font-size: 20px;
  }
  `]

  constructor() {
    super();
    this.showForm=false;
   this.fetchData();
   
  }
  connectedCallback(){
    super.connectedCallback();
    console.log('Connected callback called!');
    console.log('User event triggered');
    this.user = getUser();
    if(this.user){
      this.auth = this.user.token;
      
    }
    this.requestUpdate();
    window.addEventListener('user', () => {
      this.user = getUser();
      if(this.user){
        this.auth = this.user.token;
      }
      this.showForm=false;
      this.requestUpdate();
     
    });
  }
  fetchData(){
    
    
    const url = `${BASE_URL}blog`;
    fetch(url)
    
        .then(response => response.json())
        .then(posts => {
            this._posts = posts.posts; 
            console.log(this._posts); 
        });

  }
displayForm(){
  this.showForm=true;
}
cancelForm(){
  this.showForm=false;
}
  // A simple formatter that just splits text into paragraphs and 
  // wraps each in a <p> tag
  // a fancier version could use markdown and a third party markdown
  // formatting library
  static formatBody(text) {
    const paragraphs = text.split('\r\n')
    return paragraphs.map(paragraph => html`<p>${paragraph}</p>`)
  }
  
  render() {
    if (!this._posts)
      return html`Loading...`
    
  return html `
  ${this.user?
  html `
  
  ${this.showForm ?
  html `
  <button @click=${this.cancelForm} style="margin-bottom:20px;"><img src="/../src/assets/images/cancel.png" width="12" style="margin-right:5px;    filter: invert(1);"> Cancel New Blog</button>
<form id="blog-form" @submit=${this.submitForm}>
  <div class="inner-div">
  <h1>Post a new blog</h1>
            <label>Title</label>
            <input type="text" name="title" placeholder="Enter blog title">
            <label>Content</label>
            <textarea type="text" name="content"></textarea>
            <button type="submit" value="Post" placeholder="Insert content here...">Post</button>
         </div>
            </form>`
  :
  html `<button @click=${this.displayForm} style="margin-bottom:20px;">+ Add New Blog</button>`
  }
  
  ` :

 html ` <p class="logon">Please log in to post blog...</p>`
  
  }
  
  ${this._posts.map(post => html`<div class="blogpost">
  <h2>${post.title}</h2>
  <h3>By ${post.name}</h3>
  ${BlockBlock.formatBody(post.content)}
</div>`)}

  `

       
      
  }
  submitForm(event){
    event.preventDefault();
    const title = event.target.title.value;
    const content = event.target.content.value;
    const data = {
  
            title:title,
            content:content,

            }

    console.log(JSON.stringify(data));

    fetch('https://comp2110-portal-server.fly.dev/blog/', 
           {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': "Basic " + this.auth
            },
            body: JSON.stringify(data)
        })
    .then(response => response.json())
    .then(data => {

        console.log(data);
        this.fetchData();
    });

   
  }
  
}



customElements.define('blog-block', BlockBlock);

