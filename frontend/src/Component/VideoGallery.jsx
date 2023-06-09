import React,{useState} from 'react'
import styled from 'styled-components';
import { ReactComponent as Ten } from "../img/ten.svg";
import { useEffect } from 'react';
import axios from 'axios';
import { useRef } from 'react';
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="current"
  height="current"
  viewBox="0 0 24 24"
>
  <path fill="current" fill-rule="evenodd" d="...." />
</svg>
export default function VideoGallery() {
  const [datas,setDatas]=useState([]);
  const handlebutton = (e) =>{
    window.location.href="/video";
  }
  function preventDefault(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  const HandleOnclick = async(id,event) =>{
    preventDefault(event);
      const download = document.createElement('a');
        download.href = `http://localhost:5000/python/download_video/${id}`;
        download.setAttribute('download', "다운로드");
        download.click();
  }
  useEffect( () =>{

      async function get() {
      try
      {
      const result = await axios.get(
        `http://localhost:5000/python/video_files`
      );
      setDatas(result.data);
    }catch(err)
    {
      console.log(err);
    }
    }
    get();
  },[])
  return (
    <MainLayout>
    <Title><Text>내가 <span>저장한 영상</span></Text><Text1>저장한 영상이 {datas.length}개 있습니다.</Text1> <SgyButton onClick={handlebutton}>영상 업로드<Ten/></SgyButton></Title>

    <table>
    <thead>
      <tr>
        <th>번호</th>
        <th>파일 생성일</th>
        <th>파일이름</th>
        <th>파일타입</th>
        <th>파일크기</th>
        <th>다운로드</th>
      </tr>
      </thead>
      <tbody>
      {
        datas.map( (data,i)=>(
          <tr key={i}>
            <td>{data.ID}</td>
            <td>{data.CREATED_DATE}</td>
            <td>{data.ORIGINAL_FILE_NAME}</td>
            <td>{data.FILE_TYPE}</td>
            <td>{data.FILE_SIZE}</td>
            <td><button onClick={(e) => HandleOnclick(data.ID, e)}>다운로드</button></td>
          </tr>
        ) )
      }
      </tbody>
    </table>

    </MainLayout>
  )
}
const MainLayout = styled.div`
 max-width : 1200px;
 margin : 0 auto;
 display : flex;
 flex-direction: column;
`;
const Text = styled.div`
font-family: 'Noto Sans';
font-style: normal;
font-weight: 300;
font-size: 24px;
line-height: 33px;
letter-spacing: -1px;
color: #000000;
span{
  font-weight: 600;
}
`;
const Text1 = styled.div`
font-family: 'Noto Sans';
font-style: normal;
font-weight: 300;
font-size: 14px;
line-height: 19px;
letter-spacing: -1px;
color: #7C7C7C;
`;
const Title = styled.div`
  display : flex;
  flex-direction: row;
  align-items: flex-end;
  margin-top:73px;
  margin-bottom : 37px;
  gap : 10px;
`;
const SgyButton = styled.div`
display : flex;
width: 150px;
height: 38px;
gap : 31px;
justify-content: center;
height: 37px;
font-family: 'Noto Sans';
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 19px;
letter-spacing: -1px;
color: #FFFFFF;
background: #4158D9;
border-radius: 7px;
margin-left : auto;
align-items : center;
`;
