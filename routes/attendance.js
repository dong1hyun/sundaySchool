//출석체크 라우트
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const { users } = require('./user');

router.get('/', (req, res) => {
    res.render("attendance");
})

router.get('/attend', (req, res) => {
    res.render("attend");
})

router.get('/attend_info', (req, res) => {
    res.render("attend_info");
})

router.post('/attended', (req, res) => {
    const id = req.body.id;
    const dt = new Date()
    if (id in users) {
        const date = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
        let att_num = Object.keys(users[id].attendance).length;
        if (users[id].attendance[att_num] == date) {
            res.send("이미 출석했습니다");
        }
        else {
            users[id].attendance[++att_num] = date;
            res.render("attendance");
        }

    }
    else {
        res.send(`존재하지 않은 ID: ${id}`);
    }
})

router.get('/attended_info', (req, res) => {
    const id = req?.query?.id;
    res.send(id in users ? JSON.stringify(users[id].attendance) : `존재하지 않은 ID: ${id}`);
});

module.exports = router;
