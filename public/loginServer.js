const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 세션 설정
app.use(session({
    secret: 'secret', // 임의의 비밀 키
    resave: false,
    saveUninitialized: true
}));

// 사용자 데이터베이스 대신 임의의 사용자 정보
const users = {
    'john': 'password',
    'emma': '123456'
};

// 로그인 엔드포인트
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        req.session.isLoggedIn = true;
        req.session.username = username;
        res.send('Login successful');
    } else {
        res.status(401).send('Invalid username or password');
    }
});

// 로그아웃 엔드포인트
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.send('Logout successful');
});

// 세션 상태 확인 엔드포인트
app.get('/session', (req, res) => {
    if (req.session.isLoggedIn) {
        res.send(`Logged in as ${req.session.username}`);
    } else {
        res.status(401).send('Not logged in');
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
