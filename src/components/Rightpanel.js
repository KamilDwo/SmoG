import React from 'react'
import 'antd/dist/antd.css'
import { Select } from 'antd'
import { StyledRightbar } from '../styles/Style'
import { connect } from 'react-redux'
import axios from 'axios'

const Option = Select.Option
const apiKey = 'RpCwq0GvuDZChatIBURhGTvmmK4ek4EZ'

class Rightpanel extends React.PureComponent {  
    handleChange = e => {
        let sensorsList = JSON.parse(localStorage.getItem('sensors'))
        let sensorExists = false

        if(e === ''){
            this.props.onHideDrawer({ 
                drawerVisible: false,
                pointData: null
            })
            return false
        }

        sensorsList.forEach(function (item, key) {
            if(item && item.id && item.id === e){
                sensorExists = true
            }
        })
        if(sensorExists){
            let sensorIndex = sensorsList.findIndex(function(sensor) {
                return sensor.id === e
            })
            if(sensorIndex){
                this.props.mapObject.flyTo([sensorsList[sensorIndex].location.latitude, sensorsList[sensorIndex].location.longitude], 15)
                this.props.onShowDrawer({ 
                    drawerVisible: true,
                    pointData: sensorsList[sensorIndex]
                })  
            }
        } else {
            axios.get(`https://airapi.airly.eu/v2/installations/${e}?apikey=${apiKey}`)
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
        }   
    }

    render() {
        let sensorsList = JSON.parse(localStorage.getItem('sensors'))
       
        return <StyledRightbar defaultValue="" style={{ width: 220 }} onChange={this.handleChange}>
            <Option value="" key="">Choose sensor from list</Option>
            {sensorsList.map((sensor, index) => {
                return <Option value={sensor.id} key={index}>{sensor.address.displayAddress2 ? sensor.address.displayAddress2 : sensor.address.displayAddress1}</Option>
            })}
        </StyledRightbar>
    }
}

const mapStateToProps = state => (state)

const mapDispatchToProps = dispatch => ({
    onShowDrawer: (drawer) => {
        dispatch({
            type: 'SHOW_DRAWER',
            payload: drawer
        })
    },
    onHideDrawer: (drawer) => {
        dispatch({
            type: 'HIDE_DRAWER',
            payload: drawer
        })
    },
})

const StoredRightpanel = connect(mapStateToProps, mapDispatchToProps)(Rightpanel)
export default StoredRightpanel
