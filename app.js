const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let torrentList = [
  { id: 1, name: "Max Payne" },
  { id: 2, name: "Biomutant" },
  { id: 3, name: "Age of Empires" },
];

app.get("/", (req, res) => {
  return res.send(
    '<h1>Home Page</h1><a href="/api/torrents">To Torrents API</a>'
  );
});

app.get("/api/torrents", (req, res) => {
  let newTorrentList = [...torrentList];
  const { search, limit } = req.query;

  if (limit) {
    newTorrentList = newTorrentList.slice(0, Number(limit));
  }

  if (search) {
    newTorrentList = newTorrentList.filter((torrent) => {
      return torrent.name.startsWith(search);
    });
  }

  if (newTorrentList < 1) {
    return res.status(200).json({ success: true, data: [] });
  }

  return res.status(200).json(newTorrentList);
});

app.get("/api/torrents/:torrentID", (req, res) => {
  const { torrentID } = req.params;

  const singleTorrent = torrentList.find((torrent) => {
    if (torrent.id === Number(torrentID)) {
      return torrent;
    }
  });

  if (!singleTorrent) {
    return res.status(404).send("No torrent with the provided ID");
  }

  return res.json(singleTorrent);
});

app.post("/api/torrents", (req, res) => {
  const newID = torrentList[torrentList.length - 1].id + 1;
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, "Error Message": "Give proper credentials" });
  }

  torrentList.push({ id: newID, name: name });
  return res.status(200).json(torrentList);
});

app.put("/api/torrents/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;

  const singleTorrent = torrentList.find((torrent) => {
    if (torrent.id === Number(id)) {
      return torrent;
    }
  });

  if (!singleTorrent) {
    return res.status(404).json({
      success: false,
      "Error Message": "Data with provided ID not found",
    });
  }

  torrentList = torrentList.map((torrent) => {
    if (torrent.id === Number(id)) {
      torrent.name = name;
    }
    return torrent;
  });

  return res.status(200).json(torrentList);
});

app.delete("/api/torrents/:id", (req, res) => {
  const id = req.params.id;

  const torrentIndex = torrentList.findIndex(
    (torrent) => torrent.id === Number(id)
  );
  console.log(torrentIndex);

  if (torrentIndex == -1) {
    return res.status(404).json({
      success: false,
      "Error Message": "Data with provided ID not found",
    });
  }

  torrentList.splice(torrentIndex, 1);

  return res.status(200).json(torrentList);
});

app.all("*", (req, res) => {
  return res.status(404).send("404 Page Not Found");
});

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
