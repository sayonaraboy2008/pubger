import { Router } from 'express';
import Tournament from '../models/Tournament';
import Group from '../models/Group';
import Player from '../models/Player';
import Match from '../models/Match';
import ClassicResult from '../models/ClassicResult';

const router = Router();

// --- DB Seeding Endpoint (to import initial state) ---
router.post('/seed', async (req, res) => {
  try {
    const { tournaments, groups, players, matches, classicResults } = req.body;
    
    // Clear existing data
    await Tournament.deleteMany({});
    await Group.deleteMany({});
    await Player.deleteMany({});
    await Match.deleteMany({});
    await ClassicResult.deleteMany({});

    // Keep old IDs to make migration from localstorage easier
    const insertedTournaments = await Tournament.insertMany(
      tournaments.map((t: any) => ({ ...t, _id: t.id }))
    );
    const insertedGroups = await Group.insertMany(
      groups.map((g: any) => ({ ...g, _id: g.id }))
    );
    const insertedPlayers = await Player.insertMany(
      players.map((p: any) => ({ ...p, _id: p.id }))
    );
    const insertedMatches = await Match.insertMany(
      matches.map((m: any) => ({ ...m, _id: m.id }))
    );
    const insertedClassicResults = await ClassicResult.insertMany(
      classicResults.map((r: any) => ({ ...r, _id: r.id }))
    );

    res.json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to seed data" });
  }
});

// --- App Data Endpoint ---
router.get('/data', async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    const groups = await Group.find();
    const players = await Player.find();
    const matches = await Match.find();
    const classicResults = await ClassicResult.find();
    
    res.json({
      tournaments,
      groups,
      players,
      matches,
      classicResults
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// --- Tournaments ---
router.post('/tournaments', async (req, res) => {
  try {
    const { id, ...data } = req.body;
    const tournament = new Tournament({ _id: id, ...data });
    await tournament.save();
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: "Failed to create tournament" });
  }
});

router.put('/tournaments/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: "Failed to update tournament" });
  }
});

router.delete('/tournaments/:id', async (req, res) => {
  try {
    await Tournament.findByIdAndDelete(req.params.id);
    await Group.deleteMany({ tournamentId: req.params.id });
    await Player.deleteMany({ tournamentId: req.params.id });
    await Match.deleteMany({ tournamentId: req.params.id });
    await ClassicResult.deleteMany({ tournamentId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete tournament" });
  }
});

// --- Groups ---
router.post('/groups', async (req, res) => {
  try {
    const { id, ...data } = req.body;
    const group = new Group({ _id: id, ...data });
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: "Failed to create group" });
  }
});

router.delete('/groups/:id', async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);
    await Player.deleteMany({ groupId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete group" });
  }
});

// --- Players ---
router.post('/players', async (req, res) => {
  try {
    const { id, ...data } = req.body;
    const player = new Player({ _id: id, ...data });
    await player.save();
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Failed to create player" });
  }
});

router.put('/players/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Failed to update player" });
  }
});

router.delete('/players/:id', async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete player" });
  }
});

// --- Matches ---
router.post('/matches/bulk', async (req, res) => {
  try {
    const matches = req.body;
    const inserted = await Match.insertMany(matches.map((m: any) => ({ ...m, _id: m.id })));
    res.json(inserted);
  } catch (error) {
    res.status(500).json({ error: "Failed to create matches" });
  }
});

router.put('/matches/:id', async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: "Failed to update match" });
  }
});

router.post('/matches/bulk-update', async (req, res) => {
  try {
    const updates = req.body; // array of matches to update
    for (const m of updates) {
      await Match.findByIdAndUpdate(m.id, m);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to bulk update matches" });
  }
});

// --- Classic Results ---
router.post('/classicResults', async (req, res) => {
  try {
    const { id, ...data } = req.body;
    const result = new ClassicResult({ _id: id, ...data });
    await result.save();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create classic result" });
  }
});

router.put('/classicResults/:id', async (req, res) => {
  try {
    const result = await ClassicResult.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update classic result" });
  }
});

router.delete('/classicResults/:id', async (req, res) => {
  try {
    await ClassicResult.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete classic result" });
  }
});

export default router;
