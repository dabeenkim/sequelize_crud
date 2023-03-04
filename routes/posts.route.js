const express = require("express");
const {Op} = require("sequelize");
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
router.put("/posts/:postId", async(req, res) => {
    const {postId} = req.params;
    const {title, content, password} =req.body;

    const post = await Posts.findOne({
        where: {postId : postId},
    });

    if(!post) {
        return res.status(404).json({
            message:"게시글이 존재하지 않습니다."
        });
    }else if(post.password !== password){
        return res.status(401).json({
            message: "게시글의 비밀번화와 전달받은 비밀번호가 일치하지않습니다."
        });
    }

    await Posts.update(
        { title, content }, //수정할 컬럼 및 데이터
        {
            where:{
                [Op.end]: [{postId}, {password}]    //게시글의 비밀번호와 postId가 일치할 때 수정한다.
            },
        }  //어떤 데이터를 수정할지 작성
    );

    return res.status(200).json({message:"게시글이 수정되었습니다."})
})
module.exports = router;