import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import { Drawer } from 'antd'

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
        font-size: 25px;
        font-weight: bolder;
        margin-right: 10px;
    }
    &.ant-drawer-open{
        .ant-drawer-content-wrapper{
            box-shadow: none;
            height: auto;
        }
    }
    .ant-card {
        border-radius: 15px;
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
    StyledDrawer
}
  