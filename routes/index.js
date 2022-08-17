const express = require('express'); // Express 라이브러리 호출
const router = express.Router(); // 라우터 객체 생성

// '/posts', '/comments'로 들어오는 것들 처리
const postsRouter = require('./posts');
const commentsRouter = require('./comments');

router.use('/posts', postsRouter);
router.use('/comments', commentsRouter);

module.exports = router;  // router 객체를 외부에 공개 (app.js에서 사용할 수 있도록)