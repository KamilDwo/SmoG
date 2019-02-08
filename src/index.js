import React from 'react'
import { render } from 'react-dom'
import StoredMap from './Map'
import './styles/Leaflet.css'
import {GlobalStyle} from './styles/Style'
import * as serviceWorker from './serviceWorker'
import store from './store/Store'
import { Provider } from 'react-redux'

render(<Provider store={ store }><GlobalStyle/><StoredMap /></Provider>, document.getElementById('root'))
serviceWorker.register()
