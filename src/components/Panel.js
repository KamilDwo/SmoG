import React from 'react'
import 'antd/dist/antd.css'
import { connect } from 'react-redux'
import axios from 'axios'
import { StyledDrawer } from '../styles/Style'
import { Card } from 'antd'

const apiKey = 'dAhLeikoBeIHkdK7NjcYiLI2UrUjDloC'

class Panel extends React.PureComponent {  
    constructor(props){
        super(props)
        this.state = {
            pointValues: null
        }
    }

    onClose = () => {
        this.props.onHideDrawer({ 
            ...this.props,
            drawerVisible: false
        })          
    }

    render() {
        const { pointData, drawerVisible } = this.props
        const { pointValues } = this.state
        let box1
/*
        if(pointid){
            axios.get(`https://airapi.airly.eu/v2/installations/${pointid}?apikey=${apiKey}`)
            .then(({ data }) => {
                this.setState({
                    ...this.state,
                    point: data
                })
            })
            .catch((err) => { 
                console.log(err) 
            })
            /*
            axios.get(`https://airapi.airly.eu/v2/measurements/point?indexType=AIRLY_CAQI&lat=${pointLocation.lat}6&lng=${pointLocation.lng}&apikey=${apiKey}`)
            .then(({ data }) => {
                this.setState({
                    ...this.state,
                    pointValues: data
                })
            })
            .catch((err) => { 
                console.log(err) 
            })
        }*/
     
        if(pointValues ){
            box1 = <Card
                title={pointData.address.displayAddress2}
                size="small"
                extra={<span className="card-close" onClick={this.onClose}>Close</span>}>
                    <div className="indicator" style={{color: pointValues.current.indexes[0].color}}>
                        {Math.round(pointValues.current.indexes[0].value)}
                    </div>
                    {pointValues.current.indexes[0].description}
                    <br/>
                    {pointValues.current.indexes[0].advice}
                </Card>    
        }  
        
        if(pointData){
            axios.get(`https://airapi.airly.eu/v2/measurements/point?indexType=AIRLY_CAQI&lat=${pointData.location.latitude}&lng=${pointData.location.longitude}&apikey=${apiKey}`)
            .then(({ data }) => {
                if(!this.state.pointValues){
                    this.setState({
                        pointValues: data
                    })
                }
            })
            .catch((err) => { 
                console.log(err) 
            })
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
    }
})

const StoredPanel = connect(mapStateToProps, mapDispatchToProps)(Panel)
export default StoredPanel