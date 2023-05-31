import React,{ useState,useRef,useEffect } from 'react'
import styled from 'styled-components'
import '../App.css';
import axios from 'axios';
import {create} from 'zustand';
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

const useStore = create( (set) => ({
  id : 0,
  setId: (videoId) => {
    set((state) => ({ ...state, id: videoId }));
  }
}));

export default function Video() {
  const {id,setId} = useStore();

  const inputRef = useRef(null);
  const saveRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [datas,setDatas]=useState([]);
  const [label,setLabel]=useState([0,0,0,0]);
  function HandleCancel()
  {
    window.location.reload();
  }
  useEffect( () =>{
    setLoading(true);
	  setError(undefined);
    const video = document.getElementById("video");
    video.style.visibility = "hidden";
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
      const right = document.getElementById("right");
      const pixel = document.getElementById("pixel");
      right.style.display="flex";
      pixel.style.display="block";
      console.log(event.dataTransfer.files[0]);
      const f = event.dataTransfer.files[0];
      input.style.visibility="hidden";
      const formData = new FormData();
      formData.append("video", f);
      try{
        const response = await axios({
          method: "post",
          url: "http://localhost:5000/python/detect_video",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(response);
        console.dir(response);
        setId(response.data[0].video_id);
        setDatas(response.data[3]);
        //0 : video_id
        //1 : 파일 경로
        //2 : type
        //3 : 클래스정보 담겨있는 배열
        let copy = [...label]; //배열의 원본을 수정하는것은 좋지 않다.
        response.data[3].map( (data) =>
          {
            const labels = data.class.split('/');
            labels.map( (label) =>{
            if(label === '0')
            {
              copy[0] += 1;
            }
            else if (label === "Mobile phone")
            {
              copy[1] += 1;
            }
            else if (label === "card")
            {
              copy[2] += 1;
            }
            else if(label ==="license-plate")
            {
              copy[3] += 1;
            }})
          })
          setLabel(copy);
      }catch(error)
      {
        setError('에러 발생');
        console.log(error);
      }finally
      {
        const btnlayer= document.getElementById('btnlayer');
        btnlayer.style.display="flex";
        setLoading(false);
      }
    }

    const fetchVideo = async (event) => {
      preventDefault(event);
      console.log(id);
      const video = document.getElementById("video");
      const source = document.getElementById("source");
      video.style.visibility="visible";
      const response = await axios.get(`http://localhost:5000/python/video/${id}`,{ responseType: 'blob' });
      console.log(response);
      const videoUrl = URL.createObjectURL(response.data);
      source.src = videoUrl;
      video.load();
      // video.play();
      // setVideoUrl(videoUrl);
    };


    //리스너생성
    input.addEventListener('dragover', handleDragOver); //이게 있어야 drop 이 작동됨
    input.addEventListener('drop', handleDrop);
    save.addEventListener('click',fetchVideo);

    return () => {
      //리스너삭제
      input.removeEventListener('dragover', handleDragOver);
      input.removeEventListener('drop', handleDrop);
      save.removeEventListener('click',fetchVideo);
    };
  },[datas,id,setId,label])
  
  return (
    <>
    <MainLayout>
    <div id ="left">
    <Form id="form">
    <SubTitle>등록하고 싶은 영상을 올려주세요</SubTitle>
      <Input  type="file" id="input-file-upload" accept=".mov,.mp4"/>
      <Label ref={inputRef} htmlFor="input-file-upload">
        <div>
          <p>동영상 업로드</p>
        </div> 
      </Label>
      </Form>
      <div id ="pixel">
      <SubTitle>탐색된 정보</SubTitle>
      {(datas.length===0) ? (<CenterText>로딩중</CenterText>) : null }
      {datas.map( (data,id) =>
        (
          <div key={id}>
            <div>&#123;</div>  
            <p> " class " : {data.class}</p>
            <p>" time ": {data.time}</p>
            <div>&#125;,</div>  
          </div>
        ))}
      </div>
      </div>
      <div id="right">
      <VideO controls id="video">
        <source id ="source" src="">
        </source>
    </VideO>

     <div id="findclass">
     <SubTitle>탐색된 클래스</SubTitle>
     { (datas.length===0) ? ( <CenterText>로딩중</CenterText>) : (
     <><p>얼굴 : {label[0]}</p>
     <p>휴대폰 : {label[1]}</p>
     <p>카드 : {label[2]}</p>
     <p>번호판 : {label[3]}</p></>) }
     </div>
      <ButtonLayer id="btnlayer">
      <Button12 type="button" id ="btnSave" ref={saveRef}>동영상을 보려면 클릭!</Button12>
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
display : none;
gap : 25px;
flex-direction: column;
`

const CenterText = styled.div`
text-align : center;
margin-top : 60px;
color : gray;

`