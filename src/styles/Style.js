import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle `
body {
    margin: 0;
    padding: 0;
    background-color: #fff;
}`


const StyledMap = styled.div `
width: 100%;
height: 100vh;
.indicator{
    display: block;
    margin: 10px 0;
    width: 100%;
    font-size: 30px;
    text-align: center;
    font-weight: bolder;
}
`


export {
    GlobalStyle,
    StyledMap
}
  