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
     * 수정하기 버튼 클릭시
     */
    document.getElementById('updateBtn').addEventListener('click', () => {
        const user = {
            userNickname: document.getElementById('nickname').value
        };

        modifyNickname(user);
    });

    /**
     * 회원탈퇴 버튼 클릭시
     */
    document.getElementById('scsnOkBtn').addEventListener('click', () => {
        scsnUser();
    });
}

/**
 * 유효성검사
 */
function checkNickname() {

}

/**
 * 닉네임 수정
 */
function modifyNickname(user) {
    axios.put(`/user/nickName`, user)
        .then(() => {
            location.reload();
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 회원 탈퇴
 */
function scsnUser() {
    axios.delete(`/user`)
        .then(() => {
            location.href = `/`;
        })
        .catch(err => {
            console.error(err);
        });
}