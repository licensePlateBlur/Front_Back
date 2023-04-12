import React,{ Component,useState,useRef,useEffect } from 'react'
import styled from 'styled-components'
import '../App.css';
import axios from 'axios';

const Form = styled.form`
display : flex;
flex-direction: column;
max-width : 600px;
width : 600px;
text-align: center;
`
const Input = styled.input`
display: none;
`
const Label = styled.label`
height: 400px;
width :100%;
display : flex;
align-items: center;
justify-content: center;
border-width: 2px;
border-radius: 16px;
border-style: dashed;
border-color: #cbd5e1;
background-color: #f8fafc;
`
const SubTitle = styled.h1`
text-align: center;
`;

const VideO  = styled.video`
text-align: center;
max-width : 600px;
height : 430px;
max-height : 430px;
`;
const MainLayout = styled.div`
max-width : 1200px;
 margin : 0 auto;
 display : flex;
 flex-direction: row;
`;
export default function Video() {
  const inputRef = useRef(null);
  const saveRef = useRef(null);
  function HandleCancel()
  {
    window.location.reload();
  }
  useEffect( () =>{

    const input = inputRef.current; 
    const save=saveRef.current;
    function preventDefault(event) {
      event.preventDefault();
      event.stopPropagation();
    }
    // Handle dragover event
    function handleDragOver(event) {
      preventDefault(event);
    }

    // Handle drop event
    function handleDrop(event) {
      preventDefault(event);
      BlindVideo(event);
    }

    const BlindVideo = async(event) =>
    {
      console.log(event.dataTransfer.files[0]);
      const f = event.dataTransfer.files[0];
      const formData = new FormData();
      formData.append("video", f);
      try{
        const response = await axios({
          method: "post",
          url: "http://localhost:5000/detect",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(response);
        console.dir(response);
      }catch(error)
      {
        console.log(error);
      }
      const video = document.getElementById("video");
      const videourl = URL.createObjectURL(f);
      video.setAttribute("src", videourl);
      video.play();
    }
    const Save = async(event) =>{

      alert("클릭이벤트");
    }


    //리스너생성
    input.addEventListener('dragover', handleDragOver); //이게 있어야 drop 이 작동됨
    input.addEventListener('drop', handleDrop);
    save.addEventListener('click',Save);

    return () => {
      //리스너삭제
      input.addEventListener('dragover', handleDragOver);
      input.addEventListener('drop', handleDrop);
      save.addEventListener('click',Save);
    };
  },[])
  return (
    <>
    <MainLayout>
    <div id ="left">
    <Form id="form">
    <SubTitle>블러처리할 동영상을 올려주세요</SubTitle>
      <Input  type="file" id="input-file-upload" accept=".mov,.mp4"/>
      <Label ref={inputRef} htmlFor="input-file-upload">
        <div>
          <p>동영상 업로드</p>
        </div> 
      </Label>
      </Form>
      <div id ="pixel">
      <SubTitle>탐색된 정보</SubTitle>
      </div>
      </div>
      <div id="right">
      <VideO id="video"></VideO>

     <div id="findclass">
     <SubTitle>탐색된 클래스</SubTitle>
     </div>
      <ButtonLayer id="btnlayer">
      <Button12 type="button" id ="btnSave" ref={saveRef}>저장하기</Button12>
      <Button11 onClick={HandleCancel} type="button" id="btnBlur">취소</Button11>
      </ButtonLayer>

      </div>
      </MainLayout>
    </>
  )
}
const Button11 =styled.div`
width : 100%;
height: 58px;
background: #6C6C6C;
border-radius: 7px;
font-family: 'Noto Sans';
font-style: normal;
font-weight: 700;
font-size: 14px;
line-height: 19px;
color: #DCDCDC;
display : flex;
justify-content : center;
align-items : center;
border : none;
`;
const Button12 =styled.button`
width : 100%;
height: 58px;
font-family: 'Noto Sans';
font-style: normal;
font-weight: 700;
font-size: 14px;
line-height: 19px;
color: #FFFFFF;
background: #4BBFB4;
border-radius: 7px;
border : none;
`;

const ButtonLayer = styled.div`
margin-top : 10px;
max-width : 600px;
width : 600px;
display : flex; 
gap : 25px;
flex-direction: column;
`