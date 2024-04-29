function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // 여기에 서버로 로그인 요청을 보내는 코드를 작성할 수 있습니다.
    // 이 예제에서는 간단하게 로컬 스토리지에 사용자 정보를 저장하여 로그인 처리를 합니다.
    localStorage.setItem('username', username);
    
    updateUI();
}

function logout() {
    // 로그아웃 처리
    localStorage.removeItem('username');
    updateUI();
}

function updateUI() {
    var loggedIn = document.getElementById('loggedIn');
    var loginForm = document.getElementById('loginForm');

    if (localStorage.getItem('username')) {
        // 로그인 상태
        loggedIn.style.display = 'block';
        loginForm.style.display = 'none';
        document.getElementById('loggedInUsername').textContent = localStorage.getItem('username');
    } else {
        // 로그아웃 상태
        loggedIn.style.display = 'none';
        loginForm.style.display = 'block';
    }
}

// 페이지 로드 시 UI 업데이트
window.onload = function() {
    updateUI();
};