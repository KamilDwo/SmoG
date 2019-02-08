import React from 'react'
import L from 'leaflet'
import { StyledMap } from './styles/Style.js'
import axios from 'axios'
import 'antd/dist/antd.css'
import StoredPanel from './components/Panel'
import { connect } from 'react-redux'
import StoredRightpanel from './components/Rightpanel'

let greenIcon = L.icon({
    iconUrl: 'images/marker-icon.png',
    iconAnchor: [25, 41],
    popupAnchor:  [-12, -40]
})

const apiKey = 'RpCwq0GvuDZChatIBURhGTvmmK4ek4EZ'

if(!localStorage.getItem('sensors')){
    localStorage.setItem('sensors', '[]')
}
if(!localStorage.getItem('sensors_values')){
    localStorage.setItem('sensors_values', '[]')
}

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
        let sensorsList = JSON.parse(localStorage.getItem('sensors'))
        let sensorExists = false

        sensorsList.forEach(function (item, key) {
            if(item && item.id && item.id === options.installationId){
                sensorExists = true
            }
        })

        this.mapElement.flyTo([options.location.lat, options.location.lng], 15)
        if(!sensorExists){
            axios.get(`https://airapi.airly.eu/v2/installations/${options.installationId}?apikey=${apiKey}`)
            .then(({ data }) => {
                this.props.onShowDrawer({ 
                    drawerVisible: true,
                    pointData: data
                })            
                sensorsList.push(data)
                localStorage.setItem('sensors', JSON.stringify(sensorsList))
            })
            .catch((err) => { 
                console.log(err) 
            })
        } else {
            let sensorIndex = sensorsList.findIndex(function(sensor) {
                return sensor.id === options.installationId
            })
            if(sensorIndex){
                this.props.onShowDrawer({ 
                    drawerVisible: true,
                    pointData: sensorsList[sensorIndex]
                })    
            }
        }
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
                marker.bindTooltip(point.address.displayAddress2, { direction: 'top', offset:[-12, -28] })
                marker.on('click', this.onMarkerClick)
                return marker
            })
        }
    }

    render() {
        return <>
            <StoredRightpanel mapObject={this.mapElement}/>
            <StyledMap id="map" ref={this.mapRef}/>
            <StoredPanel/>            
        </>
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
