const express = require("express");
const { Op } = require("sequelize");
const { Posts } = require("../models");
const router = express.Router();

//게시글 생성api
router.post("/posts", async(req, res) => {
    const {title, content, password} = req.body;
    const post = await Posts.create({title, content, password});

    res.status(201).json({
        data: post
    });
});

//게시글 목록조회api
router.get("/posts", async(req,res) => {
    const posts = await Posts.findAll({
        attributes: ['postId', 'title', 'createdAt', 'updatedAt']
    });

    res.status(200).json({data: posts});
});

//게시글 상세조회api
router.get("/posts/:postId", async(req, res) => {
    const {postId} = req.params;
    const post = await Posts.findOne({
        where: { postId: postId },  //postId값이 현재 전달받은 postId변수값과 동일한걸 찾아라
        attributes: ['postId', 'title', 'content', 'createdAt', 'updatedAt'],       
    });

    res.status(200).json({data : post});
});


//게시글 수정api
router.put('/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  const { title, content, password } = req.body;

  const post = await Posts.findOne({ where: { postId } });
  if (!post) {
    return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
  } else if (post.password !== password) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  }

  await Posts.update(
    { title, content },
    {
      where: {
        [Op.and]: [{ postId }, [{ password }]], //게시글의 비밀번호와 postId가 일치할때 수정한다.
      }
    }
  );

  res.status(200).json({ data: "게시글이 수정되었습니다." });
});


//게시글 삭제api
router.delete('/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;

  const post = await Posts.findOne({ where: { postId } });
  if (!post) {
    return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
  } else if (post.password !== password) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  }

  //게시글을 삭제
  await Posts.destroy( {
      where: {
        [Op.and]: [{ postId }, [{ password }]], //게시글의 비밀번호와 postId가 일치할때 삭제한다.
      }}
  );

  res.status(200).json({ data: "게시글이 삭제되었습니다." });
});


module.exports = router;