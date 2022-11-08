const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const users = {};
const DIR = 'album/'

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, DIR);
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, `${req.body.id}${ext}`);
        }
    })
});

router.get('/information', (req, res) => res.send(JSON.stringify(users)));

router.get('/', (req, res) => {
    res.render("index");
})

router.get('/create', (req, res) => {
    res.render("create");
})

router.get('/read', (req, res) => {
    res.render("read");
});

router.get('/update', (req, res) => {
    res.render("update");
});

router.get('/delete', (req, res) => {
    res.render("delete");
});

// 학생 정보 추가
router.post('/cid', upload.single('image'), (req, res) => {
    const { id, name, birth, gender } = req.body;
    users[id] = { name, birth, gender, 'img': req.file?.path ?? '', attendance :{} };
    res.render('index');
});

// 학생 정보 조회
router.get('/rid', (req, res) => {
    const id = req?.query?.id;
    res.send(id in users ? JSON.stringify(users[id]) : `존재하지 않은 ID: ${id}`);
});

// 학생 정보 수정
router.post('/uid', upload.single('image'), (req, res) => {
    const { id, name, birth, gender } = req.body;
    if (id in users) {
        if (name) users[id].name = name;
        if (birth) users[id].birth = birth;
        if (gender) users[id].gender = gender;
        if (req.file?.path) {
            if (users[id].img != req.file?.path) fs.unlink(users[id].img, _ => {});
            users[id].img = req.file?.path
        }
    }
    res.render('index');
});

// 학생 정보 삭제
router.get('/did', (req, res) => {
    const id = req?.query?.id;
    if (id in users) {
        if (users[id].img) fs.unlink(users[id].img, _ => {});
        delete users[id];
    }
    res.render('index');
});

module.exports = {users, router};