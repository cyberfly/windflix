import { useState, useCallback } from "react";

const useQueryFilter = () => {
  function updateUrlQueryString(key: string, value: string | number) {
    let searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has(key)) {
      searchParams.set(key, value);
    } else {
      searchParams.append(key, value);
    }

    // if key is not page, we need to reset pagination to page 1

    if (key != "page") {
      searchParams.set("page", "1");
    }

    let search_params_string = decodeURIComponent(searchParams.toString());

    return search_params_string;
  }

  return { updateUrlQueryString };
};

export default useQueryFilter;
