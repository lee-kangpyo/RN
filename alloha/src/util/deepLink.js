export const config = {
    screens: {
      main: {
        screens: {
          daylyReport:{
            initialRouteName: "daylyReport",
            screens:{
              DailyReport:"/owner/DailyReport"
            },
          },
          etc:{
            initialRouteName: "etcScreen",
            screens:{
              ManageCrew:"/owner/ManageCrew"
            }
          },
          schedule:"/crew/schedule",
          manageStore:"/crew/manageStore",
          CommuteCheck:{
            initialRouteName: "CommuteCheckMain",
            screens:{
              CommuteCheckMain:"/crew/CommuteCheck",
              CommuteCheckInfo:"/crew/CommuteCheckInfo"
            }
          },
        },
      },
    },
}