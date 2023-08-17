export default ({ config }) => {
    //console.log(config);
    return {
      ...config,  
      "android":{
        "googleServicesFile": process.env.GOOGLE_SERVICES_JSON,
        "package": "com.akmz.alloha"
      }
    };
  };
