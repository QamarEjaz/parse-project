import React from "react";

const FormErrors = ({ error }) => {
  if (!error) return null;

  return (
    <div className="rounded-md bg-red-50 p-4 col-span-2">
      <div className="flex">
        <div className="">
          <h3 className="text-sm font-medium text-red-800">{error?.message}</h3>
          {error?.errors?.length ? (
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc pl-5 space-y-1">
                {error?.errors?.map
                  ? error?.errors?.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))
                  : null}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FormErrors;
