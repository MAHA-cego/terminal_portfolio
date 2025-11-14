export const filesystem: { [key: string]: string | { [key: string]: string } } = {
  home: {
    projects: "folder",
    documents: "folder",
    "about.txt": "text file",
  },
  usr: {
    bin: "folder",
    lib: "folder",
  },
  tmp: {
    "cache": "folder",
  },
};
