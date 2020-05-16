const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const mysql = require('mysql')

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'douban_movie'
})

conn.connect((err) => {
    if(err) return console.log('连接失败')
    // console.log('连接成功')
})

// 查询数据
// let sql1 = 'SELECT * FROM movies'
// conn.query(sql1, (err, data) => {
//     if (err) return console.log('没有查询到数据')
//     console.log(data)
// })

function addInfo(msg) {
    return new Promise((resolve, reject) => {
        let insertBase = `"${msg.id}", '${msg.rate}', ${msg.cover_x}, '${msg.title}', "${msg.url}", ${msg.playable}, "${msg.cover}", ${msg.cover_y}, ${msg.is_new}`
        let insertInfo = "INSERT INTO movies(`id`, `rate`, `cover_x`, `title`, `url`, `playable`, `cover`, `cover_y`, `is_new`) VALUES(" + insertBase + ")"
        conn.query(insertInfo, null, (err, data) => {
            if(err) return console.log("添加数据失败")
            console.log(data)
            resolve()
        })
    })
}

// INSERT INTO movies(`id`, `rate`, `cover_x`, `title`, `url`, `playable`, `cover`, `cover_y`, `is_new`) VALUES("27010768", '8.8', 1500, '寄生虫', "https:\/\/movie.douban.com\/subject\/27010768\/", false, "https://img3.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p2561439800.webp", 2138, false)
fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
    if(err) return console.log('读取失败')
    let info = JSON.parse(data)
    info.subjects.forEach(item => {
        // 循环添加数据
        async function addMsg() {
            await addInfo(item)
        }
        addMsg()
    })

})

app.listen(3000, () => {
    console.log('server running at http://127.0.0.1:3000')
})