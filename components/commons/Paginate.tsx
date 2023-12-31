"use client";
import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface iPaginate {
  page: number;
}

const Paginate: FC<iPaginate> = (props) => {
  const { page } = props;

  const router = useRouter();
  const searchParams = useSearchParams();

  //TODO: handle pagination state (disabled, page less than 1, etc)

  return (
    <>
      <ul className="flex items-center space-x-4">
        <li>
          <button
            className="rounded bg-gray-900 px-2 py-1 text-white p-1"
            onClick={() => {
              router.push(`/?page=${Number(page) - 1}`);
            }}
          >
            prev page
          </button>
        </li>
        <li>
          <button
            className="rounded bg-gray-900 px-2 py-1 text-white p-1"
            onClick={() => {
              router.push(`/?page=${Number(page) + 1}`);
            }}
          >
            next page
          </button>
        </li>
      </ul>
    </>
  );
};

export default Paginate;
