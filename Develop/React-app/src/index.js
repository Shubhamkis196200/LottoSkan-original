// import 'react-app-polyfill/ie9'; // For IE 9-11 support
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap-v4-rtl/dist/css/bootstrap-rtl.min.css'
import 'react-app-polyfill/ie11' // For IE 11 support
import 'react-app-polyfill/stable'
import './polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
// import default style
import 'rsuite/dist/rsuite.min.css'
ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
