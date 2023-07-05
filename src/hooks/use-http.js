import { useCallback } from "react";

// Costum hook that fetchs from the server and applys data to the set method I pass

const useHttp = () => {
  const setState = useCallback(async (requestConfig, applyData) => {
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : "GET",
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });

      if (!response.ok) {
        throw new Error("Request failed!");
      }

      const data = await response.json();
      applyData(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return { setState };
};

export default useHttp;
