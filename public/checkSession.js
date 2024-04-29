// 세션 확인 함수
function checkSession() {
    // 서버로 세션 확인 요청을 보냅니다.
    fetch('/session')
        .then(response => {
            if (!response.ok) {
                throw new Error('세션 확인에 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            // 세션이 유효한 경우 사용자 프로필을 가져옵니다.
            fetch('/profile')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('프로필 정보를 가져오는 데 실패했습니다.');
                    }
                    return response.json();
                })
                /*
                .then(profile => {
                    // 사용자 프로필을 화면에 표시합니다.
                    displayProfile(profile);
                })
                */
                .catch(error => {
                    console.error(error);
                });
        })
        .catch(error => {
            console.error(error);
        });
}
// 함수를 모듈화해서 내보냅니다
export default checkSession;
/*
// 다른 파일에서 checkSession 함수를 사용할 때
const checkSession = require('./checkSession'); // 모듈을 불러옵니다.

// 페이지 로드 시 세션 확인 및 사용자 프로필 표시
window.onload = function() {
    checkSession();
};

// checkSession 함수를 호출하여 세션을 확인하고 프로필을 표시합니다.
checkSession();
*/


/*
// 사용자 프로필을 화면에 표시하는 함수
function displayProfile(profile) {
    var profileElement = document.getElementById('profile');
    profileElement.innerHTML = `
        <h2>사용자 프로필</h2>
        <p>이름: ${profile.name}</p>
        <p>이메일: ${profile.email}</p>
        <!-- 기타 프로필 정보 표시 -->
    `;
}
*/