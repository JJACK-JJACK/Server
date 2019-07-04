var express = require('express');
var router = express.Router();

const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const utils = require('../../module/utils/utils');

//boardSchema.js 에서 만들어진 board 모델 (모델은 대부분 대문자로 시작)
const Board = require('../../models/boardSchema');

router.get('/', async (req, res) => {
    //오름차순 = 1, 내림차순 = -1
    Board.find().sort({ date: -1 })
        .then((allBoards) => {
            res.status(statusCode.OK).send(utils.successTrue(statusCode.CREATED, resMessage.READ_FAIL, allBoards));
        }).catch((err) => {
            res.status(statusCode.OK).send(utils.successFalse(statusCode.DB_ERROR, resMessage.READ_FAIL));
    });

    //Board의 카
})

router.get('/:category', async (req, res) => {
    //find method
    //첫번째 매개변수 : 쿼리문

    //방법1) statics로 선언한 메소드 사용
    Board.findByCategory(req.params.category)
        .then((boards) => console.log(boards))
        .catch((err) => console.log(err));

    //방법2) model 객체의 find 메소드 사용 : promise 형식
    Board.find({category: req.params.category})
        .then((boards) => console.log(boards))
        .catch((err) => console.log(err));

    //방법3) model 객체의 find 메소드 사용 : 콜백 함수 형식
    Board.find({category: req.params.category}, (err, boards) => {
        console.log(boards);
    })
});

router.post('/', (req, res) => {
    //create method
    //첫번째 매개변수 : 생성할 document 값
    Board.create(req.body)
        .then((result) =>{
            res.status(statusCode.OK).send(utils.successTrue(statusCode.CREATED, resMessage.SAVE_SUCCESS, result));
        }).catch((err) => {
            console.log(err);
            res.status(statusCode.OK).send(utils.successFalse(statusCode.DB_ERROR, resMessage.SAVE_FAIL));
    });
});

router.post('/comment', (req, res) => {
    //update method
    //첫번째 매개변수 : 생성할 document 값
    const boardId = req.body.boardId;
    delete req.body.boardId;

    Board.update({ _id: boardId }, { $push: {comments: req.body}}, (err, result) => {
        if (err) {
            res.status(statusCode.OK).send(utils.successFalse(statusCode.DB_ERROR, "댓글 작성 실패"));
        } else {
            res.status(statusCode.OK).send(utils.successTrue(statusCode.CREATED, "댓글 작성 완료", result));
        }
    });
});

router.put('/', (req, res) => {
    //findOneAndUpdate method
    //첫번째 매개변수 : 어떤 document의 값을 수정할 것 인지 (where 절 같이 조건 쿼리 넣기)
    //두번째 매개변수 : json 형태의 바꿀 값들. 만약 및의 예시처럼 body 값 통째로 넣을 경우 schema의 key 값과 body의 key 값이 동일해야한다.
                    //(body에 있는 key값만 바뀜. 해당 도큐먼트의 다른 key값들은 바뀌지 않음)
    //세번재 매개변수 : options. rawResult를 ture로 해놓을 경우 수정된 document가 결과로 넘온다. 다양한 옵션이 있으니 참고바람.
   Board.findOneAndUpdate({ _id : req.body.id }, req.body, { rawResult: true }, (err, result) => {
       console.log(result);
   })
});

router.delete('/', (req, res) => {
    //remove method
    Board.remove({ _id: req.body.id }, (err) => {
        //에러처리하기
    });

    //deleteOne method : 매칭되는 첫 번째 다큐먼트만 지움
    //Board.deleteOne({ category: req.body.category });

    //deleteMany method : 매칭되는 모든 다큐먼트만 지움
    //Board.deleteMany({ category: req.body.category });
});





module.exports = router;
