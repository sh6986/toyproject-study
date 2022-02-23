/**
 * 스터디종류(카테코리) 조회
 */
axios.get('/recruit/category')
    .then((res) => {
        const category = res.data;
        let innerHtml = ``;

        category.forEach((item, index, arr) => {
            innerHtml += `
                <option value="${item.cc_name}">${item.cc_desc}</option>
            `;    
        });

        document.getElementById('sgCategory').innerHTML = innerHtml;
    })
    .catch((err) => {
        console.error(err);
    });

/**
 * 기술스택 조회
 */
// [TODO] 생성 안됨..
axios.get('/recruit/tech')
    .then((res) => {
        const tech = res.data;
        let innerHtml = ``;

        tech.forEach((item, index, arr) => {
            innerHtml += `
                <option value="${item.cc_name}">${item.cc_desc}</option>
            `
        });
    })
    .catch((err) => {
        console.error(err);
    })

/**
 * 만들기버튼 클릭시 -> 스터디 생성
 */
document.getElementById('createBtn').addEventListener('click', (e) => {
    const srTitle = document.getElementById('srTitle').value;           // 제목
    const sgName = document.getElementById('sgName').value;             // 스터디명
    const sgCnt = document.getElementById('sgCnt').value;               // 인원
    const sgCategory = document.getElementById('sgCategory').value;     // 카테고리(코드)
    const stCode = [];             // 기술스택이름(코드)
    const srContent = document.getElementById('srContent').value;       // 내용

    // 기술스택 선택한 값 반복문돌려서 가져오기
    document.getElementById('stCode').querySelectorAll('option').forEach((item, index, arr) => {
        if (item.selected) {
            stCode.push(item.value);
        }
    });

    const study = {
        srTitle, sgName, sgCnt, sgCategory, stCode, srContent
    };
    
    axios.post('/recruit', {
        study
    })
        .then((res) => {
            console.log(res);
            location.href = '/';
        })
        .catch((err) => {
            console.error(err);
        });
});
