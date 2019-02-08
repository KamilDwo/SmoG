import React from 'react'
import L from 'leaflet'
import {StyledMap} from './styles/Style.js'
import axios from 'axios'
import 'antd/dist/antd.css'
import StoredPanel from './components/Panel'
import { connect } from 'react-redux'

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
            drawer: false
        }
    }

    popupStyle = (address, indexes) => {
        return `<h3>${address}</h3>
        <div class="indicator" style="color:${indexes.color}">${Math.round(indexes.value)}</div>
        ${indexes.advice}`
    }

    popupStyleError = (address) => {
        return `<h3>${address}</h3>
        Ten czujnik jest aktualnie nieaktywny.`
    }

    onMarkerClick = (marker) => {
        const { options } = marker.target

        this.mapElement.flyTo([options.location.lat, options.location.lng], 15)
        axios.get(`https://airapi.airly.eu/v2/installations/${options.installationId}?apikey=${apiKey}`)
        .then(({ data }) => {
            this.props.onShowDrawer({ 
                drawerVisible: true,
                pointData: data
            })
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
        this.mapElement.zoomControl.remove()
        L.control.zoom({ position: 'bottomright' }).addTo(this.mapElement)
        
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
                    maxWidth: 200,
                    minWidth: 200,
                    installationId: point.id,
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
        return <><StyledMap id="map" ref={this.mapRef}/><StoredPanel/></>
    }
}

const mapStateToProps = state => (state)

const mapDispatchToProps = dispatch => ({
    onShowDrawer: (drawer) => {
        dispatch({
            type: 'SHOW_DRAWER',
            payload: drawer
        })
    }
})

const StoredMap = connect(mapStateToProps, mapDispatchToProps)(Map)
export default StoredMap
