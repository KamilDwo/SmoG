import React from "react";
import "antd/dist/antd.css";
import { connect } from "react-redux";
import axios from "axios";
import { StyledDrawer } from "../styles/Style";
import { Card, Avatar, Tabs, Progress, Col, Row } from "antd";

const { REACT_APP_AIRLY_KEY } = process.env;
const apiKey = REACT_APP_AIRLY_KEY;
const TabPane = Tabs.TabPane;
let sensorsList = JSON.parse(localStorage.getItem("sensors_values"));

class Panel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pointValues: null
    };
    if (this.props.pointValues) {
      this.props.onStorageAdd({
        pointValues: null
      });
    }
  }

  onClose = () => {
    this.props.onHideDrawer({
      drawerVisible: false,
      currentPoint: null
    });
  };

  render() {
    const { pointData, drawerVisible, pointValues } = this.props;
    let box1, box2, box3, box4;

    if (pointData) {
      let sensorExists = false;
      let sensorIndex = sensorsList.findIndex(function(sensor) {
        return sensor.id === pointData.id;
      });

      if (sensorIndex >= 0 || pointValues) {
        const preParam2 = sensorsList[sensorIndex]
          ? sensorsList[sensorIndex].data.current
          : pointValues.current;

        box1 = (
          <Card
            title={
              pointData.address.displayAddress2
                ? pointData.address.displayAddress2
                : pointData.address.displayAddress1
            }
            size="small"
            extra={
              <span className="card-close" onClick={this.onClose}>
                Close
              </span>
            }
          >
            <div className="avatar-logo">
              <Avatar src={pointData.sponsor.logo} size="large" />
            </div>
            {pointData.sponsor.description} <b>{pointData.sponsor.name}</b>
          </Card>
        );
        box2 = (
          <Card
            size="small"
            className="coloured"
            style={{
              backgroundColor: preParam2.indexes[0].color,
              borderColor: preParam2.indexes[0].color
            }}
          >
            <div className="indicator">
              {Math.round(preParam2.indexes[0].value)}
            </div>
            {preParam2.indexes[0].description}
            <br />
            {preParam2.indexes[0].advice}
          </Card>
        );
        box3 = (
          <Card size="small">
            <Tabs defaultActiveKey="1" animated={false}>
              <TabPane tab="PM10" key="1">
                <b>{Math.round(preParam2.values[0].value)}</b> µg/m³
              </TabPane>
              <TabPane tab="PM2.5" key="2">
                <b>{Math.round(preParam2.values[1].value)}</b> µg/m³
              </TabPane>
              <TabPane tab="PM1" key="3">
                <b>{Math.round(preParam2.values[2].value)}</b> µg/m³
              </TabPane>
              <TabPane tab="Pressure" key="4">
                <b>{Math.round(preParam2.values[3].value)}</b> hPa
              </TabPane>
            </Tabs>
          </Card>
        );
        box4 = (
          <Card size="small">
            <Row>
              <Col span={12} style={{ textAlign: "center" }}>
                <span className="chart-title">Humidity</span>
                <Progress
                  type="circle"
                  percent={Math.round(preParam2.values[4].value)}
                />
              </Col>
              <Col span={12} style={{ textAlign: "center" }}>
                <span className="chart-title">Temperature</span>
                <b style={{ fontSize: "25px" }}>
                  {Math.round(preParam2.values[5].value)}
                </b>{" "}
                °C
              </Col>
            </Row>
          </Card>
        );
      }

      sensorsList.forEach(function(item, key) {
        if (item && item.id && item.id === pointData.id) {
          sensorExists = true;
        }
      });

      if (!pointValues) {
        if (!sensorExists) {
          axios
            .get(
              `https://airapi.airly.eu/v2/measurements/point?indexType=AIRLY_CAQI&lat=${
                pointData.location.latitude
              }&lng=${pointData.location.longitude}&apikey=${apiKey}`
            )
            .then(({ data }) => {
              sensorsList.push({
                id: pointData.id,
                data: data
              });
              localStorage.setItem(
                "sensors_values",
                JSON.stringify(sensorsList)
              );
              this.props.onStorageAdd({
                pointValues: data
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    }

    return (
      <StyledDrawer
        title="Loading"
        placement="left"
        closable={true}
        width={"400px"}
        mask={false}
        onClose={this.onClose}
        visible={drawerVisible}
      >
        {box1}
        {box2}
        {box3}
        {box4}
      </StyledDrawer>
    );
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  onStorageAdd: drawer => {
    dispatch({
      type: "STORAGE_ADDED",
      payload: drawer
    });
  },
  onHideDrawer: payload => {
    dispatch({
      type: "HIDE_DRAWER",
      payload: payload
    });
  }
});

const StoredPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(Panel);
export default StoredPanel;
