import React from 'react'
import 'antd/dist/antd.css'
import { connect } from 'react-redux'
import axios from 'axios'
import { StyledDrawer } from '../styles/Style'
import { Card, Avatar } from 'antd'

const apiKey = 'RpCwq0GvuDZChatIBURhGTvmmK4ek4EZ'

class Panel extends React.PureComponent {  
    constructor(props){
        super(props)
        this.state = {
            pointValues: null
        }
        if(this.props.pointValues){
            this.props.onStorageAdd({ 
                ...this.props,
                pointValues: null
            })  
        }
    }

    onClose = () => {
        this.props.onHideDrawer({ 
            ...this.props,
            drawerVisible: false
        })          
    }

    render() {
        const { pointData, drawerVisible, pointValues } = this.props
        let box1, box2
        let sensorsList = JSON.parse(localStorage.getItem('sensors_values'))
        
        if(pointData){
            let sensorExists = false
            let sensorIndex = sensorsList.findIndex(function(sensor) {
                return sensor.id === pointData.id
            })
            
            if(sensorIndex >= 0 || pointValues){
                //const preParam = (sensorsList[sensorIndex] ? sensorsList[sensorIndex].data : pointValues)
                const preParam2 = (sensorsList[sensorIndex] ? sensorsList[sensorIndex].data.current.indexes[0] : pointValues.current.indexes[0])

                box1 = <Card
                    title={pointData.address.displayAddress2}
                    size="small"
                    extra={<span className="card-close" onClick={this.onClose}>Close</span>}>
                        <div className="avatar-logo">
                            <Avatar src={pointData.sponsor.logo} size="large"/>
                        </div>
                        {pointData.sponsor.description} <b>{pointData.sponsor.name}</b>                        
                    </Card>  
                box2 = <Card 
                    size="small"
                    className="coloured"
                    style={{ 
                        backgroundColor: preParam2.color, 
                        borderColor: preParam2.color, 
                    }}>
                        <div className="indicator">
                            {Math.round(preParam2.value)}
                        </div>                        
                        {preParam2.description}
                        <br/>
                        {preParam2.advice}
                </Card>  
            } 

            sensorsList.forEach(function (item, key) {
                if(item && item.id && item.id === pointData.id){
                    sensorExists = true
                }
            })

            if(!pointValues){
                if(!sensorExists){
                    axios.get(`https://airapi.airly.eu/v2/measurements/point?indexType=AIRLY_CAQI&lat=${pointData.location.latitude}&lng=${pointData.location.longitude}&apikey=${apiKey}`)
                    .then(({ data }) => {
                        sensorsList.push({
                            id: pointData.id,
                            data: data
                        })
                        localStorage.setItem('sensors_values', JSON.stringify(sensorsList))
                        this.props.onStorageAdd({ 
                            ...this.props,
                            pointValues: data
                        })   
                    })
                    .catch((err) => { 
                        console.log(err) 
                    })
                }
            }
        }

        return <StyledDrawer
            title="Loading"
            placement="left"
            closable={true}
            width={'30vw'}
            mask={false}
            onClose={this.onClose}
            visible={drawerVisible}>   
            {box1}    
            {box2}
            </StyledDrawer>   
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
    onStorageAdd: (drawer) => {
        dispatch({
            type: 'STORAGE_ADDED',
            payload: drawer
        })
    }
})

const StoredPanel = connect(mapStateToProps, mapDispatchToProps)(Panel)
export default StoredPanel