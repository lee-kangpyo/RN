const question = `
    INSERT INTO PLYQQUESTION (TITLE, CONTENT, USERID, STAT, USEYN, IYMDHMD, IUSERID)
    VALUES (@title, @content, @userId, 'R', 'Y', GETDATE(), @userId)
`
const questionList = `
    SELECT QUESTIONNO, TITLE, STAT, IYMDHMD 
    FROM PLYQQUESTION 
    WHERE USERID = @userId AND USEYN = 'Y' 
    order by IYMDHMD desc
`

const questionDetail = `
    SELECT TITLE, CONTENT, STAT, IYMDHMD 
    FROM PLYQQUESTION 
    WHERE USERID = @userId AND USEYN = 'Y' 
    AND QUESTIONNO = @questionNo
    order by IYMDHMD desc
`

const answerList = `
    SELECT QUESTIONNO, CONTENT, ANSWERNA, USEYN, IYMDHMD 
    FROM PLYQANSWER 
    WHERE QUESTIONNO = @questionNo
    AND USEYN  = 'Y'
    ORDER BY ANSWERNO ASC 
`

module.exports = { question, questionList, questionDetail, answerList }