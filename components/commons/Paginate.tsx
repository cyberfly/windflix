"use client";
import { FC, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useQueryFilter from "@/hooks/useQueryFilter";

interface iPaginate {
  page: number;
}

const Paginate: FC<iPaginate> = (props) => {
  const { page } = props;

  const router = useRouter();
  const searchParams = useSearchParams();

  const { updateUrlQueryString } = useQueryFilter();

  const handlePageClick = (event: Event, type: string) => {
    let new_page = page;

    if (type == "prev") {
      new_page = Number(page) - 1;
    }

    if (type == "next") {
      new_page = Number(page) + 1;
    }

    let new_query_string = updateUrlQueryString("page", new_page);

    router.push(`/?${new_query_string}`);
  };

  //TODO: handle pagination state (disabled, page less than 1, etc)

  return (
    <>
      <ul className="flex items-center space-x-4">
        <li>
          <button
            className="rounded bg-gray-900 px-2 py-1 text-white p-1"
            onClick={(e) => handlePageClick(e, "prev")}
          >
            prev page
          </button>
        </li>
        <li>
          <button
            className="rounded bg-gray-900 px-2 py-1 text-white p-1"
            onClick={(e) => handlePageClick(e, "next")}
          >
            next page
          </button>
        </li>
      </ul>
    </>
  );
};

export default Paginate;
