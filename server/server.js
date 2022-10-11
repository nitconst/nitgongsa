const express = require("express");
const path = require('path');
const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', (req, res) =>
{
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });

app.listen(port, ()=>{
    console.log(`Connect at http://localhost:${port}`); // '가 아닌 좌측상단의 esc버튼 밑의 `다.
})


//아래 코드 항상 최하단에 위치
app.get('*', (req, res) =>
{
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });

