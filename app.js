const express = require('express');  // Express 라이브러리 호출
const app = express();  // express 실행 결과 값을 app 객체를 할당 받음
const port = 3333;  // 포트 번호

const router = require('./routes'); // 통신을 수행하는 Router 생성(index.js안에 있는 module.export로 내보내진 router 가져옴)

// 최 상단에서 request로 수신되는 Post 데이터가 정상적으로 수신되도록 설정한다.
// 주소 형식으로 데이터를 보내는 방식
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router)  // express 전역으로 라우터를 선언하고 정의한다


// 서버 실행
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
  });