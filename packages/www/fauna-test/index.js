const faunadb = require("faunadb");
const q = faunadb.query;

var client = new faunadb.Client({ secret: process.env.FAUNA });

// async function run() {
//   const results = await client.query(
//     q.Create(q.Collection("todos"), {
//       data: {
//         text: "whateverX",
//         done: false,
//         owner: "user-text-1"
//       }
//     })
//   );
//   console.log(results.ref.id);
// }

async function run() {
  const results = await client.query(
    q.Paginate(q.Match(q.Index("todos_by_user"), user))
  );
  console.log(results);
}

// async function run() {
//   const results = await client.query(
//     q.Update(q.Ref(q.Collection("todos"), "259171178122314240"), {
//       data: {
//         text: "whatever",
//         done: true,
//         owner: "user-text-2"
//       }
//     })
//   );
//   console.log(results);
// }

run();
