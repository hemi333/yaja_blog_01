const express = require("express"); // Express 라이브러리 호출
const { Post } = require("../models"); // models의 Post DB 호출
const router = express.Router(); // 라우터 객체 생성

// 전체 게시글 조회 (GET)
// 작성 날짜 기준으로 내림차순 정렬 (제목, 내용, 작성날짜 조회)
router.get("/", async (req, res) => {
  // model 'Post'에서 모든 데이터를 내림차순으로 조회
  const posts = await Post.findAll({ order: [["createdAt", "DESC"]] });

  // 조회한 데이터를 Response
  res.json({
    posts,
  });
});

// 게시글 상세 조회 (GET)
router.get("/:postId", async (req, res) => {
  // url 뒤에 params로 전달 받은 postId 사용 (/1 이런식으로)
  const { postId } = req.params;
  // postId와 일치하는 데이터를 detailPost로 불러옴
  const detailPost = await Post.findOne({
    where: { postId },
  });

  // detailPost가 없으면 없다고 Response
  if (!detailPost) {
    return res
      .status(404)
      .json({ success: false, errorMessage: "해당 게시글이 없습니다." });
  }

  // 조회한 데이터를 Response
  res.json({
    detailPost,
  });
});

// 게시글 생성 (POST)
router.post("/", async (req, res) => {
  // body로 받을 데이터를 각 변수 password, title, content에 넣어줌
  const { password, title, content } = req.body;

  // 그 변수들을 Post DB에 생성
  await Post.create({ password, title, content });

  // Response 반환
  res.status(201).json({ success: true, message: "게시글을 생성하였습니다." });
});

// 게시글 수정 (PUT)
// API 호출 시 입력된 비밀번호와 동일할 때만 글이 수정되게 하기
router.put("/:postId", async (req, res) => {
  // url 뒤에 params로 전달 받은 postId 사용
  const { postId } = req.params;
  // 수정 내용을 body로 받음
  const { password, title, content } = req.body;
  // postId와 일치하는 데이터를 detailPost로 불러옴
  const detailPost = await Post.findOne({ where: { postId } });

  // detailPost가 없으면 없다고 Response
  if (!detailPost) {
    return res
      .status(404)
      .json({ success: false, errorMessage: "해당 게시글이 없습니다." });
  }

  // 위에서 찾아둔 detailPost의 password와 비교
  if (password !== detailPost.password) {
    console.log(password, detailPost.password);
    return res
      .status(401)
      .json({ errorMessage: "패스워드가 일치하지 않습니다." });
  }

  // 해당 postId와 맞는 Post를 update 후 수정하였다는 Response 보냄
  await Post.update({ title: title, content: content }, { where: { postId } });
  res.status(200).json({ success: true, message: "게시글을 수정하였습니다." });
});

// 게시글 삭제
// API 호출 시 입력된 비밀번호와 동일할 때만 글이 삭제되게 하기
router.delete("/:postId", async (req, res) => {
  // url 뒤에 params로 전달 받은 postId 사용
  const { postId } = req.params;
  // 비교를 위해 password를 body에 담음
  const { password } = req.body;

  // postId와 일치하는 데이터를 detailPost로 불러옴
  const detailPost = await Post.findOne({ where: { postId } });

  // detailPost가 없으면 없다고 Response
  if (!detailPost) {
    return res
      .status(404)
      .json({ success: false, errorMessage: "해당 게시글이 없습니다." });
  }

  // 위에서 찾아둔 detailPost의 password와 비교
  const db_password = detailPost["password"];
  if (password !== db_password) {
    return res
      .status(401)
      .json({ errorMessage: "패스워드가 일치하지 않습니다." });
  }

  // 해당 postId와 맞는 Post를 destroy 후 삭제하였다는 Response 보냄
  await Post.destroy({ where: { postId } });
  res.status(200).json({ success: true, message: "게시글을 삭제하였습니다." });
});

module.exports = router; // router 객체를 외부에 공개
