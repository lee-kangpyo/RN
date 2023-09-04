

const getTraceUserList = `
    SELECT USERID, UUID, MIN(DATE_FORMAT(CHKTIME, '%Y-%m-%d %H:%i:%s')) MIN, MAX(DATE_FORMAT(CHKTIME, '%Y-%m-%d %H:%i:%s')) MAX
    FROM PLYUSERTRACE 
    WHERE UUID != ''
    GROUP BY USERID, UUID
    ORDER BY USERID, MIN(CHKTIME)
`;

const getMyusersTrace = `
    SELECT DISTINCT USERID, CSTCO, JOBYN, LAT, LON, DATE_FORMAT(CHKTIME, '%Y-%m-%d') YMD, DATE_FORMAT(CHKTIME, '%H:%i:%s') TIME, UUID 
    FROM PLYUSERTRACE 
    ORDER BY CHkTime
`;

const getMyuserTrace = `
    SELECT DISTINCT USERID, CSTCO, JOBYN, LAT, LON, DATE_FORMAT(CHKTIME, '%Y-%m-%d') YMD, DATE_FORMAT(CHKTIME, '%H:%i:%s') TIME, UUID 
    FROM PLYUSERTRACE 
    WHERE USERID = ?
    AND UUID = ?
    ORDER BY CHkTime
`;

module.exports = { getTraceUserList, getMyuserTrace, getMyuserTrace};