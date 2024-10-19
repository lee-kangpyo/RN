const PLmanager = `
    exec PR_PLYE01_PL  @cls, @ymdFR, @ymdTo, @cstCo, @plItCo, @amt
`
const getCustomPlData = `
    SELECT c.CATEGORYNO, c.PLITGROUP, c.CSTCO, c.CNAME CONA, s.YMD, isnull(s.AMT, 0) AMT
    FROM PLYECUSTOMCATEGORY c
    LEFT JOIN PLYECUSTOMEPL s ON c.CATEGORYNO = s.CATEGORYNO AND s.YMD BETWEEN @ymdFr AND @ymdTo AND s.AMT > 0
    WHERE c.CSTCO = @cstCo
    AND (c.USEYN = 'Y'  OR s.YMD IS NOT NULL)
`
const saveCustomPlData = `
    IF EXISTS (SELECT 1 FROM PLYECUSTOMCATEGORY WHERE CATEGORYNO = @categoryNo AND CSTCO = @cstCo)
    BEGIN 
        IF EXISTS (SELECT 1 FROM PLYECUSTOMEPL WHERE CATEGORYNO = @categoryNo AND CSTCO = @cstCo AND YMD = @ymd)
        BEGIN
            UPDATE PLYECUSTOMEPL
            SET  AMT=@amt, MUSERID = @userId, MYMDHMD = getdate()
            WHERE CATEGORYNO = @categoryNo
            AND CSTCO = @cstCo
        END
        ELSE
        BEGIN
            INSERT INTO PLYECUSTOMEPL (CATEGORYNO, YMD, CSTCO, PLITGROUP, AMT, IUSERID, IYMDHMD)
            VALUES (@categoryNo, @ymd, @cstCo, '0100', @amt, @userId, getdate())
        END
    END
`

const getCustomCategory = `
    select * from PLYECUSTOMCATEGORY WHERE CSTCO = @cstCo and USEYN = 'Y'
`

//사용안함
const customCategory = `
    IF EXISTS (SELECT 1 FROM PLYECUSTOMCATEGORY WHERE CATEGORYNO = @categoryNo AND CSTCO = @cstCo)
    BEGIN
        UPDATE PLYECUSTOMCATEGORY
        SET CNAME = @cName, USEYN = 'Y', MUSERID=@userId, MYMDHMD = getdate()
        WHERE CATEGORYNO = @categoryNo
        AND CSTCO = @cstCo
    END
    ELSE
    BEGIN
        INSERT INTO PLYECUSTOMCATEGORY (CNAME, PLITGROUP, CSTCO, USEYN, IUSERID, IYMDHMD)
        VALUES (@cName, '0100', @cstCo, 'Y', @userId, getdate())
    END
`
const updateCustomCategory = `
    IF EXISTS (SELECT 1 FROM PLYECUSTOMCATEGORY WHERE CATEGORYNO = @categoryNo AND CSTCO = @cstCo AND USEYN = 'Y')
    BEGIN
        UPDATE PLYECUSTOMCATEGORY
        SET CNAME = @cName, MUSERID=@userId, MYMDHMD = getdate()
        WHERE CATEGORYNO = @categoryNo
        AND CSTCO = @cstCo
    END
`
const addCustomCategory = `
    IF NOT EXISTS (SELECT 1 FROM PLYECUSTOMCATEGORY WHERE CNAME = @cName AND CSTCO = @cstCo AND USEYN = 'Y')
    BEGIN
        INSERT INTO PLYECUSTOMCATEGORY (CNAME, PLITGROUP, CSTCO, USEYN, IUSERID, IYMDHMD)
        VALUES (@cName, '0100', @cstCo, 'Y', @userId, getdate())
    END
`
const addCustomCategory_old = `
    IF NOT EXISTS (SELECT 1 FROM PLYECUSTOMCATEGORY WHERE CNAME = @cName AND CSTCO = @cstCo)
    BEGIN
        INSERT INTO PLYECUSTOMCATEGORY (CNAME, PLITGROUP, CSTCO, USEYN, IUSERID, IYMDHMD)
        VALUES (@cName, '0100', @cstCo, 'Y', @userId, getdate())
    END
    ELSE
    BEGIN
        UPDATE PLYECUSTOMCATEGORY
        SET USEYN = 'Y', MUSERID=@userId, MYMDHMD = getdate()
        WHERE CNAME = @cName
        AND CSTCO = @cstCo
    END
`
const delCustomCategory = `
    UPDATE PLYECUSTOMCATEGORY
    SET USEYN = 'N', MUSERID=@userId, MYMDHMD = getdate()
    WHERE CATEGORYNO = @categoryNo
    AND CSTCO = @cstCo
`

module.exports = { PLmanager, getCustomPlData, saveCustomPlData, getCustomCategory, customCategory, addCustomCategory,  updateCustomCategory, delCustomCategory}