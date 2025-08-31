import React, { useState, useMemo } from "react";
import { Select, Input, Button, Card } from "antd";
import { initialSongs } from "./musicData";


const { Option } = Select;

const wrap = (cls = "") => `max-w-6xl mx-auto p-6 font-sans ${cls}`;

export default function MusicLibrary({ userRole = "user" }) {
  const [songs, setSongs] = useState(initialSongs);

  // Keep filters as strings; "" = no filter
  const [filters, setFilters] = useState({ title: "", artist: "", album: "" });
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [groupBy, setGroupBy] = useState("none");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSong, setNewSong] = useState({ title: "", artist: "", album: "" });

  // Unique values with reduce
  const uniqueOf = (key) =>
    [...songs.reduce((acc, s) => (s[key] ? acc.add(s[key]) : acc), new Set())];

  // Filter + Sort
  const filteredAndSorted = useMemo(() => {
    const filt = songs.filter((s) => {
      const t = s.title?.toLowerCase() || "";
      const a = s.artist?.toLowerCase() || "";
      const al = s.album?.toLowerCase() || "";
      return (
        t.includes(filters.title.toLowerCase()) &&
        a.includes(filters.artist.toLowerCase()) &&
        al.includes(filters.album.toLowerCase())
      );
    });

    const sorted = [...filt].sort((a, b) => {
      const av = (a[sortBy] ?? "").toString().toLowerCase();
      const bv = (b[sortBy] ?? "").toString().toLowerCase();
      if (av < bv) return sortOrder === "asc" ? -1 : 1;
      if (av > bv) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [songs, filters, sortBy, sortOrder]);

  // Grouping
  const grouped = useMemo(() => {
    if (groupBy === "none") return { "All Songs": filteredAndSorted };
    return filteredAndSorted.reduce((acc, s) => {
      const key = s[groupBy] || "Unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {});
  }, [filteredAndSorted, groupBy]);

  const handleAddSong = (e) => {
    e.preventDefault();
    const id = (songs.length ? Math.max(...songs.map((s) => s.id)) : 0) + 1;
    setSongs((prev) => [...prev, { ...newSong, id }]);
    setNewSong({ title: "", artist: "", album: "" });
    setShowAddForm(false);
  };

  const handleDeleteSong = (id) => setSongs((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className={wrap()}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold ">Music Library</h2>
        <span
          className={[
            "px-3 py-1 rounded-full text-xs font-semibold",
            userRole === "admin" ? "bg-indigo-600 text-white" : "bg-gray-900 text-white",
          ].join(" ")}
        >
          {userRole === "admin" ? "Admin" : "User"}
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
        {/* Filters */}
        <Input
          placeholder="Filter by title"
          value={filters.title}
          onChange={(e) => setFilters((p) => ({ ...p, title: e.target.value }))}
          className="min-w-[200px]"
        />

        {/* Artist filter (fixed: explicit 'All Artists' option + onClear) */}
        <Select
          value={filters.artist}
          onChange={(v) => setFilters((p) => ({ ...p, artist: v }))}
          onClear={() => setFilters((p) => ({ ...p, artist: "" }))}
          className="min-w-[180px]"
          placeholder="All Artists"
          allowClear
        >
          <Option value="">All Artists</Option>
          {uniqueOf("artist").map((v) => (
            <Option key={v} value={v}>
              {v}
            </Option>
          ))}
        </Select>

        {/* Album filter (fixed: explicit 'All Albums' option + onClear) */}
        <Select
          value={filters.album}
          onChange={(v) => setFilters((p) => ({ ...p, album: v }))}
          onClear={() => setFilters((p) => ({ ...p, album: "" }))}
          className="min-w-[180px]"
          placeholder="All Albums"
          allowClear
        >
          <Option value="">All Albums</Option>
          {uniqueOf("album").map((v) => (
            <Option key={v} value={v}>
              {v}
            </Option>
          ))}
        </Select>

        {/* Sort */}
        <Select value={sortBy} onChange={setSortBy} className="min-w-[180px] ml-auto">
          <Option value="title">Sort by Title</Option>
          <Option value="artist">Sort by Artist</Option>
          <Option value="album">Sort by Album</Option>
        </Select>
        <Button onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}>
          {sortOrder === "asc" ? "Asc" : "Desc"}
        </Button>

        {/* Group */}
        <Select value={groupBy} onChange={setGroupBy} className="min-w-[180px]">
          <Option value="none">No Grouping</Option>
          <Option value="artist">Group by Artist</Option>
          <Option value="album">Group by Album</Option>
          <Option value="title">Group by Title</Option>
        </Select>

        {/* Admin: Add toggle */}
        {userRole === "admin" && (
          <Button type="primary" className="ml-auto" onClick={() => setShowAddForm((s) => !s)}>
            {showAddForm ? "Cancel" : "Add Song"}
          </Button>
        )}
      </div>

      {/* Add Song (Admin only) */}
      {userRole === "admin" && showAddForm && (
        <form
          onSubmit={handleAddSong}
          className="flex flex-wrap gap-3 mb-5 p-4 rounded-xl bg-white border border-gray-200"
        >
          <Input
            placeholder="Title"
            value={newSong.title}
            onChange={(e) => setNewSong((p) => ({ ...p, title: e.target.value }))}
            className="min-w-[160px]"
            required
          />
          <Input
            placeholder="Artist"
            value={newSong.artist}
            onChange={(e) => setNewSong((p) => ({ ...p, artist: e.target.value }))}
            className="min-w-[160px]"
            required
          />
          <Input
            placeholder="Album"
            value={newSong.album}
            onChange={(e) => setNewSong((p) => ({ ...p, album: e.target.value }))}
            className="min-w-[160px]"
            required
          />
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </form>
      )}

      {/* Songs */}
      <div className="space-y-7">
        {Object.entries(grouped).map(([groupName, groupSongs]) => (
          <div key={groupName}>
            {groupBy !== "none" && (
              <h3 className="text-gray-800 mb-3 pl-2 border-l-4 border-blue-600 font-semibold">
                {groupName}
              </h3>
            )}

            {groupSongs.length === 0 ? (
              <p className="text-sm text-gray-500">No songs to display.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupSongs.map((song) => (
                  <Card key={song.id} className="rounded-xl border-gray-200" bodyStyle={{ padding: 16 }}>
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h4 className="text-gray-900 text-base font-semibold mb-1">{song.title}</h4>
                        <p className="text-gray-700 font-medium">{song.artist}</p>
                        <p className="text-gray-500 italic">{song.album}</p>
                      </div>
                      {userRole === "admin" && (
                        <Button
                          danger
                          type="text"
                          onClick={() => handleDeleteSong(song.id)}
                          aria-label={`Delete ${song.title}`}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Showing {filteredAndSorted.length} of {songs.length} songs
      </p>
    </div>
  );
}
