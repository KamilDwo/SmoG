import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import { Drawer } from "antd";

const GlobalStyle = createGlobalStyle`
body {
    margin: 0;
    padding: 0;
    background-color: #fff;
    @media (max-width: 650px){
        .leaflet-control-zoom{
            display: none;
        }
    }
}`;

const StyledMap = styled.div`
  width: 100%;
  height: 100vh;
  .indicator {
    display: block;
    margin: 10px 0;
    width: 100%;
    font-size: 30px;
    text-align: center;
    font-weight: bolder;
  }
`;

const StyledRightbar = styled.div`
  && {
    position: fixed;
    right: 24px;
    top: 24px;
    z-index: 401;
    .ant-select {
      display: inline-block;
    }
    .ant-btn {
      display: inline-block;
      margin-left: 10px;
    }
    @media (max-width: 560px) {
      left: 24px;
      .ant-select {
        width: calc(100% - 50px) !important;
      }
    }
  }
`;

const StyledDrawer = styled(Drawer)`
  && {
    .ant-drawer-content {
      background-color: transparent;
    }
    .ant-drawer-header {
      display: none;
    }
    .indicator {
      display: inline-block;
      font-size: 35px;
      font-weight: bolder;
      margin-right: 10px;
    }
  
      .ant-drawer-content-wrapper {
        box-shadow: none;
        @media (max-width: 650px) {
          top: 75px;
          padding-bottom: 75px;
        }
        @media (max-width: 480px) {
          width: 100% !important;
        }
      }
      .ant-drawer-body {
        @media (max-width: 650px) {
          padding-top: 0;
        }
      }
  
    .chart-title {
      display: block;
      width: 100%;
      text-align: center;
      margin-bottom: 15px;
      font-weight: bold;
    }
    .ant-card {
      border-radius: 10px;
      user-select: none;
      cursor: default;
      margin-bottom: 24px;
      box-shadow: 0 0 10px rgba(40, 99, 177, 0.2);
      &.coloured {
        color: #fff;
      }
      .avatar-logo {
        display: inline-block;
        margin-right: 10px;
      }
    }
    .card-close {
      cursor: pointer;
      color: #0080d0;
    }
  }
`;

export { GlobalStyle, StyledMap, StyledDrawer, StyledRightbar };
