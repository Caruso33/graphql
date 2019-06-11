let COUNTER_OF_IDS = "12";

let users = [
  { id: "1", name: "Mui", email: "mui@lu.com", age: 11, comments: ["9"] },
  { id: "2", name: "Tobi", email: "tobi@lu.com", age: 12, comments: [] },
  { id: "3", name: "Tui", email: "tui@lu.com", age: 13, comments: ["10", "11"] }
];

let queues = [
  {
    id: "4",
    title: "Hospital Medication",
    processed: false,
    how_many_before: 0,
    user: "3",
    comments: []
  },
  {
    id: "5",
    title: "Hospital Medication",
    processed: false,
    how_many_before: 1,
    user: "1",
    comments: ["9"]
  },
  {
    id: "6",
    title: "Hospital Medication",
    processed: false,
    how_many_before: 2,
    user: "2",
    comments: []
  },
  {
    id: "7",
    title: "Hospital Doctor Appointment",
    processed: false,
    how_many_before: 0,
    user: "2",
    comments: ["10"]
  },
  {
    id: "8",
    title: "Hospital Doctor Appointment",
    processed: false,
    how_many_before: 1,
    user: "3",
    comments: ["11"]
  }
];

let comments = [
  {
    id: "9",
    title: "Hilarious!",
    body: "Good fast service, highly appreciated",
    queue: "5",
    user: "1"
  },
  {
    id: "10",
    title: "Just Bad!",
    body: "Unfriendly, long waiting",
    queue: "7",
    user: "3"
  },
  {
    id: "11",
    title: "Best hospital in town!",
    body: "Love it every time I go there",
    queue: "8",
    user: "3"
  }
];

const db = {
  COUNTER_OF_IDS,
  users,
  queues,
  comments
};

export { db as default };
