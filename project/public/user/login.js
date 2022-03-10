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
        login();
    });
}

/**
 * 패스워드 입력창에서 엔터키누를시 login
 */
function enterKey() {
    if (window.event.keyCode == 13) {
        login();
    }
}

/**
 * 로그인
 */
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPwd').value;
    const loginUser = {
        email,
        password
    };

    axios.post(`/auth/login`, loginUser)
        .then(res => {
            location.href = '/';
        })
        .catch(err => {
            console.error(err);
        }) ;
}
