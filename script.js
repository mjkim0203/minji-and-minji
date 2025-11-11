// 1. 필요한 HTML 요소들을 선택합니다.
const settingsPanel = document.getElementById('settings-panel');
const bodyElement = document.body;
const htmlElement = document.documentElement; // <html> 태그

// 2. 설정 패널(#settings-panel) 내부에서 'change' 이벤트가 발생하는지 감지합니다.
settingsPanel.addEventListener('change', (event) => {
    
    if (event.target.type === 'radio') {
        const settingName = event.target.name; // 예: "font-size"
        const settingValue = event.target.value; // 예: "small"

        // 3. 어떤 설정이 바뀌었는지에 따라 다른 동작을 수행합니다.
        
        if (settingName === 'font-size') {
            // 글자 크기 변경: <body>에 클래스 적용
            bodyElement.classList.remove('font-small', 'font-standard', 'font-large');
            bodyElement.classList.add(`font-${settingValue}`);
        
        } else if (settingName === 'layout-width') {
            // 너비 변경: <body>에 클래스 적용
            bodyElement.classList.remove('width-standard', 'width-wide');
            bodyElement.classList.add(`width-${settingValue}`);
        
        } else if (settingName === 'theme') {
            // 테마 변경: <html>에 data-theme 속성 적용
            
            if (settingValue === 'auto') {
                // '자동'을 위한 로직 (시스템 설정 감지)
                // 우선 '라이트'로 설정하고, 필요시 미디어 쿼리 로직을 추가할 수 있습니다.
                // (참고: 실제 '자동'은 CSS의 prefers-color-scheme 미디어 쿼리로 구현하는 것이 더 좋습니다)
                htmlElement.setAttribute('data-theme', 'light'); 
            } else {
                htmlElement.setAttribute('data-theme', settingValue); // 'light' 또는 'dark'
            }
        }
    }
});

/*
============================================
★ 2. 검색창 필터링 기능 (새로 추가된 코드)
============================================
*/

// 1. 검색창과 모든 인물 프로필(article) 요소를 선택합니다.
const searchInput = document.getElementById('search-input');
const allProfiles = document.querySelectorAll('.person-profile');

// 2. 검색창에 'input'(키보드 입력) 이벤트가 발생할 때마다 함수를 실행합니다.
searchInput.addEventListener('input', (event) => {
    
    // 3. 사용자가 입력한 검색어를 가져와서, 비교하기 쉽도록 소문자로 바꿉니다.
    const searchTerm = event.target.value.toLowerCase();

    // 4. 모든 프로필을 하나씩 확인합니다 (forEach 반복문).
    allProfiles.forEach(profile => {
        
        // 5. 각 프로필의 <h1> 제목 텍스트를 가져와서 소문자로 바꿉니다.
        const titleElement = profile.querySelector('h1');
        const title = titleElement.textContent.toLowerCase();

        // 6. 제목(title)에 검색어(searchTerm)가 포함되어 있는지 확인합니다.
        if (title.includes(searchTerm)) {
            // 7. (포함 O) 프로필을 다시 보이게 합니다.
            profile.style.display = ''; // 'block'이나 'flex' 대신 ''로 기본값 복원
        } else {
            // 8. (포함 X) 프로필을 숨깁니다.
            profile.style.display = 'none';
        }
    });
});



/*
============================================
★ 3. '임시' 편집 기능 (새로 추가된 코드)
============================================
*/

// 1. 필요한 요소들을 선택합니다.
const editButton = document.getElementById('edit-button');
const contentArea = document.getElementById('content-area');

// 2. '편집' 버튼을 클릭했을 때의 동작을 정의합니다.
editButton.addEventListener('click', (event) => {
    event.preventDefault(); // 링크의 기본 동작(페이지 이동)을 막음

    if (contentArea.isContentEditable) {
        // --- 2-1. 현재 '편집 모드'일 때 (저장 클릭) ---
        contentArea.contentEditable = false; // 편집 기능 끄기
        editButton.textContent = '편집'; // 버튼 텍스트 '편집'으로
        editButton.style.color = 'var(--link-color)';
        
        // (선택사항) 방문자의 브라우저에 임시 저장
        localStorage.setItem('savedContent', contentArea.innerHTML);

    } else {
        // --- 2-2. '편집 모드'가 아닐 때 (편집 클릭) ---
        contentArea.contentEditable = true; // ★ HTML 콘텐츠를 편집 가능하게 만듦
        contentArea.focus(); // 콘텐츠 영역에 커서를 둠
        editButton.textContent = '저장'; // 버튼 텍스트 '저장'으로
        editButton.style.color = '#008000'; // 저장 버튼은 초록색으로
    }
});

// (선택사항) 페이지가 로드될 때, 브라우저에 임시 저장된 내용이 있으면 불러오기
window.addEventListener('load', () => {
    const savedContent = localStorage.getItem('savedContent');
    if (savedContent) {
        contentArea.innerHTML = savedContent;
    }
});
