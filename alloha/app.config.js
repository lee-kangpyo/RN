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
      "updates": {
        "url": "https://u.expo.dev/0dd79bb6-37ee-41de-ab18-ae35b01e55a2"
      },
      "runtimeVersion": {
        "policy": "appVersion"
      }
    };
  };
