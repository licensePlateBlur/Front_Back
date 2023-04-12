import React from 'react';
import {BrowserRouter,Route,Routes} from "react-router-dom";
import Main from './Component/Main';
import Banner from './Component/Banner';
import Blind from './Component/Blind';
import Price from './Component/Price';
import Video from './Component/Video';
import Gallery from './Component/Gallery';
function App() {
   

    return (
        <>
        <Banner/>
        <Routes>
        <Route path="/" element={<Main/>}></Route>
        <Route path="/image" element={<Blind/>}></Route>
        <Route path="/video" element={<Video/>}></Route>
        <Route path="/gallery" element={<Gallery/>}></Route>
        <Route path="/price" element={<Price/>}></Route>
        </Routes>
        </>
    );
}

export default App;
