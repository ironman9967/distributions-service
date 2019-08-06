
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import App from './containers/app'

import * as serviceWorker from './serviceWorker'

import { getFaze, createActions } from './state'

createActions()

ReactDOM.render(
	<getFaze.Provider>
		<App />
	</getFaze.Provider>,
	document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
