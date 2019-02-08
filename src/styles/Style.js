import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import { Drawer, Select } from 'antd'

const GlobalStyle = createGlobalStyle`
body {
    margin: 0;
    padding: 0;
    background-color: #fff;
}`


const StyledMap = styled.div`
width: 100%;
height: 100vh;
.indicator{
    display: block;
    margin: 10px 0;
    width: 100%;
    font-size: 30px;
    text-align: center;
    font-weight: bolder;
}`

const StyledRightbar = styled(Select)`
&&{
    position: fixed;
    right: 24px;
    top: 24px;
    z-index: 401;
    @media (max-width: 650px){
        right: 54px;
    }
}`

const StyledDrawer = styled(Drawer)`
&&{
    .ant-drawer-content{
       background-color: transparent;
    }
    .ant-drawer-header{
        display: none;
    }
    .indicator{
        display: inline-block;
        font-size: 35px;
        font-weight: bolder;
        margin-right: 10px;
    }
    &.ant-drawer-open{
        .ant-drawer-content-wrapper{
            box-shadow: none;
            @media (max-width: 650px){
                width: calc(100% - 30px) !important;
                margin-top: 75px;
                padding-bottom: 75px;
            }
        }
        .ant-drawer-body{
            @media (max-width: 650px){
                padding-top: 0;
            }
        }
    }
    .chart-title{
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
        box-shadow: 0 0 10px rgba(40,99,177,.2);
        &.coloured{
            color: #fff;
        }
        .avatar-logo{
            display: inline-block;
            margin-right: 10px;
        }
    }
    .card-close{
        cursor: pointer;
        color: #0080d0;
    }
}
`


export {
    GlobalStyle,
    StyledMap,
    StyledDrawer,
    StyledRightbar
}
  