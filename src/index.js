import React from 'react'
import { render } from 'react-dom'
import Map from './Map'
import './styles/Leaflet.css'
import {GlobalStyle} from './styles/Style'

class App extends React.Component {
    state = {
    }

    render() {

        return (<>
            <GlobalStyle/>
            <Map/>
        </>
    )
  }
}

render(<App />, document.getElementById('root'))
