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
