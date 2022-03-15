const common = {
    /**
     * 세션에 저장된 사용자ID 가져오기
     */
    getSessionUserId: () => {
        const sessionUserId = document.getElementById('sessionUserId').value;
        return sessionUserId;
    },

    /**
     * 기술스택명 span 태그 만들기
     */
    innerStName: (stNameDesc) => {
        const stNameArr = stNameDesc.split(',');
        let innerStName = ``;

        stNameArr.forEach((stName, i) => {
            innerStName += `<span class="stNameStyle">${stName}</span>`;
        });

        return innerStName;
    },

    /**
     * 빈칸 체크
     */
    isEmpty: (value) => {
        if (value === '' || value === null || value === undefined || !value.length || ( typeof value === 'object' && !Object.keys(value).length )) {
            return true;
        }
        
        return false;
    }
};