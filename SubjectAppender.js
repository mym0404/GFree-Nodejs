const admin = require("firebase-admin");
const fs = require('fs');

const serviceAccount = require("./node_modules/serviceAccountKey");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gfree-413fb.firebaseio.com"
});

//fs 모듈을 통해 json 파일을 읽어온다.
let newClassesString = fs.readFileSync('new.json');
let newClasses = JSON.parse(newClassesString);

console.log(newClasses[2])
//현재 학기를 설정한다.
let semester = '2019-1';

//해당학기에 있는 과목들을 가져온다.
admin.database().ref(semester).once('value',(snapshot)=> {

    let index = snapshot.numChildren()-1;

    console.log(index+"개의 데이터 받아오기 성공");
    console.log("새로 추가해야 할 데이터의 수 : "+newClasses.length);

    for(let i = 0;i<newClasses.length ; i++) {
        admin.database().ref(semester).child(index.toString()).set(newClasses[i],(e)=> {
            if(e!=null) {
                console.log("데이터베이스에 쓰기를 실패했습니다.")
            }else {
                console.log("데이터베이스 업데이트 완료." + index)
            }
        });
        index+=1;
    }


});



