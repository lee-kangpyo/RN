const express = require('express')
var router = express.Router();
const {execSql} = require("../../utils/excuteSql");
const { getMinWage } = require('../../query/v2/common');

// 최저 시급 호출
router.get("/getMinWage", async (req, res, next)=>{
    console.log("GET v2.common.getMinWage 최저 시급 호출")
    try {
        const result = await execSql(getMinWage, {});
        const data = result.recordset[0];
        res.status(200).json({resultCode:"00", minWage:data.WAGE, yyyy:data.VALIDFROM.split("-")[0]});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

module.exports = router;