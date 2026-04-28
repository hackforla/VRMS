import mongoose from 'mongoose';

const Role = mongoose.model(
  "Role",
  new mongoose.Schema({
    name: { type: String },
  })
);

export { Role };
