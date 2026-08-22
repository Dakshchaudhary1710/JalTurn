const mongoose = require('mongoose');
const { waterGroups, farmers, plots, waterTurns, disputes, auditLogs } = require('../data/seedData');
const WaterGroup = require('../models/WaterGroup');
const Farmer = require('../models/Farmer');
const Plot = require('../models/Plot');
const WaterTurn = require('../models/WaterTurn');
const Dispute = require('../models/Dispute');
const AuditLog = require('../models/AuditLog');

const seedDatabase = async () => {
  try {
    const groupCount = await WaterGroup.countDocuments();
    if (groupCount === 0) {
      const clean = (arr) => arr.map(({ _id, ...rest }) => rest);
      console.log('Seeding initial data into MongoDB...');
      await WaterGroup.insertMany(clean(waterGroups));
      await Farmer.insertMany(clean(farmers));
      await Plot.insertMany(clean(plots));
      await WaterTurn.insertMany(clean(waterTurns));
      await Dispute.insertMany(clean(disputes));
      await AuditLog.insertMany(clean(auditLogs));
      console.log('Database seeded successfully.');
    } else {
      console.log('Database already contains data. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
