/* --- script.js: 설정 패널 기능 (AI 기능 없음) --- */

document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const pageWrapper = document.getElementById('page-wrapper');
    const rightPanel = document.getElementById('settings-panel');
    
    // 이전에 저장된 설정을 로드합니다.
    const savedFont = localStorage.getItem('fontSize') || 'font-standard';
    const savedWidth = localStorage.getItem('layoutWidth') || 'width-standard';
    const savedTheme = localStorage.getItem('colorTheme') || 'light';
    
    // 초기 설정 적용
    body.classList.add(savedFont, savedWidth);
    
    // 테마 설정 (body에 data-theme 속성 추가)
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
    } else {
        body.removeAttribute('data-theme');
    }

    // 초기 라디오 버튼 상태 반영
    const fontRadio = document.querySelector(`input[name="font-size"][value="${savedFont.replace('font-', '')}"]`);
    if (fontRadio) fontRadio.checked = true;

    const widthRadio = document.querySelector(`input[name="layout-width"][value="${savedWidth.replace('width-', '')}"]`);
    if (widthRadio) widthRadio.checked = true;

    const themeRadio = document.querySelector(`input[name="theme"][value="${savedTheme}"]`);
    if (themeRadio) themeRadio.checked = true;


    // --- 이벤트 리스너 설정 ---
    if (rightPanel) {
        rightPanel.addEventListener('change', (event) => {
            const target = event.target;
            
            if (target.name === 'font-size') {
                // 글자 크기 변경
                const newFont = 'font-' + target.value;
                body.classList.remove('font-small', 'font-standard', 'font-large');
                body.classList.add(newFont);
                localStorage.setItem('fontSize', newFont);

            } else if (target.name === 'layout-width') {
                // 너비 변경
                const newWidth = 'width-' + target.value;
                body.classList.remove('width-standard', 'width-wide');
                body.classList.add(newWidth);
                localStorage.setItem('layoutWidth', newWidth);
                
            } else if (target.name === 'theme') {
                // 색상 테마 변경
                const newTheme = target.value;
                if (newTheme === 'dark') {
                    body.setAttribute('data-theme', 'dark');
                } else {
                    body.removeAttribute('data-theme');
                }
                localStorage.setItem('colorTheme', newTheme);
            }
        });
    }
});
