import { Router } from 'express';
import Tournament from '../models/Tournament';
import Group from '../models/Group';
import Player from '../models/Player';
import Match from '../models/Match';
import ClassicResult from '../models/ClassicResult';

const router = Router();

// ─── DB Seeding ────────────────────────────────────────────────────────────────
router.post('/seed', async (req, res) => {
  try {
    const { tournaments = [], groups = [], players = [], matches = [], classicResults = [] } = req.body;

    await Promise.all([
      Tournament.deleteMany({}),
      Group.deleteMany({}),
      Player.deleteMany({}),
      Match.deleteMany({}),
      ClassicResult.deleteMany({}),
    ]);

    if (tournaments.length) await Tournament.insertMany(tournaments.map((t: any) => ({ ...t, _id: t.id })));
    if (groups.length) await Group.insertMany(groups.map((g: any) => ({ ...g, _id: g.id })));
    if (players.length) await Player.insertMany(players.map((p: any) => ({ ...p, _id: p.id })));
    if (matches.length) await Match.insertMany(matches.map((m: any) => ({ ...m, _id: m.id })));
    if (classicResults.length) await ClassicResult.insertMany(classicResults.map((r: any) => ({ ...r, _id: r.id })));

    res.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Failed to seed data' });
  }
});

// ─── App Data ──────────────────────────────────────────────────────────────────
router.get('/data', async (_req, res) => {
  try {
    const [tournaments, groups, players, matches, classicResults] = await Promise.all([
      Tournament.find(),
      Group.find(),
      Player.find(),
      Match.find(),
      ClassicResult.find(),
    ]);
    res.json({ tournaments, groups, players, matches, classicResults });
  } catch (error) {
    console.error('Data fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// ─── Tournaments ───────────────────────────────────────────────────────────────
router.post('/tournaments', async (req, res) => {
  try {
    const { id, ...rest } = req.body;
    const tournament = new Tournament({ _id: id, ...rest });
    await tournament.save();
    res.json(tournament);
  } catch (error) {
    console.error('Create tournament error:', error);
    res.status(500).json({ error: 'Failed to create tournament' });
  }
});

router.put('/tournaments/:id', async (req, res) => {
  try {
    const { id, _id, ...rest } = req.body; // id va _id ni yangilashdan chiqaramiz
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      { $set: rest },
      { new: true }
    );
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    res.json(tournament);
  } catch (error) {
    console.error('Update tournament error:', error);
    res.status(500).json({ error: 'Failed to update tournament' });
  }
});

router.delete('/tournaments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Promise.all([
      Tournament.findByIdAndDelete(id),
      Group.deleteMany({ tournamentId: id }),
      Player.deleteMany({ tournamentId: id }),
      Match.deleteMany({ tournamentId: id }),
      ClassicResult.deleteMany({ tournamentId: id }),
    ]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete tournament error:', error);
    res.status(500).json({ error: 'Failed to delete tournament' });
  }
});

// ─── Groups ────────────────────────────────────────────────────────────────────
router.post('/groups', async (req, res) => {
  try {
    const { id, ...rest } = req.body;
    const group = new Group({ _id: id, ...rest });
    await group.save();
    res.json(group);
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

router.delete('/groups/:id', async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);
    await Player.deleteMany({ groupId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

// ─── Players ───────────────────────────────────────────────────────────────────
router.post('/players', async (req, res) => {
  try {
    const { id, ...rest } = req.body;
    const player = new Player({ _id: id, ...rest });
    await player.save();
    res.json(player);
  } catch (error) {
    console.error('Create player error:', error);
    res.status(500).json({ error: 'Failed to create player' });
  }
});

router.put('/players/:id', async (req, res) => {
  try {
    const { id, _id, ...rest } = req.body;
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { $set: rest },
      { new: true }
    );
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (error) {
    console.error('Update player error:', error);
    res.status(500).json({ error: 'Failed to update player' });
  }
});

router.delete('/players/:id', async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete player error:', error);
    res.status(500).json({ error: 'Failed to delete player' });
  }
});

// ─── Matches ───────────────────────────────────────────────────────────────────
router.post('/matches/bulk', async (req, res) => {
  try {
    const matches: any[] = req.body;
    if (!Array.isArray(matches) || matches.length === 0) {
      return res.json([]);
    }
    const inserted = await Match.insertMany(
      matches.map((m) => ({ ...m, _id: m.id }))
    );
    res.json(inserted);
  } catch (error) {
    console.error('Bulk create matches error:', error);
    res.status(500).json({ error: 'Failed to create matches' });
  }
});

router.put('/matches/:id', async (req, res) => {
  try {
    const { id, _id, ...rest } = req.body;
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { $set: rest },
      { new: true }
    );
    if (!match) return res.status(404).json({ error: 'Match not found' });
    res.json(match);
  } catch (error) {
    console.error('Update match error:', error);
    res.status(500).json({ error: 'Failed to update match' });
  }
});

router.post('/matches/bulk-update', async (req, res) => {
  try {
    const updates: any[] = req.body;
    if (!Array.isArray(updates)) return res.json({ success: true });

    await Promise.all(
      updates.map((m) => {
        const { id, _id, ...rest } = m;
        const matchId = id || _id;
        return Match.findByIdAndUpdate(matchId, { $set: rest });
      })
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Bulk update matches error:', error);
    res.status(500).json({ error: 'Failed to bulk update matches' });
  }
});

// ─── Classic Results ───────────────────────────────────────────────────────────
router.post('/classicResults', async (req, res) => {
  try {
    const { id, ...rest } = req.body;
    const result = new ClassicResult({ _id: id, ...rest });
    await result.save();
    res.json(result);
  } catch (error) {
    console.error('Create classic result error:', error);
    res.status(500).json({ error: 'Failed to create classic result' });
  }
});

router.put('/classicResults/:id', async (req, res) => {
  try {
    const { id, _id, ...rest } = req.body;
    const result = await ClassicResult.findByIdAndUpdate(
      req.params.id,
      { $set: rest },
      { new: true }
    );
    if (!result) return res.status(404).json({ error: 'Classic result not found' });
    res.json(result);
  } catch (error) {
    console.error('Update classic result error:', error);
    res.status(500).json({ error: 'Failed to update classic result' });
  }
});

router.delete('/classicResults/:id', async (req, res) => {
  try {
    await ClassicResult.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete classic result error:', error);
    res.status(500).json({ error: 'Failed to delete classic result' });
  }
});

export default router;
