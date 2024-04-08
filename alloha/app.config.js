export default ({ config }) => {
    // console.log(config);
    // console.log(process.env.GOOGLE_SERVICES_JSON);
    
    const android = {
      ...config.android, 
      "googleServicesFile": process.env.GOOGLE_SERVICES_JSON, 
    };

    const ios = {
      ...config.ios, 
    }

    return {
      ...config,  
      "android": android,
      "ios":ios,
    };
  };
