import React,{ Component,useState,useRef,useEffect } from 'react'
import styled from 'styled-components'
import '../App.css';
import axios from 'axios';
const MainLayout = styled.div`
 max-width : 1200px;
 margin : 0 auto;
 display : flex;
 flex-direction: row;
`;
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
width : 600px;
`;

export default function Blind() {
  const [checkm,setCheckm]=useState([true,true,true]);
  const [datas,setDatas]=useState([]);
  const [label,setLabel]=useState([0,0,0,0])
    // ref
    const canvasRef = useRef(null);
    const inputRef = useRef(null);
    const blurRef = useRef(null);
    const hoverRef = useRef(null);
    const saveRef = useRef(null);
    function HandleCancel()
    {
      window.location.reload();
    }
useEffect( () =>{

  const input = inputRef.current; //어떤 객체가 만들어진다고 했는데 이게 이벤트 리스너랑 같은 역활을 한다.
  const canvas = canvasRef.current;
  const blur=blurRef.current;
  const hover=hoverRef.current;
  const save=saveRef.current;
  const context = canvas.getContext('2d',{ willReadFrequently: true });
  const blurctx = blur.getContext('2d',{ willReadFrequently: true });
  const hoverctx = hover.getContext('2d',{ willReadFrequently: true });
  // const hoverctx= hover.getContext('2d',{ willReadFrequently: true });
  canvas.style.display="none";

    // Prevent default browser behavior for drag and drop events
    function preventDefault(event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Handle dragover event
    function handleDragOver(event) {
      preventDefault(event);
      canvas.style.border = '2px dashed black';
    }

    // Handle drop event
    function handleDrop(event) {
      preventDefault(event);
      DrawImage(event);
    }
    
    const DrawImage = async(event) =>
    {
      input.style.visibility="hidden"; //사진드롭시 drop 불가능하게 막기
      canvas.style.border ='none';
      canvas.style.display="block";
      const btnlayer= document.getElementById('btnlayer');
      btnlayer.style.display="flex";
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
        setDatas(response.data);
        let copy = [...label]; //배열의 원본을 수정하는것은 좋지 않다.
        response.data.map( (data) =>
          {
            if(data.name === '0')
            {
              copy[0] += 1;
            }
            else if (data.name === "Mobile phone")
            {
              copy[1] += 1;
            }
            else if (data.name === "card")
            {
              copy[2] += 1;
            }
            else if(data.name ==="license-plate")
            {
              copy[3] += 1;
            }
          })
          setLabel(copy);
      }catch(error)
      {
        console.log(error);
      }
      ////////////////////////////////////////좌표값을 받아오고 진행
      //이미지 로딩이 완료되면 실행할 함수 등록
      const img = new Image();
      img.src =  URL.createObjectURL(f);
        img.onload = () => {
          canvas.width=img.naturalWidth;
          canvas.height=img.naturalHeight;
          blur.width = img.naturalWidth;
          blur.height= img.naturalHeight;
          hover.width = img.naturalWidth;
          hover.height = img.naturalHeight;

          //이미지가 로딩되면 한번 초기화 시키고
          context.clearRect(0,0, canvas.width, canvas.height);
          //이미지를 로딩
          context.drawImage(img, 0, 0,canvas.width, canvas.height); //원본
          blurctx.drawImage(img, 0, 0,canvas.width, canvas.height); //블라인드도 원본으로 초기화
        };
    }

    function BlurOn(x1, y1, width1, height1)
    {
          console.log("on");
          var imageData = context.getImageData(x1,y1,width1,height1); //원하는 좌표가 될것
          console.log(imageData.data);

            const pixels = imageData.data;
            const width = imageData.width;
            const height = imageData.height;
            for (let y = 0; y < height; y += 15) {
              for (let x = 0; x < width; x += 15) {
                let r = 0, g = 0, b = 0;
                let count = 0;
          
                // Sum the RGB values of each pixel in the tile
                for (let dy = 0; dy < 15 && y + dy < height; dy++) {
                  for (let dx = 0; dx < 15 && x + dx < width; dx++) {
                    const index = ((y + dy) * width + (x + dx)) * 4;
                    r += pixels[index];
                    g += pixels[index + 1];
                    b += pixels[index + 2];
                    count++;
                  }
                }
          
                // Calculate the average RGB value for the tile
                const avgR = Math.floor(r / count);
                const avgG = Math.floor(g / count);
                const avgB = Math.floor(b / count);
          
                // Set the RGB values of each pixel in the tile to the average value
                for (let dy = 0; dy < 15 && y + dy < height; dy++) {
                  for (let dx = 0; dx < 15 && x + dx < width; dx++) {
                    const index = ((y + dy) * width + (x + dx)) * 4;
                    pixels[index] = avgR;
                    pixels[index + 1] = avgG;
                    pixels[index + 2] = avgB;
                  }
                }
              }
            }
        blurctx.putImageData(imageData, x1 , y1);
    }
    function BlurOff(x, y, width, height)
    {
        console.log("off");
        var imageData = context.getImageData(x,y,width,height); //원하는 좌표가 될것
        console.log(imageData);
        blurctx.putImageData(imageData, x , y); //블라인드를 매꾼다.
    }

    function SetBlindCheck(i)
    {
      let copy =[...checkm];
      copy[i]=!copy[i];
      setCheckm(copy);
    }
    function ClickHandler(event)
    {
      preventDefault(event);
      const x = event.offsetX;
      const y = event.offsetY;
      datas.map( (data,i ) => {

        if(x >= data.xmin && x <= data.xmax && y>=data.ymin && y<= data.ymax)
        {
          console.log(i);
          if(checkm[i]) //true는 블라인드를 할수 있다.
          {
            BlurOn(data.xmin, data.ymin, data.xmax-data.xmin, data.ymax - data.ymin);
            SetBlindCheck(i);
          }
          else{ //false는 블라인드를해제할수 있다.
            BlurOff(data.xmin, data.ymin, data.xmax-data.xmin, data.ymax- data.ymin);
            SetBlindCheck(i);
          }
        }
  
      })
      console.log(checkm);
    }

    function MouseMoveHandler(event)
    {
      preventDefault(event);
      const x = event.offsetX;
      const y = event.offsetY;
      datas.map( (data )=>{
        console.log(y);
      if(x >= data.xmin && x <= data.xmax && y>=data.ymin && y<= data.ymax)
      {
        hoverctx.strokeStyle = "red";
        console.log(Math.floor(data.ymax)-Math.floor(data.ymin));
        hoverctx.strokeRect(data.xmin, data.ymin, Math.floor(data.xmax)-Math.floor(data.xmin), Math.floor(data.ymax)-Math.floor(data.ymin));
      }
      else if ( x >= 0 && x <=hover.width && y>=0 && y<= hover.height ){
        hoverctx.strokeStyle = "blue";
        hoverctx.strokeRect(data.xmin, data.ymin, Math.floor(data.xmax)-Math.floor(data.xmin), Math.floor(data.ymax)-Math.floor(data.ymin));
      }
      else{
        hoverctx.clearRect(0,0, hover.width, hover.height);
      }

    })
    }
    function MouseOutHandler(event)
    {
      preventDefault(event);
      hoverctx.clearRect(0,0, hover.width, hover.height);
    }
    const Save = async(event) =>
    {
      preventDefault(event);
      console.log("click");
      const blur = document.getElementById('blur');
      const image = blur.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
      var link = document.createElement('a');
      link.download = "mozaic.png";
      link.href = image;
      link.click();

      var blobBin = atob(image.split(',')[1]);	// base64 데이터 디코딩
      var array = [];
      for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
      }
      var blob = new Blob([new Uint8Array(array)], {type: 'image/png'});
      var file = new File([blob], "mozaic.png");
      var formdata = new FormData();	// formData 생성
      formdata.append("file", file);	// file data 추가
      try{
        const response = await axios({
          method: "post",
          url: "http://localhost:8080/upload",
          data: formdata,
          processData: false,
          contentType: false,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }catch(error)
      {
        console.log(error);
      }
    }

    //리스너생성
    input.addEventListener('dragover', handleDragOver); //이게 있어야 drop 이 작동됨
    input.addEventListener('drop', handleDrop);
    hover.addEventListener('click',ClickHandler);
    hover.addEventListener('mousemove',MouseMoveHandler);
    hover.addEventListener('mouseout',MouseOutHandler);
    save.addEventListener('click',Save);
    return () => {
      //리스너삭제
      input.removeEventListener('dragover', handleDragOver);
      input.removeEventListener('drop', handleDrop);
      hover.removeEventListener('click',ClickHandler);
      hover.removeEventListener('mousemove',MouseMoveHandler);
      hover.removeEventListener('mouseout',MouseOutHandler);
      save.removeEventListener('click',Save);
    };

},[checkm,datas,label])

  return (
    <>
    <MainLayout>
    <div id ="left">
    <Form id="form">
    <SubTitle>등록하고 싶은 사진을 올려주세요</SubTitle>
      <Input  type="file" id="input-file-upload" multiple={true} />
      <Label ref={inputRef} htmlFor="input-file-upload">
        <div>
          <p>사진 업로드</p>
        </div> 
      </Label>
      </Form>
      <div id ="pixel">
      <SubTitle>탐색된 정보</SubTitle>
        {(datas.length===0) ? (<CenterText>사진을 올려주세요</CenterText>) : null }
        {datas.map( (data) =>
        (
          <div>
            <div>&#123;</div>  
            <p> " class" : {data.class}</p>
            <p> " 정확도 " : {data.confidence}%</p>
            <p>" name " : {data.name}</p>
            <p> " xmax " : {data.xmax}</p>
            <p>" xmin " : {data.xmin}</p>
            <p>" ymax " : {data.ymax}</p>
            <p>" ymin " : {data.ymin}</p>
            <div>&#125;,</div>  
          </div>
        ))}
      </div>
      </div>

      <div id="right">
    
      <canvas id ="canvas" ref={canvasRef} />
      <canvas id= "blur" ref={blurRef}/>
      <canvas id="hover" ref={hoverRef} />
     <FindClass>
     <SubTitle>탐색된 클래스</SubTitle>
     { (datas.length===0) ? ( <CenterText>사진을 올려주세요</CenterText>) : (
     <><p>얼굴 : {label[0]}</p>
     <p>휴대폰 : {label[1]}</p>
     <p>카드 : {label[2]}</p>
     <p>번호판 : {label[3]}</p></>) }
     </FindClass>
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
display : none;
gap : 25px;
flex-direction: column;
`

const FindClass = styled.div`
  overflow-y:scroll;
  margin-top: 430px;
  width: 600px;
  height: 250px;
  border: 1px solid black;
  border-radius: 16px;
  background-color: #f8fafc;
  &::-webkit-scrollbar{
    display: none;
  }
`

const CenterText = styled.div`
text-align : center;
margin-top : 60px;
color : gray;

`
