"use client";
import { FC, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useQueryFilter from "@/hooks/useQueryFilter";

interface iPaginate {
  page: number;
  total_pages: number;
}

const Paginate: FC<iPaginate> = (props) => {
  const { page, total_pages } = props;

  const router = useRouter();
  const searchParams = useSearchParams();

  const { updateUrlQueryString } = useQueryFilter();

  const handlePageClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    type: string
  ) => {
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

  return (
    <>
      <ul className="flex items-center space-x-4">
        <li>
          <button
            disabled={page == 1}
            className="rounded bg-slate-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-500 px-4 py-2 text-slate-100 hover:text-slate-900 p-1"
            onClick={(e) => handlePageClick(e, "prev")}
          >
            Prev
          </button>
        </li>
        <li>
          <button
            disabled={page == total_pages}
            className="rounded bg-slate-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-500 px-4 py-2 text-slate-100 hover:text-slate-900 p-1"
            onClick={(e) => handlePageClick(e, "next")}
          >
            Next
          </button>
        </li>
      </ul>
    </>
  );
};

export default Paginate;
