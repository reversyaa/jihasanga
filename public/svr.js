const express = require('express')
const mysql = require('mysql') // 잘안되면 npm install mysql해서 패키지 다운
const path = require('path')
const static = require('serve-static') //위에 두개는 경로때문에
//const dbconfig = require('./config/dbconfig.json' ) // 얘가 dbconfig 받아와주는 코드임 -> 중요한정보 분리가능

//database connection pool
const pool = mysql.createPool({  // pool? -> 공유하는 공간 만들기 -> 연결하게해줌 섬 - 섬 배역할
    connectionLimit: 10, //연결 배 10개만
    host: "127.0.0.1", //host: 'dbconfig.host',
    user: "root", //user: 'dbconfig.user',
    password: "ioplm77&&", //password: 'dbconfig.password',
    database: "jihaDB", //database: 'dbconfig.database',  -> 오류떠서 이렇게함
    debug:false
})

const app = express()
app.use(express.urlencoded({extended:true})) // 웹브라우저가 url안에 인코딩된 정보를 가지고옴
app.use(express.json()) //
app.use('/public', static(path.join(__dirname, 'public'))); // 퍼블릭이 정확이 뭔지 집어주는 코드
//아래 코드 앱에서 '/process/adduser'에게 해달라고 요청함
app.post('/process/adduser', (req, res)=>{ //req가 웹브라우저에서 올라온 정보받기, res가 웹브라우저에게 답변할때 정보
    console.log('/process/adduser 호출됨'+ req)

    const paramId = req.body.id; // 보낸걸 각각 뽑기 시작
    const paramName = req.body.name;
    const paramAge = req.body.age;
    const paramPassword = req.body.password; // 이것들 가져다가 db 테이블에 보낼꺼임-> 이젠 커넥션이 필요
// 아래코드, 커넥션을 얻음
    pool.getConnection((err, conn)=>{ //놀고있는 배 내놔라 커넥션없으면 err 주고 있으면  db와 연결 되있는 conn 연결
        
        if(err){
            conn.release();
            console.log('Mysql getConnection error. aborted');
            res.writeHead('200', {'content-Type':'text/html; charset=utf8'}) // 이 아래부턴 답장 보여주는 것
            res.write('<h1>db 서버 연결 실패</h1>')
            res.end();
            return;
        }

        console.log('데이터베이스 연결 끈 얻음'); // 커넥션있으면 끈 얻음

        
        //conn.query('insert into users (id, name, age, password) values(?,?,?,password(?));', // mysql에서 지원하는 함수들
        const exec = conn.query('INSERT INTO users (id, name, age, password) VALUES (?, ?, ?, SHA2(?, 256))',
        [paramId, paramName, paramAge, paramPassword],
        (err, result)=>{
            conn.release(); // 풀한테 돌려줌 끝났으면
            console.log('실행된 SQL: ' +exec.sql) // exec.sql이 위 ?에 값을 다 넣어줌
            
            if(err){
                console.log('SQL 실행시 오류 발생')
                console.dir(err); // 에러면 끝내
                res.writeHead('200', {'content-Type':'text/html; charset=utf8'}) // 이 아래부턴 답장 보여주는 것
                res.write('<h1>SQL query실행 실패</h1>')
                res.end();
                return
            }

            if(result){ //성공
                console.dir(result)
                console.log('Inserted 성공')

                res.writeHead('200', {'content-Type':'text/html; charset=utf8'})
                res.write('<h2>사용자 추가 성공</h2>')
                res.end();
            }
            else{ //없음
                console.log('Inserted 실패')

                res.writeHead('200', {'content-Type':'text/html; charset=utf8'})
                res.write('<h1>사용자 추가 실패</h1>')
                res.end();
            }
        })


    })
});

app.listen(3000,()=>{
    console.log('Listening on port 3000')

})