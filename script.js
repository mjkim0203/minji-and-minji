const video = document.getElementById('video');
const videoContainer = document.getElementById('videoContainer');
const loadingMessage = document.getElementById('loadingMessage');
let canvas;
let displaySize;
let ctx; 

const MODEL_URL = './models'; 

let faceDetections = [];

let currentMessage = "카메라를 바라보세요";
let messageTimer;

// 1. 모델 로드 (SSD Mobilenetv1 - 얼굴 감지 전용)
async function loadModels() {
    console.log("모델 로딩 시작...");
    loadingMessage.style.display = 'block'; 

    try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        console.log("얼굴 탐지 모델(SSD) 완료!");
        console.log("모든 모델 로드 완료!");
    } catch (error) {
        console.error("모델 로드 실패:", error);
        loadingMessage.innerText = "모델 로드에 실패했습니다. (ssd_mobilenetv1 파일 확인)";
    } finally {
        loadingMessage.style.display = 'none'; 
    }
}

// 2. 웹캠 시작 (구형 호환 .then() 사용)
function startVideo() {
    console.log("웹캠 시작 시도...");
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(function(stream) {
            console.log("웹캠 스트림 확보 성공.");
            video.srcObject = stream;
        })
        .catch(function(err) {
            console.error("웹캠 접근 오류:", err);
            loadingMessage.style.display = 'block';
            loadingMessage.innerText = "웹캠 권한을 허용해주세요.";
        });
}

// 3. 실시간 감지 시작 (성능 최적화: 200ms)
function startDetection() {
    canvas = faceapi.createCanvasFromMedia(video);
    videoContainer.append(canvas);
    displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    ctx = canvas.getContext('2d', { willReadFrequently: true }); 

    // 0.2초(200ms)에 한 번씩만 얼굴 감지
    setInterval(detectFaces, 200); 

    // 그리기는 0.1초(100ms)마다 실행 (더 부드럽게)
    setInterval(drawLoop, 100); 

    // 시간 갱신은 3초마다
    messageTimer = setInterval(updateMessage, 3000); 
}

// 3-1. 감지 루프 (rAF 제거)
async function detectFaces() {
    if (video.readyState < 3) { 
        return; 
    }

    const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options());
    
    console.log('얼굴 감지 루프 실행 중... 찾은 얼굴:', detections.length);
                                
    faceDetections = faceapi.resizeResults(detections, displaySize);
}


// 4. 안내 문구 갱신 (시간 갱신용)
function updateMessage() {
    const time = getFormattedTime();
    currentMessage = `${time}분의 민지`; 
}

// 5. 그리기 루프 (오류 수정됨)
function drawLoop() {
    if (!ctx || (loadingMessage && loadingMessage.style.display === 'block')) return; 
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (faceDetections.length > 0) {
        // [수정됨] .detection 제거
        const box = faceDetections[0].box; 
        
        // 메인 메시지 그리기
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; 
        ctx.fillRect(box.x - 10, box.y - 40, box.width + 20, 35);
        ctx.fillStyle = "#FFFF00"; 
        ctx.font = '22px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(currentMessage, box.x + box.width / 2, box.y - 15);

    } else { 
        // [얼굴 감지 안됨]
        ctx.fillStyle = "#FFFFFF";
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("카메라를 바라보세요", canvas.width / 2, canvas.height / 2); 
    }
}

// --- 헬퍼 함수 (Helper Functions) ---

function getFormattedTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// --- 스크립트 실행 (구형 호환) ---
function main() {
    video.addEventListener('play', function() {
        console.log("Video is playing. Starting model load...");
        
        loadModels().then(function() {
            if (!loadingMessage || loadingMessage.style.display === 'none') { 
                startDetection();
                console.log("Detection started.");
            }
        });
    });
    
    startVideo(); 
}

main();
