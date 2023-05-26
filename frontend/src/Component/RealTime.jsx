import React,{ Component,useState,useRef,useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios';
const Layer = styled.div`
  height: 400px;
  width :50%;
  display : flex;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-radius: 16px;
  border-style: dashed;
  border-color: #cbd5e1;
  background-color: #f8fafc;
  margin : 0 auto;
  margin-top : 20px;
  cursor: pointer;
`
export default function Main() {

  const LayerRef= useRef(null);

  useEffect( ()=>{

    const layer = LayerRef.current;
    //리스너생성
    const ClickHandler = async(event) =>{
      try{
        const response = await axios({
          method: "post",
          url: "http://localhost:5000/python/detect_realtime",
          // data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(response);
        console.dir(response);
      }catch(error)
      {
        console.log(error);
      }

    }
    layer.addEventListener('click',ClickHandler);
    return () => {
      //리스너삭제
      layer.removeEventListener('click',ClickHandler);
    };
  },[])
  return (
    <Layer ref={LayerRef}>
      실시간 동영상 촬영
    </Layer>
  )
}
