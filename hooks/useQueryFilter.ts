import { useState, useCallback } from "react";

const useQueryFilter = () => {
  type QueryParams = Record<string, string | number>;

  function updateUrlQueryString(params: QueryParams) {
    let searchParams = new URLSearchParams(window.location.search);

    Object.entries(params).forEach(([key, value]) => {
      if (searchParams.has(key)) {
        searchParams.set(key, value.toString());
      } else {
        searchParams.append(key, value.toString());
      }
    });

    // If key is not "page", reset pagination to page 1
    if (!params.hasOwnProperty("page")) {
      searchParams.set("page", "1");
    }

    let search_params_string = decodeURIComponent(searchParams.toString());

    return search_params_string;
  }

  return { updateUrlQueryString };
};

export default useQueryFilter;
