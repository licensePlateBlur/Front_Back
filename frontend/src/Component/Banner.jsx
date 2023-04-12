import React,{useEffect, useState} from 'react'
import {Route,Routes,NavLink, Link } from "react-router-dom";
import '../App.css';
import styled from 'styled-components';

const SubTitle = styled.div`
width : auto;
display : flex;
flex-direction: row;
gap: 37px;
`;
const Login =styled.button`
font-weight: 400;
font-size: 12px;
line-height: 15px;
background: #4BBFB4;
color: #000000;
border : none;
`;
const Signup =styled.button`
margin-right : 37px;
font-weight: 400;
font-size: 12px;
line-height: 15px; 
background: #4BBFB4;
padding:  0px;
color: #000000;
border : none;
`;
export default function Banner() {
    const [isopen,setIsopen]=useState(false);

  const OnClick = () =>{
    setIsopen(true);
  }
  const handleLogout = () =>{
    localStorage.clear();
    window.location.replace('http://localhost:3000/');
  }
  return (
    <>
            <div className='headertop'>
            <SubTitle>
                <Link to="/login"><Login>LOGIN</Login></Link>
                <Link to="/join"><Signup>SIGNUP</Signup></Link>
            </SubTitle>
            
            </div>
            <nav className="header">
            <NavLink className='Logo'to="/">그루트</NavLink>
            <ul>
            <NavLink to="/image"><li>사진</li></NavLink>
            <NavLink to="/video"><li >동영상</li></NavLink>
            <NavLink to="/gallery"><li>갤러리</li></NavLink>
            <NavLink to="/price"><li>가격</li></NavLink>
            </ul>
            </nav>
    </>
  )
}
