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
    /**
     * 수정시 카테고리가 모각코일때 기술스택 안보이게
     */
    if (document.getElementById('sgCategory').value === '004') {
        document.getElementById('techStack').classList.add('noVisible');
    } else {
        document.getElementById('techStack').classList.remove('noVisible');
    }
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    const mode = document.getElementById('mode').value;
    let study = {};

    /**
     * 카테고리 모각코 선택시 기술스택 안보이게 -> 선택안하게
     */
    document.getElementById('sgCategory').addEventListener('change', (e) => {
        if (e.target.value === '004') {
            document.getElementById('techStack').classList.add('noVisible');
        } else {
            document.getElementById('techStack').classList.remove('noVisible');
        }
    });

    if (mode === 'create') {     // 생성일때
        /**
         * 만들기버튼 클릭시 -> 스터디 생성
         */
        document.getElementById('createBtn').addEventListener('click', async () => {
            study = getValue();
            
            try {
                if (await checkStudy(study)) {
                    createRecruit(study);
                }
            } catch (err) {
                console.error(err);
            }
        });

    } else {                    // 수정일때
        /**
         * 수정하기버튼 클릭시 -> 스터디 수정
         */
        document.getElementById('updateBtn').addEventListener('click', async () => {
            study = getValue();
            study.sgId = document.getElementById('sgId').value;

            try {
                if (await checkStudy(study)) {
                    modifyRecruit(study);
                }
            } catch (err) {
                console.error(err);
            }
        });
    }

    /**
     * 취소버튼 클릭시 -> 생성 - 리스트로 이동, 수정 - 해당글 상세로 이동
     */
    document.getElementById('cancelBtn').addEventListener('click', () => {
        const sgId = document.getElementById('sgId').value;
        location.href = mode === 'create' ? `/` : `/detail/${sgId}`;
    });
}

/**
 * 각 입력값 가져오기
 */
function getValue() {
    const srTitle = document.getElementById('srTitle').value;       // 제목
    const sgName = document.getElementById('sgName').value;         // 스터디명
    const sgCnt = document.getElementById('sgCnt').value;           // 인원
    const sgCategory = document.getElementById('sgCategory').value; // 카테고리 (코드)
    const srContent = document.getElementById('srContent').value;   // 내용
    const stCode = [];                                              // 기술스택
    const study = {srTitle, sgName, sgCnt, sgCategory, srContent};
    
    if (study.sgCategory !== '004') {   // 카테고리가 모각코일시 기술스택 선택안함
        document.getElementById('stCode').querySelectorAll('option').forEach((item, index, arr) => {    // 기술스택 선택한 값 반복문돌려서 가져오기
            if (item.selected) {
                stCode.push(item.value);
            }
        });
        study.stCode = stCode;
    }

    return study;
}

/**
 * 유효성 검사
 */
async function checkStudy(study) {
    let result = false;
    const mode = document.getElementById('mode').value;

    // 입력하지 않은 값이 있을때
    for (let k of Object.keys(study)) {
        if (common.isEmpty(study[k])) {
            document.getElementById('validate').innerHTML = common.validateEm('빈칸 없이 입력해 주세요.');
            return result;
        }
    }
    
    if (mode === 'modify') {
        try {
            const sgId = document.getElementById('sgId').value;
            const detail = await getRecruitDetail(sgId);

            if (study.sgCnt < detail.SM_CNT) {      // 수정시 수정하려는 인원수가 현재 스터디원보다 적을때
                document.getElementById('validate').innerHTML = common.validateEm('변경하려는 스터디인원이 현재 스터디인원보다 적습니다.');
                return result;

            } else if (Number(study.sgCnt) === detail.SM_CNT) {     // 현재 스터디원이랑 같은값으로 변경시 openyn을 n으로 변경
                await common.modifyComplete(sgId);  // 스터디 모집완료
                location.href = `/`;
                return true;
            }
        } catch (err) {
            console.error(err);
        }
    } 
    return true;
}

/**
 * 스터디모집글 상세 조회
 */
async function getRecruitDetail(sgId) {
    try {
        const result = await axios.get(`/manage/detail/${sgId}`);
        return result.data;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 스터디 / 스터디 모집글 생성
 */
function createRecruit(study) {
    axios.post('/recruit', study)
        .then(res => {
            const sgId = res.data.sgId;
            location.href = `/detail/${sgId}`;
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 스터디 / 스터디 모집글 수정
 */
function modifyRecruit(study) {
    axios.put('/recruit', study)
        .then(res => {
            const sgId = res.data.sgId;
            location.href = `/detail/${sgId}`;
        })
        .catch(err => {
            console.error(err);
        });
}

