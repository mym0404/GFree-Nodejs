const admin = require("firebase-admin");

const serviceAccount = require("./node_modules/serviceAccountKey");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gfree-413fb.firebaseio.com"
});

//Notice Data
let data= {
    title: "2/7, 2/8, 2/15 시간표 수정",
    notibody: "죄송합니다 바빴습니다;;",
    body: "* 02/02 수정사항\n\n"+
"- 최원일 교수님 [GS3764_ 뇌와 인지] 월수 3교시\n\n"+
"- 정원진/서준혁 교수님 [CH2105_ 화학합성실험] 2분반 추가\n\n"+

"* 02/07 수정사항\n\n"+
"- 이광록 교수님[BS3204_생물물리화학] 교과목 명칭 변경: 생물물리화학 → 생물물리 화학 입문\n\n"+
"- 다런윌리엄스 교수님[BS4207_암생물학 개론] 수금 1교시 → 화목 1교시\n\n"+
"- 방윤수 교수님[CH2102_물리화학A/ CH3104_물리화학 II] 연습시간 수 17:30~18:20 (※ 공지사항: 화학전공 필수과목 수강안내 참고)\n\n"+

"- 코넬리우쇼키키우 교수님[GS1101-4반_일반물리학 및 연습 I] 수업시간 변경: 화목3교시 → 월수 1교시\n\n"+
"- 김희숙 교수님[GS1490-3반, 4반_소프트웨어 기초와 코딩] 수업시간 변경: 3반 화목 1교시, 4반 화목 2교시\n\n"+
"- 코넬리우쇼키키우 교수님[PS4206_핵 및 입자물리] 수업시간 변경: 월수 4교시\n\n"+
"- 김근영 교수님[PS4214_고급 양자 물리] 수업시간 변경: 월수 5교시\n\n"+

"* 02/08 수정사항\n\n"+
"- 박우진,송미령,진석원 교수님[BS4201_발생생물학] 수업시간 표기 오류로 인한 정정(화목 2교시)\n\n"+

"* 02/15 수정사항\n\n"+
"- 이수정 교수님[GS1513-01_글쓰기의 기초: 창의적 글쓰기] 과목 변경 → [GS1531-01_심화 글쓰기: 과학글쓰기]\n\n",
    time : (new Date()).getTime(),
    writer : "MJ",

};

// The topic name can be optionally prefixed with "/topics/".
var topic = 'NOTICE';


var message = {
    data: {
        title: data.title,
        body: data.notibody
    },
    topic: topic,
    android: {
        ttl: 3600 * 1000, // 1 hour in milliseconds
        priority: 'high'
    },
};

// Send a message to devices subscribed to the provided topic.
admin.messaging().send(message)
    .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
    })
    .catch((error) => {
        console.log('Error sending message:', error);
    });


// Save Notice to Database
var db = admin.database();
var ref = db.ref("notice");
ref.push(data,(error)=> {
    if(error != null) {
        console.log("공지사항이 등록에 실패했습니다.");
    }else {
        console.log("공지사항이 등록되었습니다.");
    }
});




