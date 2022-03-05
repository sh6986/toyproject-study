window.onload = () => {
    // 화면 초기화
    initPage();

    // 이벤트 등록
    setEventListener();
};

/**
 * 화면 초기화
 */
function initPage() {

}

/**
 * 이벤트 등록
 */
function setEventListener() {
    /**
     * 로그인 버튼(->) 클릭시
     */
    document.getElementById('loginSubmit').addEventListener('click', (e) => {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPwd').value;
        const loginUser = {
            email,
            password
        };

        login(loginUser);
    });
}

/**
 * 로그인
 */
function login(loginUser) {
    axios.post(`/auth/login`, loginUser)
        .then(res => {
            console.log(res);
            location.href = '/';
        })
        .catch(err => {
            console.error(err);
        }) ;
}