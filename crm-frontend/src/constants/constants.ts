export interface dataTypeFiltersProps {
  String: {
    value: string;
    getInput: boolean;  
  }[];
  Number: {
    value: string;
    getInput: boolean;
  }[];
  Boolean: {
      value: string;
      getInput: boolean;
  }[];
  Array: {
      value: string;
      getInput: boolean;
  }[];
  Object: {
      value: string;
      getInput: boolean;
  }[];
  Date: {
      value: string;
      getInput: boolean;
  }[];
  Pointer: {
    value: string;
    getInput: boolean;
  }[];
}

export const dataTypeFilters: dataTypeFiltersProps = {
  "String": [
    {
      value: "exists",
      getInput: false,
    },
    {
      value: "doesNotExist",
      getInput: false,
    },
    {
      value: "equalTo",
      getInput: true,
    },
    {
      value: "notEqualTo",
      getInput: true,
    },
    {
      value: "startsWith",
      getInput: true,
    },
    {
      value: "endsWith",
      getInput: true,
    },
    {
      value: "contains",
      getInput: true,
    },
    {
      value: "fullText",
      getInput: true,
    },
  ],
  "Number": [
    {
      value: "exists",
      getInput: false,
    },
    {
      value: "doesNotExist",
      getInput: false,
    },
    {
      value: "equalTo",
      getInput: true,
    },
    {
      value: "notEqualTo",
      getInput: true,
    },
    {
      value: "lessThan",
      getInput: true,
    },
    {
      value: "lessThanOrEqualTo",
      getInput: true,
    },
    {
      value: "greaterThan",
      getInput: true,
    },
    {
      value: "greaterThanOrEqualTo",
      getInput: true,
    },
  ],
  "Boolean": [
    {
      value: "exists",
      getInput: false,
    },
    {
      value: "doesNotExist",
      getInput: false,
    },
    {
      value: "equalTo",
      getInput: true,
    },
    {
      value: "notEqualTo",
      getInput: true,
    },
  ],
  "Array": [
    {
      value: "exists",
      getInput: false,
    },
    {
      value: "doesNotExist",
      getInput: false,
    },
    {
      value: "containsAll",
      getInput: true,
    },
    {
      value: "matchesQuery",
      getInput: true,
    },
    {
      value: "doesNotMatchQuery",
      getInput: true,
    },
    {
      value: "matchesKeyInQuery",
      getInput: true,
    },
    {
      value: "doesNotMatchKeyInQuery",
      getInput: true,
    }
  ],
  "Object": [
    {
      value: "exists",
      getInput: false,
    },
    {
      value: "doesNotExist",
      getInput: false,
    },
    {
      value: "matchesKeyInQuery",
      getInput: true,
    },
    {
      value: "doesNotMatchKeyInQuery",
      getInput: true,
    },
    {
      value: "matchesQuery",
      getInput: true,
    },
    {
      value: "doesNotMatchQuery",
      getInput: true,
    },
    {
      value: "containsAll",
      getInput: true,
    }
  ],
  "Date": [
    {
      value: "exists",
      getInput: false,
    },
    {
      value: "doesNotExist",
      getInput: false,
    },
    {
      value: "equalTo",
      getInput: true,
    },
    {
      value: "notEqualTo",
      getInput: true,
    },
    {
      value: "greaterThan",
      getInput: true,
    },
    {
      value: "greaterThanOrEqualTo",
      getInput: true,
    },
    {
      value: "lessThan",
      getInput: true,
    },
    {
      value: "lessThanOrEqualTo",
      getInput: true,
    },
  ],
  "Pointer": [
    {
      value: "exists",
      getInput: false,
    },
    {
      value: "doesNotExist",
      getInput: false,
    },
    {
      value: "equalTo",
      getInput: true,
    },
    {
      value: "notEqualTo",
      getInput: true,
    }
  ],
}
