const AlbaJobSave = `
    exec PR_PLYC03_JOBCHECK 'AlbaJobSave', @ymd, '', @cstCo, @userId, @sTime, @eTime, @jobCl, @brkDure, @wage
`
const JumjuJobSave = `
    exec PR_PLYC03_JOBCHECK 'JumjuJobSave', @ymd, '', @cstCo, @userId, @sTime, @eTime, @jobCl, @brkDure, @wage
`

const absent = `
    IF EXISTS (SELECT 1 from PLYADAYABSENT WHERE CSTCO = @cstCo AND USERID = @userId AND YMD = @ymd)
	BEGIN
	    UPDATE PLYADAYABSENT
	    SET 
	        MUSERID = @iUserId,
	        MYMDHMD = GETDATE(),
	        USEYN = @useYn
	    WHERE CSTCO = @cstCo
	   	AND USERID = @userId
	   	AND YMD = @ymd
	END
	ELSE
	BEGIN
	    INSERT INTO PLYADAYABSENT (CSTCO, USERID, YMD, USEYN, IUSERID, IYMDHMD)
	    VALUES (@cstCo, @userId, @ymd, @useYn, 'Qpqpqpqp', GETDATE());
	END
`

const delDSalary = `
    DELETE  PLYDSALARY 
    WHERE	YMD = @ymd
    AND	JIGUBYN = 'N'
    AND	CSTCO = @cstCo
    AND	USERID = @userId
`
const deldJob = `
    delete
    PLYADAYJOB 
    WHERE YMD = @ymd
    AND	CSTCO = @cstCo
    AND	USERID = @userId
`

module.exports = {AlbaJobSave, JumjuJobSave, absent, delDSalary, deldJob}