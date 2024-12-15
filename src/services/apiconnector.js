import axios from "axios"

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers: null,
        params: params ? params : null,
    });
}  

// export const apiConnector = async (method, url, bodyData, headers, params) => {
//     try {
//       console.log("Request method:", method);
//       console.log("Request URL:", url);
//       console.log("Request body data:", bodyData);
//       console.log("Request headers:", headers);
//       console.log("Request params:", params);
  
//       const response = await axiosInstance({
//         method: `${method}`,
//         url: `${url}`,
//         data: bodyData ? bodyData : null,
//         headers: headers ? headers : null,
//         params: params ? params : null,
//       });
      
//       console.log("Response:", response);
//       return response;
//     } catch (error) {
//       console.error("API request failed:", error);
//       throw error;
//     }
//   };
  