import React from "react";
import "antd/dist/antd.css";
import { Select, Button, Tooltip, message } from "antd";
import { StyledRightbar } from "../styles/Style";
import { connect } from "react-redux";
import axios from "axios";

const Option = Select.Option;
const apiKey = "RpCwq0GvuDZChatIBURhGTvmmK4ek4EZ";

class Rightpanel extends React.PureComponent {
  sensorSelect = React.createRef();
  state = {
    searchCurrent: "Start typing to search",
    showPositionBtn: false,
    positionBtnLoading: false,
    positionBtnSuccess: false
  };

  componentDidMount() {
    const { showPositionBtn } = this.state;
    let location = localStorage.getItem("location");

    if (navigator.geolocation && !showPositionBtn) {
      this.setState({
        ...this.state,
        showPositionBtn: true
      });
    }
    if (location) {
      this.setState({
        ...this.state,
        showPositionBtn: true,
        positionBtnLoading: false,
        positionBtnSuccess: true
      });
    }
  }

  clearSelect = () => {};

  localizeMe = () => {
    this.setState({
      ...this.state,
      positionBtnLoading: true,
      positionBtnSuccess: false
    });
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(location => {
        if (location.coords) {
          localStorage.setItem(
            "location",
            JSON.stringify({
              lat: location.coords.latitude,
              lng: location.coords.longitude
            })
          );
        }
      });
      message.success("Positively located");
      this.props.onFlyToLocation({
        flyMyLocation: true
      });
      this.setState({
        ...this.state,
        positionBtnLoading: false,
        positionBtnSuccess: true
      });
    }, 2000);
  };

  handleChange = e => {
    let sensorsList = JSON.parse(localStorage.getItem("sensors"));
    let sensorExists = false;

    if (e === "") {
      this.props.onHideDrawer({
        drawerVisible: false,
        pointData: null
      });
      return false;
    }

    sensorsList.forEach(function(item, key) {
      if (item && item.id && item.id === e) {
        sensorExists = true;
      }
    });
    if (sensorExists) {
      let sensorIndex = sensorsList.findIndex(function(sensor) {
        return sensor.id === e;
      });
      if (sensorIndex) {
        this.props.mapObject.flyTo(
          [
            sensorsList[sensorIndex].location.latitude,
            sensorsList[sensorIndex].location.longitude
          ],
          15
        );
        this.props.onShowDrawer({
          drawerVisible: true,
          pointData: sensorsList[sensorIndex]
        });
      }
    } else {
      axios
        .get(`https://airapi.airly.eu/v2/installations/${e}?apikey=${apiKey}`)
        .then(({ data }) => {
          this.props.onShowDrawer({
            drawerVisible: true,
            pointData: data
          });
          sensorsList.push(data);
          localStorage.setItem("sensors", JSON.stringify(sensorsList));
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    const { positionBtnLoading, positionBtnSuccess } = this.state;
    let sensorsList = JSON.parse(localStorage.getItem("sensors"));

    return (
      <StyledRightbar>
        <Select
          defaultValue={this.state.searchCurrent}
          style={{ width: 220 }}
          onChange={this.handleChange}
          showSearch
          size="large"
          onBlur={this.clearSelect}
          ref={this.sensorSelect}
          filterOption={(input, option) =>
            option.props.children &&
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
              0
          }
        >
          {sensorsList.map((sensor, index) => {
            return (
              <Option value={sensor.id} key={index}>
                {sensor.address.displayAddress2
                  ? sensor.address.displayAddress2
                  : sensor.address.displayAddress1}
              </Option>
            );
          })}
        </Select>
        <Tooltip
          placement="bottomRight"
          title={
            positionBtnSuccess
              ? "Click to update location"
              : positionBtnLoading
              ? "Setting location"
              : "Set location"
          }
        >
          <Button
            shape="circle"
            icon="environment"
            type={positionBtnSuccess ? "primary" : "default"}
            loading={positionBtnLoading}
            size="large"
            onClick={this.localizeMe}
          />
        </Tooltip>
      </StyledRightbar>
    );
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  onShowDrawer: payload => {
    dispatch({
      type: "SHOW_DRAWER",
      payload: payload
    });
  },
  onHideDrawer: payload => {
    dispatch({
      type: "HIDE_DRAWER",
      payload: payload
    });
  },
  onFlyToLocation: payload => {
    dispatch({
      type: "FLY_TO_LOCATION",
      payload: payload
    });
  }
});

const StoredRightpanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(Rightpanel);
export default StoredRightpanel;
