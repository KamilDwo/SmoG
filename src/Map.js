import React from 'react'
import L from 'leaflet'
import {StyledMap} from './styles/Style.js'
import axios from 'axios'

let greenIcon = L.icon({
    iconUrl: 'images/marker-icon.png',
    iconAnchor: [25, 41],
    popupAnchor:  [-12, -40]
})

const apiKey = 'dAhLeikoBeIHkdK7NjcYiLI2UrUjDloC'

class Map extends React.PureComponent {  
    constructor(props) {
        super(props)
        this.mapRef = React.createRef()
        this.state = {
            avaiblePoints: [],
            popupLoaded: false
        }
    }

    onMarkerClick = (marker) => {
        const { options } = marker.target

        axios.get(`https://airapi.airly.eu/v2/measurements/point?indexType=AIRLY_CAQI&lat=${options.location.lat}6&lng=${options.location.lng}&apikey=${apiKey}`)
        .then(({ data }) => {
            console.log(data)
            marker.target.bindPopup(options.address).openPopup()
        })
        .catch((err) => { 
            console.log(err) 
        })
    }

    componentDidMount() {
        this.mapElement = L.map('map', {
            center: [50.049683, 19.944544],
            zoom: 13,
            minZoom: 13,
            maxZoom: 18,
            layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="https://airly.eu">Airly</a> sensors'
                })
            ]
        }) 
        
        axios.get(`https://airapi.airly.eu/v2/installations/nearest?lat=50.049683&lng=19.944544&maxDistanceKM=30&maxResults=-1&apikey=${apiKey}`)
        .then(({ data }) => {
            this.setState({
                ...this.state,
                avaiblePoints: data
            })
        })
        .catch((err) => { 
            console.log(err) 
        })    
    }

    componentDidUpdate(){
        const { avaiblePoints } = this.state
        
        if(avaiblePoints.length && avaiblePoints.length > 0){
            const pointsZone = avaiblePoints.filter((item) => {
                return item.address.city === 'Kraków'
            })
            pointsZone.map((point) => {
                let marker = L.marker([point.location.latitude, point.location.longitude], {
                    icon: greenIcon,
                    address: point.address.displayAddress2,
                    location: {
                        lat: point.location.latitude,
                        lng: point.location.longitude
                    }
                }).addTo(this.mapElement)
                marker.on('click', this.onMarkerClick)
                return marker
            })
        }
    }

    render() {
        return <StyledMap id="map" ref={this.mapRef}/>
    }
}

export default Map
