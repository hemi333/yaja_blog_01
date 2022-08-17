const express = require("express"); // Express 라이브러리 호출
const { Comment } = require("../models"); // models의 Comment DB 호출
const { Post } = require("../models"); // models의 Post DB 호출
const router = express.Router(); // 라우터 객체 생성

// 댓글 목록 조회
// 조회하는 게시글에 작성된 모든 댓글을 내림차순 정렬하여 목록 형식으로 보기
router.get("/:postId", async (req, res) => {
  // url 뒤에 params로 전달 받은 postId 사용
  const { postId } = req.params;
  // model 'Comment'에서 받은 모든 데이터를 내림차순으로 조회
  const comments = await Comment.findAll({
    where: { postId },
    order: [["createdAt", "DESC"]],
  });

  // 조회한 데이터를 Response
  res.json({
    comments,
  });
});

// 댓글 작성
// 댓글 내용이 비워둔 채 댓글 작성 API를 호출하면 '댓글 내용을 입력해주세요' 메시지 리턴
router.post("/:postId", async (req, res) => {
  // url 뒤에 params로 전달 받은 postId 사용
  const { postId } = req.params;
  // body로 받을 데이터를 각 변수 password, comment에 넣어줌
  const { password, comment } = req.body;

  // body에 입력받은 comment 값이 없으면 작성 불가
  if (!comment) {
    return res
      .status(400)
      .json({ success: false, message: "댓글 내용을 입력해주세요." });
  }

  // postId와 일치하는 데이터를 detailPost로 불러옴
  const detailPost = await Post.findOne({ where: { postId } });

  // detailPost가 없으면 없다고 Response
  if (!detailPost) {
    return res
      .status(404)
      .json({ success: false, errorMessage: "해당 게시글이 없습니다." });
  }

  // 그 변수들을 Post DB에 생성
  await Comment.create({ password, comment, postId });
  // Response 반환
  res.status(201).json({ success: true, message: "댓글을 생성하였습니다." });
});

// 댓글 수정
// 댓글 내용이 비워둔 채 댓글 작성 API를 호출하면 '댓글 내용을 입력해주세요' 메시지 리턴
router.put("/:commentId", async (req, res) => {
  // url 뒤에 params로 전달 받은 댓글 번호 commentId 사용
  const { commentId } = req.params;
  // body로 받을 데이터를 각 변수 password, comment에 넣어줌
  const { password, comment } = req.body;

  // commentId와 일치하는 데이터를 selectComment로 불러옴
  const selectComment = await Comment.findOne({ where: { commentId } });

  // selectComment가 없으면 없다고 Response
  if (!selectComment) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "해당 댓글이 없습니다." });
  }

  // body에 입력받은 comment 값이 없으면 수정 불가
  if (!comment) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "댓글 내용을 입력해주세요." });
  }

  // 위에서 찾아둔 selectComment의 password와 비교
  if (password !== selectComment.password) {
    return res
      .status(400)
      .json({ errorMessage: "패스워드가 일치하지 않습니다." });
  }

  // 해당 commentId와 맞는 Comment를 update 후 수정하였다는 Response 보냄
  await Comment.update({ comment: comment }, { where: { commentId } });
  res.status(201).json({ success: true, message: "댓글을 수정하였습니다." });
});

// 댓글 삭제
router.delete("/:commentId", async (req, res) => {
  // url 뒤에 params로 전달 받은 댓글 번호 commentId 사용
  const { commentId } = req.params;
  // 비교를 위해 password를 body에 담음
  const { password } = req.body;

  // commentId와 일치하는 데이터를 selectComment로 불러옴
  const selectComment = await Comment.findOne({ where: { commentId } });

  // selectComment가 없으면 없다고 Response
  if (!selectComment) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "해당 댓글이 없습니다." });
  }

  // 위에서 찾아둔 selectComment의 password와 비교
  if (password !== selectComment.password) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "패스워드가 일치하지 않습니다." });
  }

  // 해당 commentId와 맞는 Comment를 destroy 후 삭제하였다는 Response 보냄
  await Comment.destroy({ where: { commentId } });
  res.status(201).json({ success: true, message: "댓글을 삭제하였습니다." });
});

module.exports = router; // router 객체를 외부에 공개
