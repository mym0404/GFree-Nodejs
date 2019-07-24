const admin = require("firebase-admin");
const fs = require('fs');

const serviceAccount = require("./node_modules/serviceAccountKey");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gfree-413fb.firebaseio.com"
});

//fs 모듈을 통해 json 파일을 읽어온다.
let newClassesString = fs.readFileSync('190201.json');
let newClasses = JSON.parse(newClassesString);


//현재 학기를 설정한다.
let semester = '2019-1';

//해당학기에 있는 과목들을 가져온다.

admin.database().ref(semester).once('value',(snapshot)=> {
    snapshot.forEach( (_class) => {
        //새롭게 추가할 과목들과 코드를 하나하나 비교한다.
        for(let i=0;i<newClasses.length;i++) {
            // console.log(_class.child('code').val());
            // console.log(newClasses[i].code);
            if(_class.child('code').val() === newClasses[i].code) {

                newClasses[i].member = _class.child('member').val()
            }
        }

    });
    admin.database().ref(semester).set(newClasses,(e)=> {
        if(e!=null) {
            console.log("데이터베이스에 쓰기를 실패했습니다.")
        }else {
            console.log("데이터베이스 업데이트 완료.")
            removeNonExistCodeFromUsers()
        }
    });
});

function removeNonExistCodeFromUsers() {

//유저들중, 없어진 과목의 코드를 갖고 있는 것을 지운다.
    admin.database().ref('users').once('value', (snapshot) => {

        //유저 한명한명을 검사
        snapshot.forEach(function (user) {

            //유저가 이번 학기에 갖고 있는 과목이 있다면,
            if (user.hasChild(semester)) {
                user.child(semester).forEach(function (subject) {
                    let isExist = false;
                    let nonExistCode = "";

                    for (let i = 0; i < newClasses.length; i++) {
                        if (newClasses[i].code === subject.key) {
                            isExist = true;
                            nonExistCode = subject.key;
                            break;
                        }
                    }

                    if (isExist === false) {
                        user.child(semester).child(nonExistCode).ref.remove((e)=> {
                            if(e!=null) {
                                console.log("유저의 코드를 지우는 과정에서 에러 발생")
                            }else {
                                console.log(user.child('email').val()+"의 "+nonExistCode+"를 삭제");
                            }

                        });
                    }

                });
            }


        });

    });
    console.log("프로그램 종료");
}